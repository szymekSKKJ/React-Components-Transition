import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useEffect, useState } from "react";
import ReactDomServer from "react-dom/server";
import { createPortal } from "react-dom";

type childObject = {
  key: string;
  animationIn: { className: string; duration: number } | null;
  animationOut: { className: string; duration: number } | null;
  isVisible: boolean;
  visibilityCounter: number;
  isStatic: boolean;
};

const CurrentVisibleComponentKeyContext = createContext<{
  setChildrenObject: Dispatch<SetStateAction<childObject[]>>;
  setChildrenCounter: Dispatch<SetStateAction<number>>;
} | null>(null);

const TransitionButton = ({
  show,
  children,
  animationIn = null,
  animationOut = null,
  ...props
}: {
  show: string;
  animationIn?: { className: string; duration: number } | null;
  animationOut?: { className: string; duration: number } | null;
} & React.ComponentPropsWithoutRef<"button">) => {
  const contextObject = useContext(CurrentVisibleComponentKeyContext);

  return (
    <button
      {...props}
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (contextObject && typeof contextObject.setChildrenObject && typeof contextObject.setChildrenCounter) {
          const { setChildrenObject, setChildrenCounter } = contextObject;
          props.onClick && props.onClick(e);

          setChildrenCounter((visibilityCounterCurrentValue) => {
            if (animationIn || animationOut) {
              setChildrenObject((currentValues) => {
                const visibleChildren = currentValues.filter((child) => child.isVisible && child.isStatic === false);
                const currentChild = currentValues.find((child) => child.key === show);

                // If undefined it means, the current show child is this same as current visible child
                const currentHidingChild = visibleChildren.find((child) => child.key !== show && child.isStatic === false);

                // Prohibiting set visible another child when two are visible

                if (currentHidingChild !== undefined && visibleChildren.length < 2 && currentChild) {
                  currentChild.isVisible = true;
                  currentChild.animationIn = animationIn;
                  currentChild.visibilityCounter = visibilityCounterCurrentValue + 1;

                  currentHidingChild.animationOut = animationOut;

                  // Setting last state

                  const longestAnimationTimeDuration = animationIn
                    ? animationOut
                      ? animationIn.duration > animationOut.duration
                        ? animationIn.duration
                        : animationOut.duration
                      : animationIn.duration
                    : animationOut?.duration;

                  setTimeout(() => {
                    setChildrenObject((currentValues) => {
                      const childrenObject = [...currentValues];

                      childrenObject.forEach((child) => {
                        if (child.key !== show) {
                          child.isVisible = false;
                          currentChild.animationIn = null;
                          currentHidingChild.animationOut = null;
                        } else {
                          child.isVisible = true;
                          child.visibilityCounter = visibilityCounterCurrentValue + 1;
                        }
                      });

                      return childrenObject;
                    });
                  }, longestAnimationTimeDuration);

                  return [...currentValues];
                } else {
                  return [...currentValues];
                }
              });
            } else {
              // Allready setting last state

              setChildrenObject((currentValues) => {
                const childrenObject = [...currentValues];

                childrenObject.forEach((child) => {
                  if (child.key !== show) {
                    child.isVisible = false;
                  } else {
                    child.isVisible = true;
                    child.visibilityCounter = visibilityCounterCurrentValue + 1;
                  }
                });

                return childrenObject;
              });
            }

            return visibilityCounterCurrentValue + 1;
          });
        }
      }}>
      {children}
    </button>
  );
};

export { TransitionButton };

const TransitionElement = ({ children, childProps }: { children: ReactElement; childProps: childObject; childrenObject: childObject[] }) => {
  useEffect(() => {
    // This is not the best idea but allows to render with animations witchout div element wrapper, which leads to styles problems

    const parsedHTMLChild = new DOMParser().parseFromString(ReactDomServer.renderToStaticMarkup(children), "text/xml");

    const parsedHTMLChildComponent = parsedHTMLChild.firstChild as HTMLElement;

    const childComponentDomElement = document.querySelector(`.${parsedHTMLChildComponent.className}`) as HTMLElement;

    const { visibilityCounter, animationIn, animationOut } = childProps;

    if (animationIn) {
      childComponentDomElement.classList.add(animationIn.className);
    }
    if (animationOut) {
      childComponentDomElement.classList.add(animationOut.className);
    }

    childComponentDomElement.style.zIndex = `${visibilityCounter}`;
  });

  return children;
};

const TransitionChild = ({ children }: { isStatic: boolean; children: ReactElement; renderTo?: object }) => {
  return children;
};

export { TransitionChild };

const ComponentsTransition = ({ children }: { children: ReactElement[] }) => {
  const [childrenObject, setChildrenObject] = useState<childObject[]>([]);
  const [childrenCounter, setChildrenCounter] = useState(1);

  childrenCounter;

  childrenObject.sort((a, b) => a.visibilityCounter - b.visibilityCounter);

  useEffect(() => {
    const childrenArray: childObject[] = [];

    let isFoundFirstVisible = false;

    children.map((child) => {
      const { key, props } = child;

      const visibility = props.isStatic === true ? true : isFoundFirstVisible === false ? true : false;

      childrenArray.push({
        key: key as string,
        animationIn: null,
        animationOut: null,
        isVisible: visibility,
        visibilityCounter: 0,
        isStatic: props.isStatic === true ? true : false,
      });

      if (isFoundFirstVisible === false && props.isStatic !== true) {
        isFoundFirstVisible = true;
      }
    });

    setChildrenObject(() => [...childrenArray]);
  }, []);

  return (
    <CurrentVisibleComponentKeyContext.Provider value={{ setChildrenObject: setChildrenObject, setChildrenCounter: setChildrenCounter }}>
      {childrenObject.length !== 0 &&
        childrenObject.map((child) => {
          const { key, isVisible, isStatic } = child;

          const childComponent = children.find((childComponent) => childComponent.key === key)!; // The given key is initialy from children

          if (isStatic) {
            if (childComponent.props.renderTo) {
              return createPortal(
                <TransitionElement key={key} childProps={child} childrenObject={childrenObject}>
                  <childComponent.type {...childComponent.props}></childComponent.type>
                </TransitionElement>,
                childComponent.props.renderTo.current
              );
            } else {
              return (
                <TransitionElement key={key} childProps={child} childrenObject={childrenObject}>
                  <childComponent.type {...childComponent.props}></childComponent.type>
                </TransitionElement>
              );
            }
          } else if (isVisible) {
            return (
              <TransitionElement key={key} childProps={child} childrenObject={childrenObject}>
                <childComponent.type {...childComponent.props}></childComponent.type>
              </TransitionElement>
            );
          }
        })}
    </CurrentVisibleComponentKeyContext.Provider>
  );
};

export { ComponentsTransition };
