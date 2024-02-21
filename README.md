# Conditional Rendering

📚 Table of Contents

- [Conditional Return JSX](#conditional-return-jsx)
- [Conditional Rendering and Returning Null](#conditional-rendering-and-returning-null)
- [Conditional Rendering Using a Variable](#conditional-rendering-using-a-variable)
- [Ternary Operator (? :)](#ternary-operator--)
- [Logical AND Operator (&&)](#logical-and-operator-)

Conditional rendering in React works just like conditional statements in JavaScript. You can conditionally render JSX using JavaScript's ternary operator syntax or expressions with `if/switch` constructs.

### Conditional Return JSX

Depending on the value of the `isPacked` property, some items will have checkmarks at the end.

```jsx
const Item = ({ name, isPacked }) => {
  if (isPacked) {
    return <li className="item">{name} ✔</li>;
  }

  return <li className="item">{name}</li>;
};

export const PackingList = () => {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item isPacked={true} name="Space suit" />
        <Item isPacked={true} name="Helmet with a golden leaf" />
        <Item isPacked={false} name="Photo of Tam" />
      </ul>
    </section>
  );
};
```

💡 Note that branching logic is created using JavaScript `if` and `return` operators. In React, control flow (e.g., conditions) is handled by JavaScript.

### Conditional Rendering and Returning Null

In some situations, it's not required to return anything, i.e., no component rendering is required, then `null` is specified as the return value instead of JSX:

```jsx
if (isPacked) {
  return null;
}

return <li className="item">{name}</li>;
```

In practice, returning null from a component is not very common as it may surprise a developer trying to render it. More often, returning null includes or excludes the component from the JSX of the parent component.

**[⬆ Back to Top](#условный-рендеринг)**

### Conditional Rendering Using a Variable

Entries like <li className="item">{name} ✔</li> and <li className="item">{name}</li> are almost identical, meaning there is some duplication and as a result, a violation of the DRY principle.

This style is the most verbose but also the most flexible.

```jsx
const Item = ({ name, isPacked }) => {
  let itemContent = name;

  if (isPacked) {
    itemContent = name + ' ✔';
  }

  return <li className="item">{itemContent}</li>;
};
```
Another option using a variable:

```jsx
const Item = ({ name, isPacked }) => {
  let packed = '';

  if (isPacked) {
    packed = ' ✔';
  }

  return (
    <li className="item">
      {name}
      {packed}
    </li>
  );
};
```
💡 When JSX is parsed, all leading and trailing whitespaces and line breaks are removed from nested elements. Variants with added space:

```
{name}
{' '}
{packed}
```

```
{name} {packed}
```
### Ternary Operator (? :)

```js
const Item = ({ name, isPacked }) => {
  return <li className="item">{isPacked ? name + ' ✔' : name}</li>;
};
```
💡 This style works well for simple conditions; if a component has a large amount of nested conditional markup, consider extracting child components (Decomposition) to keep things tidy.

### Logical AND Operator (&&)

Another typical case is when you need to display some JSX inside React components when a condition is true,

```jsx
return (
  <li className="item">
    {name} {isPacked && '✔'}
  </li>
);
```
💡 The `&&` expression in JavaScript returns the value of its right-hand side if the left-hand side (condition) is true. But if the condition is false, the entire expression becomes false. React treats `false` as a "hole" in the JSX tree, just like `null` or `undefined`, and doesn't render anything in its place.

💡 If the `isPacked` condition is false, the space after `{name}` will be removed as it will be the trailing space.

### Conclusion

- In React, you control branching logic with JavaScript.
- You can conditionally return JSX using the ternary operator or if/switch constructs.
- You can conditionally store some JSX in a variable and then include it in other JSX using curly braces.
- In JSX, `{condition ? <A /> : <B />}` means if `condition` is true, render `<A/>` otherwise `<B/>`.
- In JSX, `{condition && <A />}` means if `condition` is true, render `<A />`, otherwise render nothing.
- Shortcuts using the ternary operator are common, but you don't have to use them if you prefer a straightforward format.

Documentation:

- 🔗 [Conditional Rendering](https://react.dev/learn/conditional-rendering)

**[⬆ Back to Top](#conditional-rendering)**
