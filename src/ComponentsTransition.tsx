import { ButtonHTMLAttributes, Dispatch, ReactNode, SetStateAction, cloneElement, createContext, useContext, useEffect, useState } from "react";

const ComponentsTransitionSetChildrenContext = createContext<React.Dispatch<React.SetStateAction<componentsTransitionChildren>> | null>(null);

type componentsTransitionChildren = {
  id: `${string}-${string}-${string}-${string}-${string}`;
  isVisible: boolean;
  key: string;
  domElement: null | HTMLElement;
  unmountTimeoutRef: null | ReturnType<typeof setTimeout>;
}[];

interface TransitionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  show: string;
  animationIn?: { className: string; duration: number };
  animationOut?: { className: string; duration: number };
  context?: null | Dispatch<SetStateAction<componentsTransitionChildren>>;
}

const TransitionButton = ({ children, show, animationIn, animationOut, context, onClick, ...rest }: TransitionButtonProps) => {
  const setChildrenFromContext = useContext(ComponentsTransitionSetChildrenContext);

  const setChildren = context ? context : setChildrenFromContext;
  const [isClicked, setIsClicked] = useState(false);

  useEffect(() => {
    isClicked &&
      setChildren &&
      setChildren((currentValue) => {
        const copiedCurrentValue = [...currentValue];

        copiedCurrentValue.forEach((data) => {
          const { isVisible, key } = data;

          if (isVisible && key !== show && animationOut === undefined && animationIn === undefined) {
            data.isVisible = false;
          }
          if (key === show) {
            data.isVisible = true;
          }
        });

        const foundChildToGiveAnimationIn = copiedCurrentValue.find((data) => data.key === show);

        if (foundChildToGiveAnimationIn) {
          const { domElement, unmountTimeoutRef } = foundChildToGiveAnimationIn;

          setTimeout(() => {
            setChildren((currentValue) => {
              const copiedCurrentValue = [...currentValue];

              const foundChildToGiveAnimationInLocal = copiedCurrentValue.find((data) => data.key === foundChildToGiveAnimationIn.key);

              if (foundChildToGiveAnimationInLocal) {
                const { domElement } = foundChildToGiveAnimationInLocal;

                if (domElement && animationIn) {
                  domElement.classList.add(animationIn.className);
                }
              }

              return copiedCurrentValue;
            });
          });

          if (domElement && animationOut) {
            domElement.classList.remove(animationOut.className);
          }

          if (unmountTimeoutRef) {
            foundChildToGiveAnimationIn.unmountTimeoutRef = null;
            clearTimeout(unmountTimeoutRef);
          }
        }

        const foundChildrenToGiveAnimationOut = copiedCurrentValue.filter((data) => data.isVisible && data.key !== show);

        foundChildrenToGiveAnimationOut.forEach((foundChildToGiveAnimationOut) => {
          const { id } = foundChildToGiveAnimationOut;

          if (animationOut) {
            setTimeout(() => {
              setChildren((currentValue) => {
                const copiedCurrentValue = [...currentValue];

                const foundChildToGiveAnimationOutLocal = copiedCurrentValue.find((data) => data.key === foundChildToGiveAnimationOut.key);

                if (foundChildToGiveAnimationOutLocal) {
                  const { domElement } = foundChildToGiveAnimationOutLocal;

                  if (domElement && animationIn) {
                    domElement.classList.add(animationOut.className);
                  }
                }

                return copiedCurrentValue;
              });
            });

            if (foundChildToGiveAnimationOut.unmountTimeoutRef === null) {
              foundChildToGiveAnimationOut.unmountTimeoutRef = setTimeout(() => {
                setChildren((currentValue) => {
                  const copiedCurrentValue = [...currentValue];

                  const childToUnmount = copiedCurrentValue.find((data) => data.id === id)!;

                  childToUnmount.isVisible = false;
                  childToUnmount.domElement = null;

                  return copiedCurrentValue;
                });
              }, animationOut.duration);
            }
          }
        });

        return copiedCurrentValue;
      });

    setIsClicked(false);
  }, [isClicked, setChildren, show]);

  return (
    <button
      {...rest}
      onClick={(event) => {
        if (setChildren) {
          if (isClicked === false) {
            setIsClicked(true);
            if (onClick) {
              setTimeout(() => {
                onClick(event);
              });
            }
          }
        }
      }}>
      {children}
    </button>
  );
};

export { TransitionButton };

interface ComponentsTransitionProps {
  children: ReactNode[];
  firstVisible?: null | string;
  getContext?: (...args: any) => void;
}

const ComponentsTransition = ({ children: childrenBefore, firstVisible, getContext }: ComponentsTransitionProps) => {
  //const [children, setChildren] = useState<componentsTransitionChildren>(setNewChildren(childrenBefore, firstVisible));

  const [children, setChildren] = useState<componentsTransitionChildren>(
    childrenBefore.map((childComponent, index) => {
      //@ts-ignore
      if (childComponent.key === null) {
        throw new Error(`Some child given in <ComponentsTransition /> has no given key prop. Make sure if every child has it's own key with unique name`);
      } else {
        //@ts-ignore
        const childComponentKey = childComponent.key;
        return {
          id: crypto.randomUUID(),
          isVisible: firstVisible ? (firstVisible === childComponentKey ? true : false) : index === 0 ? true : false,
          key: childComponentKey,
          domElement: null,
          unmountTimeoutRef: null,
        };
      }
    })
  );

  const keyComponentsToDisplay = children.filter((data) => data.isVisible).map((data) => data.key);

  useEffect(() => {
    if (getContext) {
      getContext(() => setChildren);
    }
  }, []);

  return (
    <ComponentsTransitionSetChildrenContext.Provider value={setChildren}>
      {/* {componentsToDisplay.map((data) => {
        return data.component;
      })} */}
      {childrenBefore.map((child) => {
        //@ts-ignore
        const componentKey = child.key;

        if (keyComponentsToDisplay.includes(componentKey)) {
          return cloneElement(
            //@ts-ignore
            child.type({ ...child.props }),
            {
              key: componentKey,
              ref: (element: HTMLElement) => {
                if (element) {
                  const foundChild = children.find((data) => data.key === componentKey)!;

                  if (foundChild.domElement === null) {
                    setChildren((currentValue) => {
                      const copiedCurrentValue = [...currentValue];

                      const foundChild = copiedCurrentValue.find((data) => data.key === componentKey)!;

                      foundChild.domElement = element;

                      return copiedCurrentValue;
                    });
                  }

                  return element;
                }
              },
            }
          );
        }
      })}
    </ComponentsTransitionSetChildrenContext.Provider>
  );
};

export default ComponentsTransition;
