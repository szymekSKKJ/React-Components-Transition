import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useEffect, useState } from "react";

type childObject = { key: string; animation: { className: string; duration: number } | null; isVisible: boolean; visibilityCounter: number; isStatic: boolean };

const CurrentVisibleComponentKeyContext = createContext<{
  setChildrenObject: Dispatch<SetStateAction<childObject[]>>;
  setChildrenCounter: Dispatch<SetStateAction<number>>;
} | null>(null);

const TransitionButton = ({
  show,
  children,
  animation,
  ...props
}: { show: string; animation?: { className: string; duration: number } } & React.ComponentPropsWithoutRef<"button">) => {
  const { setChildrenObject, setChildrenCounter } = useContext(CurrentVisibleComponentKeyContext)!; // Not null because it is passing through context AFTER rendering this button

  return (
    <button
      {...props}
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        props.onClick && props.onClick(e);

        setChildrenCounter((visibilityCounterCurrentValue) => {
          if (animation) {
            setChildrenObject((currentValues) => {
              const visibleChildren = currentValues.filter((child) => child.isVisible && child.isStatic === false);
              const currentChild = currentValues.find((child) => child.key === show);

              // If undefined it means, the current show child is this same as current visible child
              const notCurrentVisibleChild = visibleChildren.find((child) => child.key !== show && child.isStatic === false);

              // Prohibiting set visible another child when two are visible

              if (notCurrentVisibleChild !== undefined && visibleChildren.length < 2 && currentChild) {
                currentChild.isVisible = true;
                currentChild.animation = animation;
                currentChild.visibilityCounter = visibilityCounterCurrentValue + 1;

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

const TransitionElement = ({
  children,
  childProps,
  setChildrenObject,
}: {
  children: ReactElement;
  childProps: childObject;
  setChildrenObject: Dispatch<SetStateAction<childObject[]>>;
  childrenObject: childObject[];
}) => {
  useEffect(() => {
    const { animation } = childProps;

    let animationTimeout: number;

    if (animation) {
      const { animation } = childProps;

      animationTimeout = setTimeout(() => {
        setChildrenObject((currentValues) => {
          const childrenObject = [...currentValues];

          childrenObject.forEach((child) => {
            if (child.key !== childProps.key) {
              child.isVisible = false;
            }
          });

          return childrenObject;
        });
      }, animation?.duration);
    }

    return () => {
      clearTimeout(animationTimeout);
    };
  }, []);

  return (
    <div
      ref={(node) => {
        if (node) {
          const { visibilityCounter, animation } = childProps;

          const childComponent = node.firstChild as HTMLElement;

          childComponent.style.zIndex = `${visibilityCounter}`;

          if (animation) {
            childComponent.classList.add(animation.className);
          }
        }
      }}>
      {children}
    </div>
  );
};

const TransitionChild = ({ children }: { isStatic: boolean; children: ReactElement }) => {
  return children;
};

export { TransitionChild };

const ComponentsTransition = ({ children }: { children: ReactElement[] }) => {
  const [childrenObject, setChildrenObject] = useState<childObject[]>([]);
  const [childrenCounter, setChildrenCounter] = useState(1);

  childrenObject.sort((a, b) => a.visibilityCounter - b.visibilityCounter);

  useEffect(() => {
    const childrenArray: childObject[] = [];

    let isFoundFirstVisible = false;

    children.map((child, index) => {
      const { key, props } = child;

      const visibility = props.isStatic ? true : isFoundFirstVisible === false ? true : false;

      childrenArray.push({
        key: key as string,
        animation: null,
        isVisible: visibility,
        visibilityCounter: -1,
        isStatic: props.isStatic === true ? true : false,
      });

      if (isFoundFirstVisible === false && props.isStatic !== true) {
        isFoundFirstVisible = true;
      }
    });

    return () => setChildrenObject((currentValues) => [...childrenArray, ...currentValues]);
  }, []);

  return (
    <>
      <CurrentVisibleComponentKeyContext.Provider value={{ setChildrenObject: setChildrenObject, setChildrenCounter: setChildrenCounter }}>
        {childrenObject.map((child) => {
          const { key, isVisible, isStatic } = child;

          const childComponent = children.find((childComponent) => childComponent.key === key)!; // The given key is initialy from children

          if (isStatic) {
            return (
              <TransitionElement key={key} childProps={child} setChildrenObject={setChildrenObject} childrenObject={childrenObject}>
                <childComponent.type {...childComponent.props}></childComponent.type>
              </TransitionElement>
            );
          } else if (isVisible) {
            return (
              <TransitionElement key={key} childProps={child} setChildrenObject={setChildrenObject} childrenObject={childrenObject}>
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
