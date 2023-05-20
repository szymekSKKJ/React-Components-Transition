# React components transition

## Use case

A very small but useful React component, which allows to smart transition between components without adding unnecessary state's hooks to render conditionally

Something like React router but simplified and without rendering based on URL. Just more static

## Instaling

```npm
  npm i react-components-transition
```

## Usage

### Initializing

```JavaScript
  import { ComponentsTransition } from "react-components-transition";

  const Component () => {

    const initialVisibleComponentKey = "example1"; // Key must match the given key in component props

    return (
      <>
        <ComponentsTransition visible={initialVisibleComponentKey}>

          {/* Atleast 2 components */}

          <Exmaple1 key="example1"></Example>
          <Exmaple2 key="example2"></Example>
        </ComponentsTransition>
      </>
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
      <TransitionButton show={componentKey} animation={{ className: "animation", duration: 500 }}> // ClassName of animation in component which shows (Exmaple2 component)
        Show example 2 component
      </TransitionButton>
    );
  };
```

In css

```css
/* CSS file of Exmaple2 component */

.animation {
  animation: animation 500ms forwards;
  transform: scale(0);
}
```

## Last update 2.0.0

- Added smooth transitions between rerenders based on CSS class

## What's next?

Probably maybe any async/await rendering?

Any suggestions? Write to: **s.stepniak01@gmail.com**
