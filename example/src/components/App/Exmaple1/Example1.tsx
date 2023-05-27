import { TransitionButton } from "react-components-transition";
import "./Example1.css";

const Exmaple1 = () => {
  return (
    <div className="example-1">
      <p>Example 1</p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras odio ante, laoreet at mollis sit amet, tristique vitae lectus. Donec sed tellus pharetra,
        viverra diam sed, bibendum odio. Donec nec porta eros, non interdum libero. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras at lectus
        dignissim, euismod massa non, tincidunt tellus. Nulla venenatis mi a odio molestie tristique. Mauris vestibulum augue in est euismod cursus. Ut nibh
        turpis, commodo at porttitor viverra, vulputate vel orci. Nam velit nisi, finibus at quam sit amet, commodo commodo odio. Maecenas eu odio non massa
        euismod facilisis.
      </p>
      <TransitionButton show="Example2" animation={{ className: "animation", duration: 500 }}>
        Show Example2
      </TransitionButton>
    </div>
  );
};

export default Exmaple1;
