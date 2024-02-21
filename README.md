# Applying CSS Styles

📚 Contents

- [Inline Styling](#inline-styling)
- [Using CSS Classes (External Style Sheets)](#using-css-classes-external-style-sheets)
- [Applying Multiple Classes Conditionally](#applying-multiple-classes-conditionally)
- [Using styled-components (CSS-in-JS)](#using-styled-components-css-in-js)
- [Using CSS Modules](#using-css-modules)
- [Using CSS Preprocessors](#using-css-preprocessors)
- [Using Tailwind CSS](#using-tailwind-css)
- [Using Component Libraries](#using-component-libraries)

This section provides a brief overview of styling methods for React components.

### Inline Styling

To style an element using inline style attribute, the value must be a JavaScript object:

```jsx
const container = {
  marginTop: '16px',
  padding: 12,
  background: 'red',
};

return <div style={container}></div>;
```

The style attribute takes a JavaScript object with properties in camelCase instead of CSS strings.

⛔ Using the style attribute for styling elements is not recommended. CSS classes are typically more performant than
inline styles.

[⬆ Back to Top](#applying-css-styles)

### Using CSS Classes (External Style Sheets)

The classic way of applying styles is by linking them from external CSS files. A CSS class is specified as a value for
the `className` attribute. It works like a regular `class` attribute in HTML.

```jsx
return <img className="avatar" />;
```

[⬆ Back to Top](#applying-css-styles)

### Applying Multiple Classes Conditionally

To conditionally apply CSS classes, you need to construct the `className` string yourself using JavaScript.

```jsx
return <div className={'row ' + (isSelected ? 'selected' : '')}>...</div>;
```

To make this more readable, you can use a small utility library like [classnames](https://github.com/JedWatson/classnames):

```jsx
import cn from 'classnames';

const Row = ({isSelected}) => {
  return <div className={cn('row', isSelected && 'selected')}>...</div>;
};
```

This is especially convenient when using multiple conditional classes:

```jsx
import cn from 'classnames';

const Row = ({isSelected, size}) => {
  return (
    <div
      className={cn('row', {
        selected: isSelected,
        large: size === 'large',
        small: size === 'small',
      })}
    >
      ...
    </div>
  );
};
```

[⬆ Back to Top](#applying-css-styles)

### Using styled-components (CSS-in-JS)

The [styled-components](https://styled-components.com/) library allows you to write styles like regular CSS, leveraging
all the benefits of JavaScript. This means you can use the full power of CSS, including media queries, pseudo-selectors,
nesting, etc., within JavaScript.

Styles are created directly in the component file:
 

```jsx
import styled from 'styled-components';

const Container = styled.div`
  padding: 12px;
  background: red;
`;

export const Homepage = () => {
  return (
    <Container>
      <h1>Welcome to React</h1>
      <p>This is a simple homepage</p>
    </Container>
  );
};
```

👍 Pros

- Component-based styling. Styles are written inside the component, improving code organization and reusability.
- Dynamic styling. Styled components provide dynamic styling based on component properties or state.
- Ensures no style conflicts by generating unique class names for your written styles.
- Supports DRY principle, offering excellent templates for organizing your code, and styled components are compatible
  with a wide range of frameworks and libraries.
- Great for building and maintaining design systems.

👎 Cons

- Build complexity: CSS-in-JS solutions often require additional build tools and dependencies.
- Performance impact. Generating dynamic styles at runtime can impact application performance.

[⬆ Back to Top](#applying-css-styles)

### Using CSS Modules

CSS Modules are CSS files in which all class names and animation names are scoped locally by default. They are compiled
into a low-level interchange format called ICSS (Interoperable CSS), but written as regular CSS files, automatically
creating a unique class name in the format `[filename]_[classname]_[hash]`.

```css
/* message.module.css */
.errorMessage {
  color: green;
}
```

```jsx
/* message.jsx */
import styles from './message.module.css';

const Message = () => {
  return <div className={styles.errorMessage}>I am an error message</div>;
};
```

The [CRA](https://create-react-app.dev/) tool supports CSS modules alongside regular stylesheets
using the `[name].module.css` naming convention (CRA is considered deprecated).

Similarly, CSS Modules support is available with the [Vite](https://vitejs.dev/guide/features.html#css) tool, while
for the [Webpack](https://webpack.js.org/loaders/css-loader/) module bundler, specific configuration is required.

👍 Pros

- Component/module-level isolation (unlike CSS/SASS)
- Unique generated class names eliminate style conflicts.
- Can be used right away without configuration in CRA/Vite projects.
- Can be used with SASS/CSS.

👎 Cons

- Referencing class names can be tricky.

[⬆ Back to Top](#applying-css-styles)

### Using CSS Preprocessors

CSS preprocessors like SASS, LESS, or Stylus provide additional features such as variables, nesting, mixins, and more. This enhances the productivity and maintainability of CSS code.

👍 Pros

- Enhanced capabilities: SCSS offers powerful features that simplify writing and managing CSS.
- Code reusability: SCSS allows creating reusable code snippets using mixins and variables.
- Easy migration: Existing CSS files can be gradually transformed into SCSS without significant refactoring.

👎 Cons

- Compilation step: SCSS files need to be compiled into regular CSS before they can be used.
- Developers need to learn SCSS syntax and its peculiarities.

[⬆ Back to Top](#applying-css-styles)

### Using Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/docs/installation) is a utility-first CSS framework that offers an extensive set of predefined utility classes. This facilitates rapid development and consistent styling.

```jsx
export const MyComponent = () => {
  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center">
      <h1 className="text-2xl text-gray-800 mb-2">Hello, World!</h1>
      <p className="text-base text-gray-600">This is a styled React component.</p>
      <button 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Click Me
      </button>
    </div>
  );
};
```

👍 Pros

- Rapid prototyping: Tailwind CSS provides an extensive collection of utility classes for quickly developing user interfaces.
- Extensive customization capabilities: The platform allows customization through a configuration file, providing a unique style.
- Consistent style: By using predefined utility classes, maintaining style consistency becomes easy.

👎 Cons

- File size: Including the entire Tailwind CSS infrastructure may increase the size of the application bundle.
- Class overload: Excessive use of utility classes may lead to bloated HTML markup.

[⬆ Back to Top](#applying-css-styles)

### Using Component Libraries

Component libraries like [Chakra UI](https://chakra-ui.com), [Material UI](https://mui.com/material-ui/getting-started/)
and [Ant Design](https://ant.design/) offer pre-built and styled React components along with accompanying styles. 
These libraries provide a consistent and cohesive design language.

👍 Pros

- Quick development: Ready-to-use components accelerate the development process.
- Consistent style: Components in the library adhere to a unified design system, ensuring visual consistency.
- Extensive documentation: Popular component libraries have well-documented APIs and recommendations.

👎 Cons

- Customization limitations: While these libraries offer customization options, they may not meet all design requirements.
- Package size: Including the entire component library may increase the size of the application bundle.

[⬆ Back to Top](#applying-css-styles)

### Conclusion

Each option has its strengths and weaknesses, and the choice depends on the specific requirements and preferences of the project.

- Pure CSS: suitable for smaller projects or when the focus is on CSS customization. It is simple and familiar, but
  it lacks encapsulation, which can lead to class name conflicts in larger projects.
- CSS-Modules: ideal for medium-sized projects that require encapsulation of styles. It offers styles with
  limited scope, prevents class name conflicts, and creates imports and references to unique class names
  classes.
- CSS-in-JS: well suited for projects with complex or dynamic style requirements. Writing CSS
  directly in JavaScript offers component-based styles and dynamic styling capabilities, but it can
  increase package size and requires additional training.
- CSS preprocessors: recommended for projects that use advanced CSS syntax with variables,
  impurities, and other features. They promote reusable and maintainable styles, but require a build process
  for compilation.
- Tailwind CSS: ideal for rapid development and prototyping. It provides an extensive set of service
  classes for consistent styling, but due to the number of service classes can result in large file sizes.
- Component libraries: useful when you need ready-to-use user interface components with a
  consistent design and theme support. They offer extensive component libraries, but may have limited customization options and increase the size of the final file.
  customization options and increase the size of the final application.

Documentation Resources:

- 🔗 [Applying CSS styles](https://react.dev/reference/react-dom/components/common#applying-css-styles)
- 🔗 [Injecting dynamic styles from CSS-in-JS libraries](https://react.dev/reference/react/useInsertionEffect#injecting-dynamic-styles-from-css-in-js-libraries)
- 🔗 [styled-components](https://styled-components.com/docs)
- 🔗 [CSS-Modules](https://github.com/css-modules/css-modules)

[⬆ Back to Top](#applying-css-styles)
