# Sharing State Between Components

📚 Table of Contents:

- [Lifting state up](#lifting-state-up)
- [Lifting state up using Accordion example](#lifting-state-up-using-accordion-example)
- [Controlled and Uncontrolled Components](#controlled-and-uncontrolled-components)
- [Prop drilling - passing props problem](#prop-drilling---passing-props-problem)
- [React Roadmap App (Accordion)](#react-roadmap-app-accordion)

### Lifting state up

Sometimes you need the state of two components to always change simultaneously. To achieve this, remove the state
from both components and move it to their nearest common parent component. Then the state will be passed to them as a prop. 
This technique is known as **Lifting state up** and is one of the most common things you will do when writing React code.

[⬆ Back to Top](#sharing-state-between-components)

### Lifting state up using Accordion example

In this example, the parent component `<Accordion />` displays two separate panels:

- `<Accordion />`
  - `<Panel />`
  - `<Panel />`

Each `Panel` component has a logical state `isActive`, which determines whether its content is visible.

```jsx
import { useState } from 'react';

const Panel = ({title, children}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <section>
      <button onClick={() => setIsActive(true)}>{title}</button>
      {isActive && (<p>{children})</p>)}
    </section>
  );
};

export const Accordion = () => {
  return (
    <>
      <Panel title="CLI Tools">
        Vite, Webpack, CRA.
      </Panel>
      <Panel title="Components">
        Lifecycle of Reactive Effects, Lists and Keys, Render Props...
      </Panel>
    </>
  );
};
```

But now suppose you want to change it so that only one panel is open at any given time. With this design, opening the second panel should collapse the first one.

To coordinate these two panels, you need to "lift their state" to the parent component in three steps:

1. Remove the state from the child components.
2. Pass data from the common parent.
3. Add state to the common parent component and pass it along with event handlers.

This allows the `<Accordion />` component to coordinate both panels and open them only one at a time.

```jsx
import { useState } from 'react';

const Panel = ({title, children, isActive, onShow}) => {
  return (
    <section>
      <button onClick={onShow}>{title}</button>
      {isActive && (<p>{children})</p>)}
    </section>
  );
};

export const Accordion = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Panel
        title="CLI Tools"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        Vite, Webpack, CRA.
      </Panel>
      <Panel
        title="Components"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        Lifecycle of Reactive Effects, Lists and Keys, Render Props...
      </Panel>
    </>
  );
}
```

With this state lifting completed! Moving the state to the common parent component allowed us to coordinate the two panels. 
Using the active index instead of two "is shown" flags ensured that only one panel is active at any given time. 
And passing event handlers to the child allowed the child to change the parent's state.

[⬆ Back to Top](#sharing-state-between-components)

### Controlled and Uncontrolled Components
A component with some local state is commonly referred to as `uncontrolled`. For example, the original `<Panel />` component 
with the `isActive` state variable is uncontrolled because its parent component cannot influence whether the panel is active or not.

On the contrary, you can say that a component is `controlled` when its important information is managed through props rather than its own local state. 
This allows the parent component to fully dictate the behavior of the child component, as in the last example, the `<Panel />` component 
with the `isActive` prop is controlled by the `<Accordion />` component.

Similarly, when it comes to built-in browser components like `<input>`, passing the value prop makes it controlled, otherwise `<input>` will use its local state.

In practice, `controlled` and `uncontrolled` are not strict technical terms - each component usually has some combination of both local state and props.

[⬆ Back to Top](#sharing-state-between-components)

### Prop drilling - passing props problem
Props are data that components accept as arguments. They are passed from a parent component to a child component using attributes. 
When a component contains multiple levels of nesting, passing data through all the components can become very cumbersome and cumbersome, 
leading to a situation called Prop drilling.

Prop drilling is the process of passing data (props) from one component nested inside another component through several levels of nesting. 
This means that if you need to pass data from component A to component D, and components B, C are between them, 
you need to pass data from A to B, then from B to C, and then from C to D.

![prop drilling](https://react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fpassing_data_prop_drilling.dark.png&w=640&q=75)

⚠️ **Prop drilling** can lead to more complex and difficult-to-edit code. Moreover, if props need to be passed through many components, 
this can lead to performance problems when rendering components.

To avoid **Prop drilling**, more advanced data transmission concepts are used in React, such as Context and state management libraries, 
which allow data to be passed between components without using props and without the need to build a chain of components.

💡 It is generally considered that if props pass through more than three levels of nesting, this may be a sign that the component architecture needs to be reconsidered.

[⬆ Back to Top](#sharing-state-between-components)

### Conclusion

- If you want to coordinate two components, move their state to their common parent component.
- Then pass the information through props from their common parent.
- Finally, pass event handlers from the parent component so that child components can change the parent's state.
- It is helpful to view components as `controlled` (prop-driven) or `uncontrolled` (state-driven).
- To avoid `prop drilling`, use more advanced data transmission concepts such as `Context` or state management libraries like `Redux` or `MobX`.

[⬆ Back to Top](#sharing-state-between-components)

### React Roadmap App (Accordion)

🔗 [Link to the deployed React Roadmap App (Accordion)](https://react-roadmap-ab1e50.netlify.app/)

The completed example with the application is in the src section of chapter-10.

To run the example with the finished application, run the following commands:

```shell
git clone https://github.com/cpetrescu96/react-101.git

git checkout sharing-state

npm install

npm run dev
```

Documentation:

- 🔗 [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)

[⬆ Back to Top](#sharing-state-between-components)

