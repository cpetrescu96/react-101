# Introduction to JSX

📚 Table of Contents:

- [JSX - JavaScript Extension](#jsx---javascript-extension)
- [Naming Conventions for Custom Components](#naming-conventions-for-custom-components)
- [Using Nested Elements in JSX](#using-nested-elements-in-jsx)
- [Using Fragments <Fragment></Fragment>](#using-fragments-fragmentfragment)
- [Embedding Expressions in JSX](#embedding-expressions-in-jsx)
- [JSX Has a Recursive Structure](#jsx-has-a-recursive-structure)
- [Logical Values, null, and undefined are Ignored](#logical-values-null-and-undefined-are-ignored)
- [JSX Prevents Code Injection Attacks](#jsx-prevents-code-injection-attacks)

### JSX - JavaScript Extension

**JSX** represents a way to describe visual code by combining JavaScript code and XML-like markup syntax. During compilation, **JSX** is translated into regular JavaScript.

> JSX is an XML-like syntax extension to ECMAScript without any defined semantics. It is NOT intended to be implemented by engines or browsers. It is intended to be used by various preprocessors (transpilers) to transform these tokens into standard ECMAScript.

JSX files have the extension `.jsx` for JavaScript files and `.tsx` for TypeScript files.

The main difference from HTML syntax is the presence of a closing (or self-closing) tag for all elements:

```jsx
<img src="..." alt="..." />
```

Example JSX markup:

```jsx
<header>
  <h1 className="title">Hello, React!</h1>
</header>
```

This **JSX** code, after compilation, will turn into a call to `React.createElement()`:

```javascript
React.createElement(
  'header',
  null,
  React.createElement('h1', {className: 'title'}, 'Hello, React!')
);
```

After compilation, each **JSX expression** becomes a regular JavaScript function call, the result of which is a JavaScript object.

- If the tag is empty, it can be closed immediately with `/>` just like in XML.
- Instead of the `class` attribute in **JSX**, the DOM property name `className` is used, as `class` is a reserved word for creating classes.
- Instead of the `for` attribute in **JSX**, `htmlFor` is used for `<label>` and `<output>` to bind to some control element, as `for` is a reserved word for creating loops.

```jsx
<div className="sidebar" />;

// Compiles to:
React.createElement('div', {className: 'sidebar'});
```

```jsx
const vdom = <img src={logo} className="app-logo" alt="logo" />;

// Compiles to:
React.createElement('img', {className: 'app-logo', src: '...', alt: 'logo'});
```

**[⬆ Back to Top](#introduction-to-jsx)**

### Naming Conventions for Custom Components

If the name of the component type starts with a lowercase letter, it refers to a built-in component (HTML element), such as `<div>` or `<span>`, which will result in passing the string 'div' or 'span' to React.createElement. Types starting with an uppercase letter, such as `<Foo />`, compile to `React.createElement(Foo)` and correspond to a component that was declared or imported in your JavaScript file.

```jsx
// Correct! This is a component and it should be written with an uppercase letter:
const Hello = ({toWhat}) => {
  // Correct! Using <div> is allowed, as it is a valid HTML tag.
  return <div>Hello, {toWhat}</div>;
};

const HelloWorld = () => {
  // Correct! React knows that <Hello /> is a component because it's written with an uppercase letter.
  return <Hello toWhat="World" />;
};
```

**[⬆ Back to Top](#introduction-to-jsx)**

### Using Nested Elements in JSX

JSX tags (elements/components) can contain child elements.

```jsx
const element = (
  <header>
    <h1 className="title">Hello, React!</h1>
  </header>
);
```

All components in React must return a single root element that includes everything else:

```jsx
return (
  <header>
    <h1 className="title">Hello, React!</h1>
  </header>
);
```

To render nested React components, you can specify multiple JSX elements as children.

```jsx
<MyContainer>
  <MyFirstComponent />
  <MySecondComponent />
</MyContainer>
```

You can mix different types of children.

```jsx
<div className="container">
  <h1>Hello, React!</h1>
  <MyFirstComponent />
  <MySecondComponent />
  2013. Meet React.js
</div>
```

**[⬆ Back to Top](#introduction-to-jsx)**

### Using Fragments `<Fragment></Fragment>`

To group multiple elements, you use a wrapper in the form of `<Fragment>`. Grouping elements in a fragment does not affect the resulting DOM; it's the same as if the elements were not grouped:

```jsx
import { Fragment } from 'react';

const Post = () => {
  return (
    <Fragment>
      <h1 className="title">Hello, React!</h1>
      <div className="body">Rendering a Fragment</div>
    </Fragment>
  );
};
```

An empty tag `<></>` is a shorthand for `<Fragment></Fragment>`.

```jsx
const Post = () => {
  return (
    <>
      <h1 className="title">Hello, React!</h1>
      <div className="body">Rendering a Fragment</div>
    </>
  );
};
```

Any text written inside the tags remains just static text in the output.

**[⬆ Back to Top](#introduction-to-jsx)**

### Embedding Expressions in JSX

Embedding expressions in **JSX** is done using curly braces `{...}` (interpolation, similar to JavaScript), inside which we can place any valid JavaScript expression:

```jsx
const name = 'Eva';
const someStyleClass = 'container';

const vdom1 = <div>Hello, {name}</div>;
const vdom2 = <div>Hello, {name.repeat(3)}</div>;
const vdom3 = <div className={someStyleClass}>Hello!</div>;
```

**JSX elements** are expressions, so you can use them anywhere in JavaScript code that works with expressions:

```jsx
const isBlock = Math.random() > 0.5;

const name = 'Mike';
const vdom = isBlock ? <div>hello, {name}</div> : <span>i am span</span>;
```

### JSX Has a Recursive Structure

To embed a JavaScript expression inside **JSX**, use curly braces. Therefore, you can embed **JSX** inside **JSX** when writing **JSX**:

```jsx
const vdom = (
  <div>
    {isAdmin ? (
      <p>
        <a href="#">{text}</a>
      </p>
    ) : (
      <p>{text}</p>
    )}
    <div className="hello">Hello, React!</div>
  </div>
);
```

⚠️ Unable to use conditional constructs inside JSX; instead, you can use a ternary operation as shown above.

The following code will not work and will throw an exception with `Unexpected token`:

```jsx
<div id={if (isAdmin) {'msg'}}>Hello, React!</div>
```

Rewritten code using the ternary operator:

```jsx
<div id={isAdmin ? 'msg' : ''}>Hello, React!</div>
```

**[⬆ Back to Top](#introduction-to-jsx)**

### Logical Values, null, and undefined are Ignored

The values `false`, `null`, `undefined`, and `true` are valid empty child elements. They simply aren't rendered. These **JSX expressions** will render the same:

```jsx
<div />

<div></div>

<div>{false}</div>

<div>{null}</div>

<div>{undefined}</div>

<div>{true}</div>
```

This approach can be useful for conditional rendering.

```jsx
<div>
  {showHeader && <Header />} <Content />
</div>
```

There is one caveat in that React will render "falsy" (falsy) values, such as the number 0. The code below behaves differently than you might expect because 0 will be displayed if the props.messages array is empty:

```jsx
<div>{props.messages.length && <MessageList messages={props.messages} />}</div>
```

To fix this, make sure the expression before the && operator is always a boolean:

```jsx
<div>{props.messages.length > 0 && <MessageList messages={props.messages} />}</div>
```

**[⬆ Back to Top](#introduction-to-jsx)**

### JSX Prevents Code Injection Attacks

By default, React DOM escapes all values included in JSX before rendering them. This ensures that you never inject anything that wasn't explicitly written in your application.

```jsx
const title = response.potentiallyMaliciousInput;

// This code is safe:
const element = <h1>{title}</h1>;
```

#### Raw HTML Strings

In JavaScript, there is the concept of `innerHTML`, which allows you to set the HTML content of an element as a string.

In React, there is a special property (property) for such purposes that is passed as an attribute - `dangerouslySetInnerHTML`. This property allows you to insert HTML into an element like this:

```jsx
<div dangerouslySetInnerHTML={__html: '<p>some html</p>'} />
```

⚠️ Using dangerouslySetInnerHTML can pose a security threat. Its use opens up possibilities for XSS attacks if the inserted HTML code is not filtered and neutralized.

`The attribute name already indicates that its use is potentially dangerous`

**[⬆ Back to Top](#introduction-to-jsx)**

#### Tip: Use a JSX Converter

Converting all these attributes into existing markup can be tedious! React developers recommend using a [converter](https://transform.tools/html-to-jsx) to translate existing HTML and SVG into JSX. Converters are very useful in practice, but it's still worth understanding what's going on so that you can comfortably write JSX yourself.

### Summary

- JSX prevents code injection attacks, this ensures that the code is safe.
- React components group rendering logic together with markup because they are related.
- JSX is similar to HTML, but with some differences. If necessary, you can use a converter.
- Error messages often point you in the right direction to fix your markup.

Related documentation:

- 🔗 [JSX Introduction](https://facebook.github.io/jsx/)
- 🔗 [Babel transform React JSX](https://babeljs.io/docs/babel-plugin-transform-react-jsx)
- 🔗 [Writing Markup with JSX](https://react.dev/learn/writing-markup-with-jsx)
- 🔗 [JavaScript in JSX with Curly Braces](https://react.dev/learn/javascript-in-jsx-with-curly-braces)

**[⬆ Back to Top](#introduction-to-jsx)**
