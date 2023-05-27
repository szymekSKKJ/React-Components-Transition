import "./ExampleMenu.css";
import { TransitionButton } from "react-components-transition";

const ExampleMenu = () => {
  return (
    <div className="example-menu">
      <TransitionButton show="Example1" animationIn={{ className: "animationIn", duration: 750 }} animationOut={{ className: "animationOut", duration: 750 }}>
        Show Example1
      </TransitionButton>
      <TransitionButton show="Example2" animationIn={{ className: "animationIn", duration: 750 }} animationOut={{ className: "animationOut", duration: 750 }}>
        Show Example2
      </TransitionButton>
      <TransitionButton show="Example3" animationIn={{ className: "animationIn", duration: 750 }} animationOut={{ className: "animationOut", duration: 750 }}>
        Show Example3
      </TransitionButton>
      <TransitionButton show="Example4" animationIn={{ className: "animationIn", duration: 750 }} animationOut={{ className: "animationOut", duration: 750 }}>
        Show Example4
      </TransitionButton>
    </div>
  );
};

export default ExampleMenu;
