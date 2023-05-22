import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useEffect, useState } from "react";

type childObject = { key: string; animation: { className: string; duration: number } | null; isVisible: boolean; visibilityCounter: number };

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
              const visibleChildren = currentValues.filter((child) => child.isVisible);

              // Prohibiting set visible another child when two are visible

              if (visibleChildren.length < 2) {
                return [{ key: show, animation: animation, isVisible: true, visibilityCounter: visibilityCounterCurrentValue + 1 }, ...currentValues];
              } else {
                return currentValues;
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

const TransitionChild = ({
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
      style={{ display: "inline-block" }}
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

const ComponentsTransition = ({ children }: { children: ReactElement[] }) => {
  const [childrenObject, setChildrenObject] = useState<childObject[]>([
    { key: children[0].key as string, animation: null, isVisible: true, visibilityCounter: 1 },
  ]);
  const [childrenCounter, setChildrenCounter] = useState(1);

  childrenObject.sort((a, b) => a.visibilityCounter - b.visibilityCounter);

  useEffect(() => {
    const childrenArray: childObject[] = [];

    children.map((child, index) => {
      // First child already exist

      if (index !== 0) {
        const { key } = child;

        childrenArray.push({ key: key as string, animation: null, isVisible: false, visibilityCounter: -1 });
      }
    });

    return () => setChildrenObject((currentValues) => [...childrenArray, ...currentValues]);
  }, []);

  return (
    <>
      <CurrentVisibleComponentKeyContext.Provider value={{ setChildrenObject: setChildrenObject, setChildrenCounter: setChildrenCounter }}>
        {childrenObject.map((child) => {
          const { key, isVisible } = child;

          if (isVisible) {
            const childComponent = children.find((childComponent) => childComponent.key === key)!; // The given key is initialy from children

            return (
              <TransitionChild key={key} childProps={child} setChildrenObject={setChildrenObject} childrenObject={childrenObject}>
                <childComponent.type {...childComponent.props}></childComponent.type>
              </TransitionChild>
            );
          }
        })}
      </CurrentVisibleComponentKeyContext.Provider>
    </>
  );
};

export { ComponentsTransition };
