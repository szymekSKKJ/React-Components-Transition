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

## What's next?

I'm going to create any smooth transitions (animations) to work it a little bit nicer.

Probably maybe any async/await rendering?

Any suggestions? Write to: **s.stepniak01@gamil.com**
