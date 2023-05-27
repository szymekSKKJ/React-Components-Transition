import { TransitionButton } from "react-components-transition";
import "./Example4.css";

const Example4 = () => {
  return (
    <div className="example-4">
      <p>Example 4</p>
      <p>
        Morbi sit amet lobortis risus. Mauris pretium dignissim ex vel auctor. Nullam commodo, dolor interdum tincidunt vestibulum, ex enim vehicula nibh, et
        consequat ante turpis nec mauris. Nulla interdum placerat laoreet. Ut feugiat faucibus orci, eu fermentum odio facilisis bibendum. Sed pretium nibh eu
        ligula condimentum, a tempus nisi pellentesque. Etiam sodales tellus in gravida dictum. Vestibulum eu elementum neque. Nunc vel erat sem. Phasellus
        hendrerit mi lorem, non vestibulum mi molestie a. Mauris hendrerit ornare purus nec fringilla. Etiam massa justo, cursus at fringilla a, aliquet eget
        elit. Aliquam ullamcorper sem convallis tincidunt ultricies. Morbi in ipsum sit amet mauris pulvinar tincidunt. Donec dui nunc, facilisis eget
        sollicitudin quis, consectetur quis orci.
      </p>
      <TransitionButton show="Example1" animationIn={{ className: "animationIn", duration: 750 }} animationOut={{ className: "animationOut", duration: 750 }}>
        Show Example1
      </TransitionButton>
    </div>
  );
};

export default Example4;
