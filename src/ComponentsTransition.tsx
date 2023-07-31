import {
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import ReactDomServer from "react-dom/server";

const ComponentsTransitionContext = createContext<Dispatch<SetStateAction<TransitionChildType[]>>>((value) => value);

type TransitionChildType = {
  key: string;
  isVisible: boolean;
  child: ReactNode;
  className: string;
  animationIn: { className: string; duration: number } | null;
  animationOut: { className: string; duration: number } | null;
  parentElementClassName: undefined | string;
  isHiding: boolean;
  renderToRef: object;
};

const TransitionButton = ({
  children,
  show,
  animationIn = null,
  animationOut = null,
  ...props
}: {
  children: ReactNode;
  show: string;
  animationIn?: { className: string; duration: number } | null;
  animationOut?: { className: string; duration: number } | null;
} & React.ComponentPropsWithoutRef<"button">) => {
  const setChildrenTransition = useContext(ComponentsTransitionContext);
  const timeoutRef = useRef<null | number>(null);

  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <button
      {...props}
      onClick={() => {
        setChildrenTransition((currentValues) => {
          const copiedCurrentValues = [...currentValues];

          const foundChildrenTransition = copiedCurrentValues.find((childrenTransition) => childrenTransition.key === show)!;

          const currentVisibleChild = copiedCurrentValues.find(
            (childrenTransition) => childrenTransition.isVisible === true && childrenTransition.key !== show && childrenTransition.isHiding === false
          )!;

          if (currentVisibleChild) {
            if (animationOut !== null) {
              currentVisibleChild.isHiding = true;
              currentVisibleChild.animationOut = animationOut;

              const timeout = setTimeout(() => {
                currentVisibleChild.isHiding = false;
                currentVisibleChild.isVisible = false;

                foundChildrenTransition.isVisible = true;

                setChildrenTransition(() => {
                  return [...copiedCurrentValues];
                });
              }, animationOut.duration);

              timeoutRef.current = timeout;
            } else {
              currentVisibleChild.isVisible = false;
            }
          }

          foundChildrenTransition.animationIn = animationIn;

          foundChildrenTransition.isVisible = true;

          return copiedCurrentValues;
        });
      }}>
      {children}
    </button>
  );
};

export { TransitionButton };

const TransitionChild = ({
  children,
  childData,
  zIndexCounter,
  setZIndexcounter,
}: {
  children: ReactElement;
  childData: TransitionChildType;
  zIndexCounter: number;
  setZIndexcounter: Dispatch<SetStateAction<number>>;
}) => {
  useEffect(() => {
    const parentElement = document.querySelector(`.${childData.parentElementClassName}`);

    const childElement = parentElement?.querySelector(`.${childData.className}`) as HTMLElement;

    if (childElement) {
      childElement.style.zIndex = `${zIndexCounter}`;

      if (childElement && childData.animationIn && !childElement.className.includes(childData.animationIn.className)) {
        childElement.classList.add(childData.animationIn.className);
      }

      if (childElement && childData.animationOut && childData.isHiding && !childElement.className.includes(childData.animationOut.className)) {
        childElement.classList.add(childData.animationOut.className);
      }
    }

    setZIndexcounter((currentValue) => currentValue + 1);
  }, []);

  return children;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TransitionChildStatic = ({ children, renderToRef }: { children: ReactElement; renderToRef: object }) => {
  return children;
};

export { TransitionChildStatic };

const ComponentsTransition = ({
  children,
  firstVisible = null,
  parentElementRef,
}: {
  children: ReactNode[];
  firstVisible?: null | string;
  parentElementRef: { current: HTMLElement | null };
}) => {
  const [childrenTransition, setChildrenTransition] = useState<TransitionChildType[]>([]);
  const [zIndexCounter, setZIndexcounter] = useState(1);

  useLayoutEffect(() => {
    const childrenTransition: TransitionChildType[] = [];

    try {
      children.forEach((child, index) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const { key, props } = child;

        const parsedHTMLChild = new DOMParser().parseFromString(ReactDomServer.renderToStaticMarkup(child as ReactElement), "text/xml");

        if (parsedHTMLChild.firstChild && parsedHTMLChild.firstChild.nodeName !== "html") {
          const wrappedChildElement = parsedHTMLChild.firstChild as HTMLDivElement;

          const isVisibleStatus = firstVisible && firstVisible === key ? true : firstVisible ? false : index == 0 ? true : false;

          childrenTransition.push({
            key: key,
            isVisible: isVisibleStatus,
            child: child,
            className: wrappedChildElement.className,
            animationIn: null,
            animationOut: null,
            parentElementClassName: parentElementRef.current?.className,
            isHiding: false,
            renderToRef: props.renderToRef ? props.renderToRef : false,
          });
        } else {
          throw {};
        }
      });

      setChildrenTransition(childrenTransition);
    } catch {
      console.error(
        "The given child is not valid element. This may happen when '<React.Fragment></React.Fragment>' ('<></>') is used. Every given child must be wrapped into any element"
      );
      return;
    }
  }, []);

  useLayoutEffect(() => {
    const childrenTransitionAfter: TransitionChildType[] = [];

    if (childrenTransition.length !== 0) {
      childrenTransition.forEach((childData) => {
        const { isVisible, key, className, animationIn, animationOut, isHiding, renderToRef } = childData;

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        const foundChild = children.find((child) => child.key === key);

        childrenTransitionAfter.push({
          key: key,
          isVisible: isVisible,
          child: foundChild,
          className: className,
          animationIn: animationIn,
          animationOut: animationOut,
          parentElementClassName: parentElementRef.current?.className,
          isHiding: isHiding,
          renderToRef: renderToRef,
        });
      });

      setChildrenTransition(childrenTransitionAfter);
    }
  }, [children, parentElementRef.current]);

  return (
    <ComponentsTransitionContext.Provider value={setChildrenTransition}>
      {childrenTransition.length !== 0 &&
        childrenTransition.map((childData) => {
          const { child, isVisible, key, isHiding, renderToRef } = childData;

          const clonedElement = cloneElement(child as ReactElement);

          if (renderToRef) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            return createPortal(child, renderToRef.current);
          } else if (isVisible || isHiding) {
            return (
              <TransitionChild key={key} childData={childData} zIndexCounter={zIndexCounter} setZIndexcounter={setZIndexcounter}>
                {clonedElement}
              </TransitionChild>
            );
          }
        })}
    </ComponentsTransitionContext.Provider>
  );
};

export default ComponentsTransition;
