import { Dispatch, ReactElement, SetStateAction, createContext, useContext, useState } from "react";

const CurrentVisibleComponentKeyContext = createContext<Dispatch<SetStateAction<string>> | null>(null);

const TransitionButton = ({ show, children, ...props }: { show: string } & React.ComponentPropsWithoutRef<"button">) => {
  const setCurrentVisibleComponentKey = useContext(CurrentVisibleComponentKeyContext)!; // Not null because it is passing through context

  return (
    <button
      {...props}
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setCurrentVisibleComponentKey(show);

        props.onClick && props.onClick(e);
      }}>
      {children}
    </button>
  );
};

export { TransitionButton };

const ComponentsTransition = ({ children }: { children: ReactElement[] }) => {
  const [currentVisibleComponentKey, setCurrentVisibleComponentKey] = useState<string>(children[0].key as string);

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
