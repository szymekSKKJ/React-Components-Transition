import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useEffect, useRef, useState } from "react";
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
  const { setChildrenObject, setChildrenCounter } = useContext(CurrentVisibleComponentKeyContext)!; // Not null because it is passing through context AFTER rendering this button

  return (
    <button
      {...props}
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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
      }}>
      {children}
    </button>
  );
};

export { TransitionButton };

const TransitionElement = ({ children, childProps }: { children: ReactElement; childProps: childObject; childrenObject: childObject[] }) => {
  return (
    <div
      ref={(node) => {
        if (node) {
          const { visibilityCounter, animationIn, animationOut } = childProps;

          const childComponent = node.firstChild as HTMLElement;

          childComponent.style.zIndex = `${visibilityCounter}`;

          if (animationIn) {
            childComponent.classList.add(animationIn.className);
          }
          if (animationOut) {
            childComponent.classList.add(animationOut.className);
          }
        }
      }}>
      {children}
    </div>
  );
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
        visibilityCounter: -1,
        isStatic: props.isStatic === true ? true : false,
      });

      if (isFoundFirstVisible === false && props.isStatic !== true) {
        isFoundFirstVisible = true;
      }
    });

    setChildrenObject(() => [...childrenArray]);
  }, []);

  return (
    <>
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
    </>
  );
};

export { ComponentsTransition };
