import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useEffect, useState } from "react";

type childObject = { key: string; animation: { className: string; duration: number } | null; isVisible: boolean };

const CurrentVisibleComponentKeyContext = createContext<Dispatch<SetStateAction<childObject[]>> | null>(null);

const TransitionButton = ({
  show,
  children,
  animation,
  ...props
}: { show: string; animation?: { className: string; duration: number } } & React.ComponentPropsWithoutRef<"button">) => {
  const setChildrenObject = useContext(CurrentVisibleComponentKeyContext)!; // Not null because it is passing through context AFTER rendering this button

  return (
    <button
      {...props}
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        props.onClick && props.onClick(e);

        if (animation) {
          setChildrenObject((currentValues) => [{ key: show, animation: animation, isVisible: true }, ...currentValues]);
        } else {
          // Allready setting last state
          setChildrenObject((currentValues) => {
            const childrenObject = [...currentValues];

            childrenObject.forEach((child) => {
              if (child.key !== show) {
                child.isVisible = false;
              } else {
                child.isVisible = true;
              }
            });

            return childrenObject;
          });
        }
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
  setLastVisibleChildKey,
  childrenObject,
  lastVisibleChildKey,
}: {
  children: ReactElement;
  childProps: childObject;
  setChildrenObject: Dispatch<SetStateAction<childObject[]>>;
  setLastVisibleChildKey: Dispatch<SetStateAction<string>>;
  childrenObject: childObject[];
  lastVisibleChildKey: string;
}) => {
  useEffect(() => {
    const { animation } = childProps;

    childrenObject.forEach((child) => {
      if (child.key !== childProps.key) {
        setLastVisibleChildKey(child.key);
      }
    });

    if (animation) {
      setTimeout(() => {
        setChildrenObject((currentValues) => {
          const childrenObject = [...currentValues];

          childrenObject.forEach((child) => {
            if (child.key !== childProps.key) {
              child.isVisible = false;
            }
          });

          return childrenObject;
        });
      }, animation.duration);
    }
  }, []);

  return (
    <div
      style={{ display: "inline-block" }}
      ref={(node) => {
        if (node) {
          const { animation } = childProps;
          const childElement = node?.firstChild as HTMLElement;

          if (animation) {
            childElement.classList.add(animation.className);
            childElement.style.zIndex = lastVisibleChildKey === childProps.key ? "-1" : "0";
          }
        }
      }}>
      {children}
    </div>
  );
};

const ComponentsTransition = ({ children }: { children: ReactElement[] }) => {
  const [childrenObject, setChildrenObject] = useState<childObject[]>([{ key: children[0].key as string, animation: null, isVisible: true }]);
  const [lastVisibleChildKey, setLastVisibleChildKey] = useState(children[0].key as string);

  useEffect(() => {
    const childrenArray: childObject[] = [];

    children.map((child, index) => {
      // First child already exist

      if (index !== 0) {
        const { key } = child;

        childrenArray.push({ key: key as string, animation: null, isVisible: false });
      }
    });

    return () => setChildrenObject((currentValues) => [...childrenArray, ...currentValues]);
  }, []);

  return (
    <>
      <CurrentVisibleComponentKeyContext.Provider value={setChildrenObject}>
        {children.map((child) => {
          const { key } = child;

          const visibleChild = childrenObject.find((childObject) => childObject.isVisible === true && childObject.key === key);

          if (visibleChild !== undefined) {
            return (
              <TransitionChild
                key={key}
                childProps={visibleChild}
                setChildrenObject={setChildrenObject}
                setLastVisibleChildKey={setLastVisibleChildKey}
                childrenObject={childrenObject}
                lastVisibleChildKey={lastVisibleChildKey}>
                <child.type {...child.props}></child.type>
              </TransitionChild>
            );
          }
        })}
      </CurrentVisibleComponentKeyContext.Provider>
    </>
  );
};

export { ComponentsTransition };
