# Components - one of the core concepts of React

📚 Table of Contents

- [Functional Component](#functional-component)
- [Using Components](#using-components)
- [Importing and Exporting Components](#importing-and-exporting-components)
- [Components and Props](#components-and-props)
- [Reading Props Inside a Child Component](#reading-props-inside-a-child-component)
- [Specifying Default Values for Props](#specifying-default-values-for-props)
- [Passing Props Using Spread Syntax JSX](#passing-props-using-spread-syntax-jsx)
- [Passing JSX as Children](#passing-jsx-as-children)

`React.js Components` are small blocks of code that you can use to create reusable user interface elements. Components are the fundamental building blocks when creating applications with React.js.

There are two types of custom components: `class-based` and `functional`.

- Class-based components inherit from the base class `React.Component` and have state, lifecycle methods, and more.
- Functional components are simpler components without state and lifecycle methods.

🚩 _Class-based components used to be the most popular way of creating React components. However, with the introduction of React Hooks, functional components completely replaced class-based ones._

### Functional Component

It is a JavaScript function that returns JSX. The function does not require extension, and no special methods need to be memorized.

```tsx
// Using ES6 arrow functions
const Header = () => {
  return (
    <header>
      <h1>User Profile</h1>
    </header>
  );
};

// TypeScript: ReactNode | ReactElement
const Footer = (): ReactElement => {
  return (
    <footer>
      <p>From Wikipedia 2023</p>
    </footer>
  );
};

// Definition of ReactNode
type ReactNode = string | number | boolean
  | ReactElement<any, string | JSXElementConstructor<any>>
  | Iterable<ReactNode> | ReactPortal | null | undefined
```

🚩🚩🚩 React components are regular JavaScript functions, but their names must **start with a capital letter**, otherwise they won't work!

**[⬆ Back to Top](#components---one-of-the-core-concepts-of-react)**

### Using Components

Now that `<Header>` and `<Footer>` components are defined, they can be nested into other components.

```jsx
const App = () => {
  return (
    <>
      <Header />
      <main className="content">
        <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
      </main>
      <Footer />
    </>
  );
};
```

🚩🚩🚩 Without parentheses, any code on lines after return will be ignored!

🔗 [What are the rules for JavaScript's automatic semicolon insertion (ASI)?](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)

🚩🚩🚩 Components can display other components, but their definitions (component declaration) should never be nested within each other.

```jsx
export default function PageLayout() {
  // 🔴 Never define a component inside another component!
  function Header() {
    // ...
  }

  // ...
}
```

The above fragment will work very slowly and will cause errors.

**[⬆ Back to Top](#components---one-of-the-core-concepts-of-react)**

### Importing and Exporting Components

The magic of components lies in their reusability: you can create components composed of other components. But as you nest more and more components, it often makes sense to split them into different files. This allows you to easily scan files and reuse components in more places.

**💡 React Component = Module = File**

`Root component file` is usually named App.js (app.tsx). However, depending on your settings, your root component may be located in another file.

**💡In most cases, the filename will be determined within the chosen architecture.**

| Syntax  | Export statement                      | Import statement                        |
|---------|---------------------------------------|-----------------------------------------|
| Default | `export default function Button() {}` | `import Button from './Button.js'`;     |
| Named   | `export function Button() {}`         | `import { Button } from './Button.js';` |

```jsx
// Syntax ES6 Default Export statement
export const Button = () => {
  // ...
};

export default Button;
```

**[⬆ Back to Top](#components---one-of-the-core-concepts-of-react)**

### Components and Props

React components use props to interact with each other. Each parent component can pass some information to its child components by passing props to them.

Props are pieces of information you pass into a JSX tag. For example, `className`, `src`, `alt`, `width`, and `height` are some of the props (attributes) that can be passed to `<img>`.

```jsx
const Avatar = () => {
  return (
    <img
      className="avatar"
      src="https://i.imgur.com/1bX5QH6.jpg"
      alt="Lin Lanying"
      width={100}
      height={100}
    />
  );
};
```

Built-in browser components in React `<img>`, `<div>`, `<input>`, etc., behave similarly to custom components; they can accept props (attributes) and event handlers.

Example of passing props to custom components:

```jsx
export const Profile = () => {
  return <Avatar
    person={{name: 'Lin Lanying', imageId: '1bX5QH6'}}
    size={100}
  />;
};
```

💡 Double curly braces after `person=` are an object inside JSX curly braces.

🔗 [Using “double curlies”: CSS and other objects in JSX](https://react.dev/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx)

Passing props to a child component is nothing but passing arguments to a JavaScript function.

**[⬆ Back to Top](#components---one-of-the-core-concepts-of-react)**

### Reading Props Inside a Child Component

```jsx
// Destructuring assignment (object destructuring)
const Avatar = ({person, size}) => {
  // person and size are available here
};
```

This syntax is called "destructuring" and is equivalent to reading properties from the function parameter.

**[⬆ Back to Top](#components---one-of-the-core-concepts-of-react)**

### Specifying Default Values for Props

```jsx
const Avatar = ({person, size = 100}) => {
  // ...
};
```

**[⬆ Back to Top](#components---one-of-the-core-concepts-of-react)**

### Passing Props Using Spread Syntax JSX

```jsx
const Profile = (props) => {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
};
```

**[⬆ Back to Top](#components---one-of-the-core-concepts-of-react)**

### Passing JSX as Children

Usually, nested tags are used in the browser

```html
<div>
  <img />
</div>
```

Similarly, components can be nested

```js
<Card>
  <Avatar/>
</Card>
```

When you embed content in JSX tags, the parent component will receive that content in `props`, called `children` (`props.children`).

```tsx
const Card = ({children}) => {
  return <div className="card">{children}</div>;
};

// TypeScript
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};
```

💡 Props are snapshots of values, available for reading only: on each render, the component receives a new version of props.

💡 Props cannot be changed (immutable). If interactivity is needed, state needs to be set.

```jsx
const Clock = ({color, time}) => {
  return <h1 style={{color: color}}>{time}</h1>;
};
```

When you need to respond to user input (e.g., change selected color), you will need to "set state," which you can learn about in [State: A Component's Memory](https://react.dev/learn/state-a-components-memory)

Documentation on the subject:

- 🔗 [Your First Component](https://react.dev/learn/your-first-component)
- 🔗 [Describing the UI](https://react.dev/learn/describing-the-ui)

**[⬆ Back to Top](#components---one-of-the-core-concepts-of-react)**
