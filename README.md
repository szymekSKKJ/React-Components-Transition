# React components transition [live example!](https://react-components-transition.netlify.app/)

> Scroll down to updates and issues

## Use case

A very small but useful React component, which allows to smart transition between components without adding unnecessary state's hooks to render conditionally

Something like React router but simplified and without rendering based on URL. Just more static

<p align="center">
  <img src="https://github.com/szymekSKKJ/React-components-transition/blob/master/Example.gif">
</p>

## Instaling

```npm
  npm i react-components-transition
```

## Usage

### Initializing

```JavaScript
  import { ComponentsTransition } from "react-components-transition";

  const Component () => {

    const parentElementRef = useRef(null)

    const firstVisibleChildKey = "example2"

    return (

      // Ref must be specified

      <div className="parent" ref={parentElementRef}>
        <ComponentsTransition parentElementRef={parentElementRef} firstVisible={firstVisibleChildKey}>

          {/* At Least 2 components and first given is visible on first render if not specified in 'firstVisible' prop */}

          <Exmaple1 key="example1"></Example>
          <Exmaple2 key="example2"></Example>
        </ComponentsTransition>
      </div>
    );
  }
```

### Switching component

```JavaScript
  import { TransitionButton } from "react-components-transitionn";

  const componentKey = "example2"

  const Example1 = () => {
    return <TransitionButton show={componentKey}>Show example 2 component</TransitionButton>
  }
```

### Or with animations

```JavaScript
  import { TransitionButton } from "react-components-transitionn";

  const componentKey = "example2"

  const Example1 = () => {
    return (
      <TransitionButton show={componentKey}
      animationIn={{ className: "animationIn", duration: 500 }}     // Animation in to new rendered child
      animationOut={{ className: "animationOut", duration: 500 }}>  // Animation out to already rendered child

        Show example 2 component
      </TransitionButton>
    );
  };
```

In css

```css
/* CSS file of Exmaple1 component */

/* Remember to give unique animation name!!! */

@keyframes animationOut {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}

.animationOut {
  transform: scale(1);
  animation: animationOut 500ms forwards;
}
```

```css
/* CSS file of Exmaple2 component */

/* Remember to give unique animation name!!! */

@keyframes animationIn {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.animationIn {
  transform: scale(0);
  animation: animationIn 500ms forwards;
}
```

### Manipulate from outside

```JavaScript
  import { ComponentsTransition, TransitionChild } from "react-components-transition";

  const Component () => {

    const parentElementRef = useRef(null)
    const divRef = useState(null)

    return (
      <div className="parent" ref={parentElementRef}>
        <div ref={divRef}></div>
        <ComponentsTransition>

          // Remember to give unique key

          <TransitionChildStatic key="OutsideComponentWrapper" renderToRef={divRef}>
            <OutsideComponent key="OutsideComponent"></OutsideComponent>
          </TransitionChildStatic>

          <Exmaple1 key="example1"></Example>
          <Exmaple2 key="example2"></Example>
        </ComponentsTransition>
      </div>
    );
  }
```

## Last update 3.0.0 - > 3.0.8

- Changed main behavior

  - Parent ref must be specified in <ComponentsTransition>
  - <TransitionChild> has been change to <TransitionChildStatic> and renderToRef prop must be specified

- Bug fixes
  - Children could not update content when any property has been changed
  - No limitations while children are animated (it was not possible to render more then 2 children)

## Update 2.4.1 -> 2.4.7

- Added possibility to choose render first child

## Update 2.4.0

- Fixed issues with styling (every given child in <ComponentsTransition> was wrapped into single div element what leads to styles problems)

## Update 2.3.0

- Changed animation. It is possbile now to give an "animationIn" and "animationOut"

## Update 2.1.0 -> 2.2.1

- Now is possible to manipulate children from outside element which is always visible
- And move out from ComponentsTransition

## Update 2.0.2 -> 2.0.3

- Fixed bugs with rendering components when already is showing one (prohibiting rendering more then 2 components in time)

## Update 2.0.1

- Changed render method:
  - New showed child always display before (on html page) current hiding child. (There was bug with correct positioning elements)
  - Current showing child always is visible on the top of others (has the highest z-index)

## Update 2.0.0

- Added smooth transitions between rerenders based on CSS class

## Update Issues

- Conditional rendering may cause errors. Remember to always return an element (React.Fragment also provides an error)

## What's next?

Probably maybe any async/await rendering?

Any suggestions? Write to: **s.stepniak01@gmail.com**
