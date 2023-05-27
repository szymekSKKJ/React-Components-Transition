import { TransitionButton } from "react-components-transition";
import "./Example3.css";

const Example3 = () => {
  return (
    <div className="example-3">
      <p>Example 3</p>
      <p>
        Donec a felis velit. Aenean libero nibh, lobortis eu pulvinar vel, laoreet quis lorem. Maecenas sit amet gravida risus. Donec quis diam congue, mattis
        quam lobortis, molestie est. Fusce aliquam lectus mollis sapien consectetur, id facilisis velit pretium. Nulla arcu quam, ultrices a ornare vel, feugiat
        eget tellus. Mauris posuere, enim a dictum rutrum, nunc nibh tincidunt quam, ac ultrices magna elit sed turpis.
      </p>
      <TransitionButton show="Example4" animation={{ className: "animation", duration: 500 }}>
        Show Example4
      </TransitionButton>
    </div>
  );
};

export default Example3;
