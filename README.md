# Event Handling

📚 Table of Contents

- [Event Handlers Are Custom Functions](#event-handlers-are-custom-functions)
- [Adding Event Handlers](#adding-event-handlers)
- [Reading Props in Event Handlers](#reading-props-in-event-handlers)
- [Passing an Event Handler to a Component](#passing-an-event-handler-to-a-component)
- [Naming Event Handler Passed as Props](#naming-event-handler-passed-as-props)
- [Event Propagation](#event-propagation)
- [Stopping Propagation](#stopping-propagation)
- [Preventing Default Behavior](#preventing-default-behavior)
- [Can Event Handlers Have Side Effects?](#can-event-handlers-have-side-effects)

### Event Handlers Are Custom Functions

React allows you to add event handlers to your JSX. Event handlers are custom functions that will be triggered in response to interactions such as clicks, mouse hover, form input focus, etc.

All event handlers receive a React event object. It's also sometimes referred to as a "synthetic event". It conforms to the same standard as basic DOM events but fixes some browser inconsistencies.

```typescript
// TypeScript declaration
interface SyntheticEvent<T = Element, E = Event> extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {
}
```

If for some reason you need the basic DOM event, you can get it from `e.nativeEvent`.

More information about the event object can be found on the official documentation page:

- 🔗 [React event object](https://react.dev/reference/react-dom/components/common#react-event-object)

**[⬆ Back to Top](#event-handling)**

### Adding Event Handlers

A simple scenario of adding a handler to the Button component:

Declare the `handleClick` function inside the `Button` component.
Implement the logic inside this function.
Add `onClick={handleClick}` to the <button> JSX.

```jsx
export const Button = () => {
  const handleClick = () => {
    alert('You clicked me!');
  };

  return <button onClick={handleClick}>Click me</button>;
};
```

Another alternative way to define an event handler inline in JSX (not a good practice):

```jsx
// Function declaration
<button
  onClick={function handleClick() {
    alert('You clicked me!');
  }}
>
```

```jsx
// ES6 syntax
<button
  onClick={() => {
    alert('You clicked me!');
  }}
>
```

💡 Functions passed to event handlers should be passed, not called.

```jsx
// ❌ Calling a function incorrect
<button onClick={handleClick()}>...</button>

// ✅ Passing a function correct
<button onClick={handleClick}>...</button>

// ❌ Calling a function incorrect
<button onClick={alert('...')}>...</button>

// ✅ Passing a function correct
<button onClick={() => alert('...')}>...</button>
```

**[⬆ Back to Top](#event-handling)**

### Reading Props in Event Handlers

Since event handlers are declared inside the component, they have access to the component's props.

```jsx
// src/components/alert-button.jsx
export const AlertButton = ({message, children}) => {
  const handleClick = () => {
    alert(message);
  };

  return <button onClick={handleClick}>{children}</button>;
};

// src/components/toolbar.jsx
export const Toolbar = () => {
  return (
    <div>
      <AlertButton message="Playing!">Play Movie</AlertButton>
      <AlertButton message="Uploading!">Upload Image</AlertButton>
    </div>
  );
};
```

**[⬆ Back to Top](#event-handling)**

### Passing an Event Handler to a Component

Often, you need the parent component to specify an event handler for its child component.

```jsx
// src/components/button.jsx
export const Button = ({onClick, children}) => {
  return <button onClick={onClick}>{children}</button>;
};

// src/components/play-button.jsx
export const PlayButton = ({movieName}) => {
  const handlePlayClick = () => {
    alert(`Playing ${movieName}!`);
  };

  return <Button onClick={handlePlayClick}>Play "{movieName}"</Button>;
};
```

**[⬆ Back to Top](#event-handling)**

### Naming Event Handler Passed as Props

By convention, event handler props should start with `on` followed by a capital letter.

```jsx
// src/components/button.jsx
export const Button = ({onClick, children}) => {
  return <button onClick={onClick}>{children}</button>;
};

// src/components/toolbar.jsx
export const Toolbar = ({onPlayMovie, onUploadImage}) => {
  return (
    <div>
      <Button onClick={onPlayMovie}>Play Movie</Button>
      <Button onClick={onUploadImage}>Upload Image</Button>
    </div>
  );
};

// src/app/app.jsx
export const App = () => {
  const playMovie = () => alert('Playing!');

  const uploadImage = () => alert('Uploading!');

  return <Toolbar onPlayMovie={playMovie} onUploadImage={uploadImage} />;
};
```

**[⬆ Back to Top](#event-handling)**

### Event Propagation

Event handlers will also catch events from any child elements of your component.

This means that all events bubble up in React except `onScroll`, which only works with the JSX tag it's attached to.

```jsx
const Toolbar = () => {
  return (
    <div
      className="Toolbar"
      onClick={() => {
        alert('You clicked on the toolbar!');
      }}
    >
      <button onClick={() => alert('Playing!')}>Play Movie</button>
      <button onClick={() => alert('Uploading!')}>Upload Image</button>
    </div>
  );
```

**[⬆ Back to Top](#event-handling)**

### Stopping Propagation

If you need to prevent an event from reaching parent components, you should call `e.stopPropagation()`:

```jsx
const Button = ({onClick, children}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {children}
    </button>
  );
};
```

**[⬆ Back to Top](#event-handling)**

### Preventing Default Behavior

Some browser events have default behaviors associated with them. For example, the form submission event `<form>`, which occurs when a button inside it is clicked, by default reloads the whole page.

To prevent this from happening, call `e.preventDefault()` on the event object.

```jsx
const Signup = () => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        alert('Submitting!');
      }}
    >
      <input />
      <button>Send</button>
    </form>
  );
};
```

💡 Don't confuse `e.stopPropagation()` and `e.preventDefault()`. They are both useful but unrelated:

- `e.stopPropagation()` stops event handlers attached to higher tags from firing.
- `e.preventDefault()` prevents the default browser behavior for the few events that have it.

**[⬆ Back to Top](#event-handling)**

### Can Event Handlers Have Side Effects?

Absolutely! Event handlers are a great place for side effects.

Unlike rendering functions, event handlers don't necessarily need to be pure, so it's a great place to do something like alter a value in response to input or change a list in response to a button click.

### Conclusion

- You can handle events by passing a function as a property to an element, e.g., `<button>`;
- Event handlers should be passed, not called! `onClick={handleClick}`, not `onClick={handleClick()}`;
- You can define an event handler function separately or inline.
- Event handlers are defined inside the component, so they can access props;
- You can declare an event handler in a parent element and pass it as a property to a child element;
- You can define your own props (like event handlers) with application-specific names;
- Events bubble up. To prevent this, call `e.stopPropagation()` as the first argument;
- Events can have unwanted default browser behavior. Call `e.preventDefault()` to prevent this;
- Explicitly calling a prop (like an event handler) from a child handler is a good alternative to bubbling;

Documentation References:

- 🔗 [Responding to Events](https://react.dev/learn/responding-to-events)
- 🔗 [React event object](https://react.dev/reference/react-dom/components/common#react-event-object)

**[⬆ Back to Top](#event-handling)**
