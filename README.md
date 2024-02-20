# React DOM Components - Form Components

React supports all built-in HTML and SVG components.

📚 Table of Contents:

- [What is a Controlled Component](#controlled-component)
- [Input Form Component `<input>`](#input-form-component)
- [Select Form Component `<select>`](#select-form-component)
- [Textarea Form Component `<textarea>`](#textarea-form-component)
- [Challenge: Todo App Application](#challenge-todo-app-application)

### Controlled component

Built-in browser components `<input>`, `<select>`, and `<textarea>` accept user input data. These are
special components in React because passing them a value as a `value` attribute (prop) makes them
controlled.

💡 **Controlled Component** in React is a component whose value is controlled by React.
This is usually achieved through the use of state, which is passed as props to store the value
of the component and update it according to user input.

```jsx
<input value={myInputValue} />
```

_Here and throughout the text, `form component` will refer to `form element` and vice versa, it is `Built-in browser
component` or simply `component`._

[⬆ Back to Top](#react-dom-components---form-components)

## Input Form Component `<input>`

Built-in browser component `<input>` allows displaying and entering various types of
form input data.

💡 Built-in browser component `<input>` supports
all [common element attributes](https://react.dev/reference/react-dom/components/common#props).

```jsx
<input name="myInput" />
```

You can make the input controlled by passing one of these attributes (props) to it:

- `checked` - boolean value. For checkboxes `checkbox` and radio buttons `radio button`, this attribute determines
  whether the element is preselected.
- `value` - string. Controls the text value of the element. (For radio buttons, it defines form data).

💡 When passing any `checked` or `value` attribute, you also need to pass an `onChange` event handler that
, will update the passed value (State).

The following `<input>` attributes (props) are relevant only if the component is defined as uncontrolled:

- `defaultChecked`: boolean value. Specifies the initial value for `type="checkbox"` checkboxes and
  `type="radio"` radio buttons.
- `defaultValue`: string. Specifies the initial value for text input.

### Displaying `<input>` of different types

To display input, visualize the `<input>` component. By default, this will be a text input `type="text"`. You
can pass `type="checkbox"` for a checkbox, `type="radio"` for a radio button, or one of
other [available types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types).

```jsx
export const MyForm = () => {
  return (
    <>
      <label>
        Text input: <input name="myInput" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
};
```

### Creating a `<label>` tag for the `<input>` element

Usually, each `<input>` element is placed inside a `<label>` tag. This informs the browser that this label is associated with this
input. When a user clicks on the label, the browser automatically focuses on the input. This is also important for
accessibility (`Accessibility`): screen readers announce the label when the user focuses
corresponding input.

If it is not possible to nest `<input>` in `<label>`, link them by passing the same identifier (`id`)
in `<input id>` and `<label htmlFor>`. To avoid conflicts between multiple instances of the same component,
generate such an identifier using `React.useId()`.

```jsx
import { useId } from 'react';

export const Form = () => {
  const ageInputId = useId();

  return (
    <>
      <label>
        Your first name:
        <input name="firstName" />
      </label>
      <hr />
      <label htmlFor={ageInputId}>Your age:</label>
      <input id={ageInputId} name="age" type="number" />
    </>
  );
};
```

### Setting initial value for `<input>`

You can specify an initial value for any `<input>` element. Simply pass it as a string to the attribute (
prop) `defaultValue` for text `<input>`.

For checkboxes `type="checkbox"` and radio buttons `type="radio"`, the initial value is specified using a boolean
value for the `defaultChecked` attribute (prop).

```jsx
export const MyForm = () => {
  return (
    <>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <p>
        Radio buttons:
        <label>
          <input type="radio" name="myRadio" value="option1" />
          Option 1
        </label>
        <label>
          <input type="radio" name="myRadio" value="option2" defaultChecked={true} />
          Option 2
        </label>
        <label>
          <input type="radio" name="myRadio" value="option3" />
          Option 3
        </label>
      </p>
    </>
  );
};
```

### Reading `<input>` values on form submission

💡 By default, when submitting a `<form>` via a `<button type="submit">` click, the event handler `<form onSubmit>`
will be called, the browser will submit the form data to the current URL, and refresh the page.

You can override this behavior by calling `e.preventDefault()` and read the form data with
`new FormData(e.target)`.

```jsx
export const MyForm = () => {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', {method: form.method, body: formData});

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());

    console.log(formJson);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Text input: <input name="myInput" defaultValue="Some initial value" />
      </label>
      <hr />
      <label>
        Checkbox: <input type="checkbox" name="myCheckbox" defaultChecked={true} />
      </label>
      <hr />
      <button type="reset">Reset form</button>
      <button type="submit">Submit form</button>
    </form>
  );
};
```

If you give a name to each form element, for example `<input name="firstName" defaultValue="Taylor" />`, then the specified name
will be used as a key in the form data, for example `{ firstName: "Taylor" }`.

```jsx
// Read the form data
const form = e.target;
const formData = new FormData(form);

console.log(formData.firstName);
```

💡 By default, any `<button>` inside `<form>` submits it `<form onSubmit>`. If you created
a custom React `<Button>` component, you need to ensure it returns `<button type="button">`
instead of `<button>` without explicitly specifying the type. For buttons that need to submit, use
`<button type="submit">`, this will define the order and clear rules with an explicit indication of which button is responsible for
submitting the form.

### Controlling `<input>` with State Variable

By default, the `<input />` component is uncontrolled. Even if you pass an initial value,
for example `<input defaultValue="Initial text" />`, JSX only specifies the initial value and then no longer
controls it.

To render a controlled `<input />` component, you need to pass the `value` prop (
attribute) (or `checked` for checkboxes `type="checkbox"` and radio buttons `type="radio"`). Then React will always
control the value via the passed `value` prop.

Usually, this can be done by declaring a state variable through the `useState` hook:

```jsx
const MyForm = () => {
  // Declare a state variable
  const [firstName, setFirstName] = useState('');
  // ...

  // Bind input value to state variable
  // ... and update the state variable on any changes!
  return <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />;
};
```

💡 The value you pass to controlled components should not be `undefined` or `null`. If you need
the initial value to be empty, initialize the state variable with an empty string `useState('')` as in the example
above.

💡 If you want to control input using state variable, you must always pass an event handler
`onChange`.

Examples with `type="text"`

```jsx
// ❌ Bug: controlled text input with no onChange handler
<input value={something} />

// ✅ Good: uncontrolled input with an initial value
<input defaultValue={something} />

// ✅ Good: controlled input with onChange
<input value={something} onChange={e => setSomething(e.target.value)} />

// ✅ Good: readonly controlled input without on change
<input value={something} readOnly={true} />

```

Examples with `type="checkbox"`

```jsx
// ✅ Good: uncontrolled checkbox with an initial value
<input type="checkbox" defaultChecked={something} />

// ✅ Good: controlled checkbox with onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />

// ✅ Good: readonly controlled input without on change
<input type="checkbox" checked={something} readOnly={true} />
```

⚠️ The state variable of a controlled component cannot be updated asynchronously.

```jsx
const handleChange = (e) => {
  // ❌ Bug: updating an input asynchronously
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
};

const handleChange = (e) => {
  // ✅ Updating a controlled input to e.target.value synchronously
  setFirstName(e.target.value);
};
```

### Optimizing re-rendering on each key press

When you use controlled input, you set the state on each key press. If the component containing your state re-renders
large tree, this will affect performance:

```jsx
const App = () => {
  const [firstName, setFirstName] = useState('');

  return (
    <>
      <form>
        <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
      </form>
      <PageContent />
    </>
  );
};
```
Updating the state triggered by the method from the `useState` hook leads to a re-render of the component and all its descendants.

Since `<PageContent />` does not depend on the input state, the input form can be moved to a separate component:

```jsx
// src/components/my-forms.jsx
const MyForm = () => {
  const [firstName, setFirstName] = useState('');
  return (
    <form>
      <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
    </form>
  );
};

// src/app/app.jsx
const App = () => {
  return (
    <>
      <MyForm />
      <PageContent />
    </>
  );
};
```

This significantly improves performance because now, with each keystroke, only the `<MyForm />` component is redrawn. Another method of optimizing re-rendering is to use the [useDeferredValue](https://react.dev/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui) hook.

[⬆ Back to Top](#react-dom-components---form-components)

## Select Form Component

The built-in `<select>` component in the browser allows displaying a selection field with `<option>` parameters.

```jsx
<select>
  <option value="someOption">Some option</option>
  <option value="otherOption">Other option</option>
</select>
```

The built-in `<select>` component also supports all
common [attributes (props) of elements](https://react.dev/reference/react-dom/components/common#props).

You can make the `<select>` component controlled by passing a state variable as the value in the `value` attribute.

### Setting Initial Value for `<select>`

By default, the browser will select the first `<option>` in the list. To choose another option by default, pass the value of that `<option>` as `defaultValue` to the `<select>` element.

```jsx
const FruitPicker = () => {
  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" defaultValue="orange">
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
}
```

⚠️ Unlike HTML, passing the selected attribute to a separate `<option>` is not supported.

### Controlling `<select>` with State Variable

By default, the `<select>` component is uncontrolled. Even if you initially pass a selected value, for example `<select defaultValue="orange">`.

⚠️ Passing a value for `defaultValue` does not make the form component controlled.

To make the `<select>` a controlled component, pass the `value` property to it.
This is usually done by declaring a state variable:

```jsx
const FruitPicker = () => {
  const [selectedFruit, setSelectedFruit] = useState('apple');

  return (
    <label>
      Pick a fruit:
      <select name="selectedFruit" value={selectedFruit} onChange={(e) => setSelectedFruit(e.target.value)}>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="orange">Orange</option>
      </select>
    </label>
  );
};
```

When you pass a value, you must also pass an `onChange` event handler that will update the passed value.

⚠️ If you pass an empty string as an argument to `useState`, the default value for the state variable will be absent, and the first `<option>` element in the list will be selected in the `<select>` element by default. Such behavior can cause unwanted effects if you try to read the state variable value before the first change occurs due to the `onChange` event.

Example with re-displaying some part of the user interface in response to each choice:

```jsx
import { useState } from 'react';

export const FruitPicker = () => {
  const [selectedFruit, setSelectedFruit] = useState('orange');

  const [selectedVegs, setSelectedVegs] = useState(['corn', 'tomato']);

  return (
    <>
      <label>
        Pick a fruit:
        <select
          value={selectedFruit}
          onChange={e => setSelectedFruit(e.target.value)}
        >
          <option value="apple">Apple</option>
          <option value="banana">Banana</option>
          <option value="orange">Orange</option>
        </select>
      </label>

      <hr />

      <label>
        Pick all your favorite vegetables:
        <select
          multiple={true}
          value={selectedVegs}
          onChange={e => {
            const options = [...e.target.selectedOptions];
            const values = options.map(option => option.value);
            setSelectedVegs(values);
          }}
        >
          <option value="cucumber">Cucumber</option>
          <option value="corn">Corn</option>
          <option value="tomato">Tomato</option>
        </select>
      </label>

      <hr />

      <p>Your favorite fruit: {selectedFruit}</p>
      <p>Your favorite vegetables: {selectedVegs.join(', ')}</p>
    </>
  );
}

```

❌ If you pass `value` without `onChange`, the `<select>` element will stop working - it will be impossible to select a `<option>` from the list.

💡 If you make a component controlled by passing `value`, you must also pass an event handler to `onChange`.

⚠️ Unlike HTML, passing the selected attribute to a separate `<option>` is not supported.

[⬆ Back to Top](#react-dom-components---form-components)

## Textarea Form Component

The built-in `<textarea>` component in the browser allows displaying multiline text input.

```jsx
<textarea name="postContent" />
```

You can make `<textarea>` controlled by passing the `value` attribute:

- `value`: String. Controls the text inside the `<textarea>`.

⚠️ If you pass the `value` attribute, you must also pass an `onChange` event handler to update the `value`.

If `<textarea>` is uncontrolled, you can pass `defaultValue`:

- `defaultValue`: string. Specifies the initial value for `<textarea>`.

### ⚠️️ Warnings

- Passing child elements like `<textarea>something</textarea>` is not allowed. Use `defaultValue` for initial content.
- If `<textarea>` receives the `value` attribute, the component becomes controlled.
- `<textarea>` cannot be both controlled and uncontrolled simultaneously.
- `<textarea>` cannot switch between controlled and uncontrolled states during its existence.
- Each controlled `<textarea>` requires an `onChange` event handler that synchronously updates the state variable value.

### Setting Initial Value for `<textarea>`

If desired, you can specify an initial value for `<textarea>`. Pass it as a string to the `defaultValue` attribute.

```jsx
const EditPost = () => {
  return (
    <label>
      Edit your post:
      <textarea
        name="postContent"
        defaultValue="I really enjoyed biking yesterday!"
        rows={4}
        cols={40}
      />
    </label>
  );
};
```

❌ Unlike HTML, passing initial text, for example `<textarea>Some content</textarea>`, is not supported.

### Controlling `<textarea>` with State Variable

By default, `<textarea>` is uncontrolled, and passing an initial value as `<textarea defaultValue="Initial text" />` does not make it controlled.

To visualize a controlled `<textarea>` component, pass the `value` attribute to it. This is usually done by declaring a state variable:

```jsx
const NewPost = () => {
  const [postContent, setPostContent] = useState(''); // Declare a state variable...
  // ...
  return (
    <textarea
      value={postContent} // ...force the input's value to match the state variable...
      onChange={e => setPostContent(e.target.value)} // ... and update the state variable on any edits!
    />
  );
};
```

### Examples of using `<textarea>`

```jsx
// ❌ Incorrect: controlled component lacks onChange handler
<textarea value={something} />

// ✅ Correct: uncontrolled component with initial value
<textarea defaultValue={something} />

// ✅ Correct: controlled component with value and onChange
<textarea value={something} onChange={e => setSomething(e.target.value)} />

// ✅ Correct: read-only controlled component without onChange
<textarea value={something} readOnly={true} />
```

### Error Message: “A component is changing an uncontrolled input to be controlled”

If you provide `value` to the component, it must remain a string throughout its existence.

You cannot initially pass `value={undefined}` and then pass `value="some string"`, because React won't know whether you want the component to be uncontrolled or controlled. A controlled component must always receive the `value` as a string, not `null` or `undefined`.

If you pass the `value` from an API or state variable, it may be initialized as `null` or `undefined`. In this case, either initially set it to an empty string (''), or pass `value={someValue ??  ''}` to ensure the value is a string.

[⬆ Back to Top](#react-dom-components---form-components)

## Challenge: Todo App

Write a Todo application based on the knowledge gained from the first nine sections (_chapter-01...chapter-09_)

- The application should consist of at least three components:
  - Todo list;
  - Todo as a separate list item;
  - Form for adding Todo;
- The form for adding Todo contains a controlled component (`<input>` element) (use `useState` inside the component)
- The form for adding Todo may contain other components common to the entire application (e.g., `<Button />`)
- The `<App />` component manages the form component and the Todo list (implements business logic for the Todo list)
- Use a state variable (useState) in `<App />` to store the Todo list.

// Your implementation of the Todo App goes here...


🔗 [Link to the deployed Todo App](https://todo-app-ab1e50.netlify.app/)

Todo App

The ready-made example with the application is located in src.

To run the example with the ready-made application, execute the following commands:

```shell
git clone https://github.com/shopot/react-101.git

git checkout form-components

npm install

npm run dev
```

Документация по теме:

- 🔗 [Common components (e.g. `<div>`)](https://react.dev/reference/react-dom/components/common)
- 🔗 [Component `<input>`](https://react.dev/reference/react-dom/components/input)
- 🔗 [Component `<select>`](https://react.dev/reference/react-dom/components/select)
- 🔗 [Component `<textarea>`](https://react.dev/reference/react-dom/components/textarea)
- 🔗 [useDeferredValue](https://react.dev/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui)

[⬆ Back to Top](#react-dom-components---form-components)

