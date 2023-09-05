# Применение стилей CSS

### Встроенные стили (Inline Styling)

Чтобы стилизовать элемент с помощью атрибута встроенного стиля, значение должно быть объектом JavaScript:

```jsx
const container = {
  marginTop: '16px',
  padding: 12,
  background: 'red',
};

return <div style={container}></div>;
```

Атрибут `style` принимает JavaScript-объект со свойствами в `camelCase` вместо CSS-строк.

⛔ Использование атрибута `style` для оформления элементов не рекомендуется. Классы CSS обычно более производительны, чем встроенные стили.

### Использование классов CSS (внешние таблицы стилей)

Классический способ использования стилей - подключение их из внешних css-файлов. Класс CSS указывается как значение для атрибута с именем `className`. Он работает как обычный атрибут `class` в HTML.

```jsx
return <img className="avatar" />;
```

### Применение нескольких классов по условию

Чтобы условно применить классы CSS, вам необходимо самостоятельно создать строку `className` с помощью JavaScript.

```jsx
return <div className={'row ' + (isSelected ? 'selected' : '')}>...</div>;
```

Чтобы сделать это более читабельным, можно использовать небольшую вспомогательную библиотеку, например [classnames](https://github.com/JedWatson/classnames):

```jsx
import cn from 'classnames';

const Row = ({ isSelected }) => {
  return <div className={cn('row', isSelected && 'selected')}>...</div>;
};
```

Это особенно удобно, если используется несколько условных классов:

```jsx
import cn from 'classnames';

const Row = ({ isSelected, size }) => {
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

### Использование styled-components (CSS-in-JS)

Библиотека [styled-components](https://styled-components.com/) позволяет писать стили как обычный CSS-код, пользуясь при этом всеми преимуществами JavaScript. Это означает то, что вы можете использовать весь функционал CSS, даже такой как медиа запросы, псевдо-селекторы, вложения и т.п в JavaScript

Стили создаются прямо в файле компонента:

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

🟢 `styled-components` динамически стилизуют ваши элементы так, как вы считаете нужным. Они поддерживают принцип DRY, предлагая отличные шаблоны для организации вашего кода, а стилизованные компоненты совместимы с широким спектром фреймворков и библиотек. Они также отлично подходят для разработки и поддержки дизайн систем.

🔴 `styled-components` требуют больших вычислительных затрат при преобразовании объявлений в простой CSS. Это может повлиять на производительность вашего приложения. `styled-components` также требует время, для ознакомления с синтаксисом и функциями.

### Использование CSS-Modules

CSS-модуль - это файл CSS, в котором все имена классов и имена анимаций по умолчанию ограничены локально, они компилируются в низкоуровневый формат обмена, называемый ICSS или Interoperable CSS, но записываются как обычные файлы CSS, автоматически создавая уникальное имя класса в формате `[имя файла]_[имя класса]_[хеш]`

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

Инструмент [CRA](https://create-react-app.dev/) поддерживает модули CSS наряду с обычными таблицами стилей, используя соглашение об именовании файлов `[name].module.css` (CRA считается устаревшим).

Аналогичным образом осуществляется поддержка CSS-Modules инструментом [Vite](https://vitejs.dev/guide/features.html#css) и сборщиком модулей [Webpack](https://webpack.js.org/loaders/css-loader/).

Документация по теме:

- 🔗 [Applying CSS styles](https://react.dev/reference/react-dom/components/common#applying-css-styles)
- 🔗 [Injecting dynamic styles from CSS-in-JS libraries](https://react.dev/reference/react/useInsertionEffect#injecting-dynamic-styles-from-css-in-js-libraries)
- 🔗 [styled-components](https://styled-components.com/docs)
- 🔗 [CSS-Modules](https://github.com/css-modules/css-modules)

[⬆ Back to Top](#применение-стилей-css)
