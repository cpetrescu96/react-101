# Introduction to the useEffect Hook

📚 Table of Contents:

- [Component Lifecycle in React](#component-lifecycle-in-react)
- [What is useEffect?](#what-is-useeffect)
- [Dependency Array in useEffect](#dependency-array-in-useeffect)
- [Cleanup Function in useEffect](#cleanup-function-in-useeffect)
- [Application with Examples of useEffect from React Documentation](#application-with-examples-of-useeffect-from-react-documentation)

### Component Lifecycle in React

The component lifecycle in React is a sequence of steps and methods that are invoked during the creation, update, and deletion of a component. Each component in React goes through several stages of its life, starting from its creation and ending with its removal from the DOM.

Originally, before the advent of functional components in React, the lifecycle consisted of methods defined in class components ([more about class components](https://react.dev/reference/react/Component)).

With the introduction of hooks for functional components in React 16.8, it became possible to use state, hooks implementing lifecycle functionality, and other features of class components.

💡 Currently, class components in React are almost not used, but you may still encounter old code implemented with class components.

For class components, the lifecycle in simplified form looks as follows:

- If you define the method `componentDidMount()`, React will call it when your component is added (mounted) to the page.
- React will call `componentDidUpdate()` after re-rendering your component due to changes in props or state.
- React will call `componentWillUnmount()` after your component is removed (unmounted) from the page.

The lifecycle for functional components is similar:

- Mounting - the component is created and added to the page.
- Updating - the component is updated (re-rendered) either when receiving new props or when internal state changes.
- Unmounting - the component is removed from the page.

The lifecycle for functional components is simpler than for class components. To manage the lifecycle of functional components, you can use hooks such as `useEffect`, `useState`, `useContext`, `useMemo`, etc. The use of these and other hooks affects the behavior of components during their lifetime.

[⬆ Back to Top](#introduction-to-the-useeffect-hook)

### What is useEffect?

**useEffect** is a React Hook that allows synchronizing a component with an external system.

The `useEffect` hook is intended for managing side effects in React functional components. Side effects refer to any external changes that occur as a result of updating the component, such as API requests, DOM manipulation, subscribing and unsubscribing to events, etc. Below is not an exhaustive list of cases for using the `useEffect` hook:

- Connecting to external systems: some components need to remain connected to the network, the browser's API, or a third-party library while they are displayed on the page. These systems are not controlled by React and are therefore considered external.
- Making server requests to fetch data, for example, using fetch or axios. The request can be made once when the component is loaded or when a specific state variable changes.
- Subscribing to events, such as button clicks, scrolls, or keyboard events.
- Using third-party library components that allow working with various types of data not written in React.
- Directly updating the DOM, for example, adding or removing elements, or changing their properties.
- Wrapping effects in custom hooks to separate the logic of some effects into separate custom hooks (reusing logic using custom hooks).

[⬆ Back to Top](#introduction-to-the-useeffect-hook)

### Dependency Array in useEffect

The declaration of the `useEffect` hook API at the time of writing looked as follows:

```ts
// TypeScript
function useEffect(effect: EffectCallback, deps?: DependencyList): void;
```

Definition of `useEffect` in the [official documentation](https://react.dev/reference/react/useEffect) at the time of writing:

```js
useEffect(setup, dependencies ?)
```

`useEffect`, like any other hook, is a function. The useEffect hook takes two arguments, the last one is not mandatory:

- `setup` (or setup function) - is a callback function with the implementation of your effect's logic, 
  inside which you work with updated data (referred to here and below as the setup function). 
  This function can return another function, called a cleanup function, inside which you work with data before the update.
- `dependencies` - this is an array of dependencies that can include props, state, 
  and all variables and functions declared directly inside your component body.

💡 In React, the `useEffect` hook is triggered after the component is rendered, that is, when the component is rendered and actually
appeared on the screen.

So the `setup function` in `useEffect` is triggered after the component is updated on the screen. If you want to
execute some logic before the component is first rendered, such as sending a request to the server and retrieving data, you
can pass an empty array as the second argument to `useEffect`. This tells React that the `setup function` should be
executed only once during the first mount of the component, which can be compared to the class component method `componentDid`.
component `componentDidMount()` method.

```jsx
// Mounting
useEffect(() => {
  // This code will be executed when the component is mounted
  //...
}, []);
```

If you do not pass the second argument, the `setup function` will be triggered again every time the component is visualized, 
which can be compared to the `componentDidUpdate()` method of a class component. That is, executing logic in the `setup function` 
will occur after each re-rendering of the component.

```jsx
// Updating
useEffect(() => {
  // This code will be executed after each rendering of the component
  //...
});
```

If you pass props or state variables as the second argument, the `setup function` logic will be executed only when the values 
of the props or state variables change, each time the props or state variables change.

```jsx
import { useEffect, useState } from 'react';

const MyComponent = ({someProp}) => {
  const [someState, setSomeState] = useState('Apple');

  useEffect(() => {
    // This code will be executed only when the props or state change
  }, [someProp, someState]);
};
```

💡 The implementation of useEffect uses shallow comparison of dependency values.

### UseEffect cleanup function (cleanup function)

After each re-rendering with changed dependencies, React first runs the cleanup function (if you have
provided) with the old values, and then runs the `setup function` with the new values. After your
component is removed from the DOM, React will also run the `cleanup function`.

```jsx
// Unmounting
useEffect(() => {
  // ...
  return () => {
    // This code will be executed when the component is unmounted
  }
});
```

If you pass props or state variables in the second argument, the `cleanup function` logic will be executed
each time any of the dependency array elements are updated, and once when the component is unmounted:

```jsx
// Unmounting and updating
useEffect(() => {
  // ...
  return () => {
    // This code will be executed when the component is unmounted
    // and also before updating any element from the dependency array
  }
}, [dep1, dep2]);
```

#### ⚠️ Caveats

- `useEffect` is not a complete replacement for class component lifecycle methods, it only partially
  it only partially implements similar functionality.
- `useEffect` is a hook, so you can only call it at the top level of your component or your own
  hooks.
  You cannot call it inside loops or conditions.
- Unless you are trying to synchronize with some external system, you probably don't need the effect.
- When strict mode is enabled (`<React.StrictMode>`), React will run one extra
  `setup function` + `cleanup function` loop for development mode only. This is a stress test to ensure that
  your `cleanup function` logic "reflects" your `setup function` logic, and that it stops or undoes everything that `setup function`
  `setup function` does.
- If some of your dependencies are objects or functions defined within a component, there is a
  risk that they will cause `useEffect` to be rerun more often than necessary. To fix this, remove
  unnecessary
  object and function dependencies.
- If your effect was not triggered by an interaction (such as a mouse click), React will allow the browser to first render the
  an updated screen before triggering your Effect. If your Effect does something visual (e.g,
  positions a tooltip) and the delay is noticeable (e.g., flickering), replace `useEffect`
  with `useLayoutEffect`.
- Even if your effect was caused by an interaction (e.g., a mouse click), the browser may redraw the screen before
  handling state updates within your effect. This is usually what you want to do. However, if you need to
  to prevent the browser from redrawing the screen, you need to replace `useEffect` with `useLayoutEffect`.
- The effects only run on the client. They do not run during rendering on the server.

### Conclusion

- The setup function will be executed after each visualization if there is no dependency array.
- If there is an empty array of dependencies, the setup function will run only once after the first visualization, when the component is mounted.
  the first visualization, when the component is mounted.
- If there is a dependency array with values in the form of props or a state variable, the callback function (setup function) will be executed only once after the first visualization.
  (setup function) will be executed only when these values are changed.

[⬆ Back to Top](#introduction-to-the-useeffect-hook)

### Application with useEffect examples from React documentation

🔗 [React useEffect() application deploy link](https://react-use-effect-ab1e50.netlify.app/)

The ready example with the application is in `src`.

To run the example with the ready application, run the commands:

```shell
git clone https://github.com/cpetrescu96/react-101.git

git checkout hook-use-effect

npm install

npm run dev
```

Documentation:

- 🔗 [React Hook useEffect](https://react.dev/reference/react/useEffect)
- 🔗 [Describe class components (React Legacy APIs)](https://react.dev/reference/react/Component)
- 🔗 [Switching from class components to functional components](https://react.dev/reference/react/Component#alternatives)
- 🔗 [A Complete Guide to usingEffect by Dan Abramov](https://overreacted.io/a-complete-guide-to-useeffect/)
- 🔗 [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)

[⬆ Back to Top](#introduction-to-the-useeffect-hook)
