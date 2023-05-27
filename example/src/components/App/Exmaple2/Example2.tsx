import { TransitionButton } from "react-components-transition";
import "./Example2.css";

const Exmaple2 = () => {
  return (
    <div className="example-2">
      <p>Example 2</p>
      <p>
        Cras rutrum, eros eget gravida malesuada, lorem augue dignissim ante, ac feugiat ante mauris vitae quam. Cras viverra scelerisque metus in ullamcorper.
        Ut at pharetra eros, quis aliquam dui. Donec nec augue metus. Nunc eu eros purus. Fusce elit sapien, ultricies eget auctor nec, fermentum non velit.
        Donec scelerisque nisi sed posuere luctus.
      </p>
      <TransitionButton show="Example3" animationIn={{ className: "animationIn", duration: 750 }} animationOut={{ className: "animationOut", duration: 750 }}>
        Show Example3
      </TransitionButton>
    </div>
  );
};

export default Exmaple2;
