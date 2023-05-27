import "./ExampleMenu.css";
import { TransitionButton } from "react-components-transition";

const ExampleMenu = () => {
  return (
    <div className="example-menu">
      <TransitionButton show="Example1" animation={{ className: "animation", duration: 500 }}>
        Show Example1
      </TransitionButton>
      <TransitionButton show="Example2" animation={{ className: "animation", duration: 500 }}>
        Show Example2
      </TransitionButton>
      <TransitionButton show="Example3" animation={{ className: "animation", duration: 500 }}>
        Show Example3
      </TransitionButton>
      <TransitionButton show="Example4" animation={{ className: "animation", duration: 500 }}>
        Show Example4
      </TransitionButton>
    </div>
  );
};

export default ExampleMenu;
