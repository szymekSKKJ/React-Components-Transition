import "./App.css";
import Exmaple1 from "./Exmaple1/Example1";
import Exmaple2 from "./Exmaple2/Example2";
import Example3 from "./Example3/Example3";
import Example4 from "./Example4/Example4";
import ExampleMenu from "./ExampleMenu/ExampleMenu";
import { useRef } from "react";
import ComponentsTransition, { TransitionChildStatic } from "react-components-transition/ComponentsTransition";

const App = () => {
  const exampleMenuRef = useRef(null);
  const contentRef = useRef(null);

  return (
    <div className="app">
      <div className="example-menu" ref={exampleMenuRef}></div>
      <div className="content" ref={contentRef}>
        <ComponentsTransition parentElementRef={contentRef}>
          <Exmaple1 key="Example1"></Exmaple1>
          <Exmaple2 key="Example2"></Exmaple2>
          <Example3 key="Example3"></Example3>
          <Example4 key="Example4"></Example4>

          <TransitionChildStatic renderToRef={exampleMenuRef}>
            <ExampleMenu key="ExampleMenu"></ExampleMenu>
          </TransitionChildStatic>
        </ComponentsTransition>
      </div>
    </div>
  );
};

export default App;
