import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useState } from "react";

const CurrentVisibleComponentKeyContext = createContext<Dispatch<SetStateAction<string>> | null>(null);

const TransitionButton = ({ ...props }) => {
  const setCurrentVisibleComponentKey = useContext(CurrentVisibleComponentKeyContext)!; // Not null because it is passing through context

  return (
    <button
      {...props}
      onClick={() => {
        setCurrentVisibleComponentKey(props.show);

        props.onClick && props.onClick();
      }}>
      {props.children}
    </button>
  );
};

export { TransitionButton };

const ComponentsTransition = ({ children, visible }: { children: ReactElement[]; visible: string }) => {
  const [currentVisibleComponentKey, setCurrentVisibleComponentKey] = useState<string>(visible);

  return (
    <>
      <CurrentVisibleComponentKeyContext.Provider value={setCurrentVisibleComponentKey}>
        {children.map((child) => {
          const { key } = child;
          if (currentVisibleComponentKey === key) {
            return child;
          }
        })}
      </CurrentVisibleComponentKeyContext.Provider>
    </>
  );
};

export { ComponentsTransition };
