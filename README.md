# Компоненты - одна из основных концепций React

📚 Содержание

- [Функциональный компонент](#функциональный-компонент)
- [Использование компонентов](#использование-компонентов)
- [Импорт и экспорт компонентов](#импорт-и-экспорт-компонентов)
- [Компоненты и пропсы](#компоненты-и-пропсы)
- [Чтение props внутри дочернего компонента](#чтение-props-внутри-дочернего-компонента)
- [Указание значения по умолчанию для props](#указание-значения-по-умолчанию-для-props)
- [Пересылка пропсов с помощью spread syntax JSX](#пересылка-пропсов-с-помощью-spread-syntax-jsx)
- [Передача JSX как дочерние элементы (children)](#передача-jsx-как-дочерние-элементы-children)

`Компоненты React.js` - это небольшие блоки кода, которые вы можете использовать для создания переиспользуемых элементов
интерфейса. Компонент являются основным строительным блоком при создании приложений на React.js.

Всего существует два типа пользовательских компонентов: `основанные на классах` и `основанные на функциях`.

- Классовые компоненты наследуются от базового класса `React.Component` и имеют состояние (state), методы жизненного
  цикла и многое другое.
- Функциональные компоненты - это более простые компоненты, не имеющие состояния и методов жизненного цикла.

🚩 _Компоненты на базе класса раньше были наиболее популярным способом создания компонентов React. Однако с появлением
React Hooks функциональные компоненты полностью заменили классовые._

### Функциональный компонент

Это функция JavaScript, возвращающая JSX. Функция не требует расширения и не нужно запоминать никаких специальных
методов.

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

// Определение ReactNode
type ReactNode = string | number | boolean
  | ReactElement<any, string | JSXElementConstructor<any>>
  | Iterable<ReactNode> | ReactPortal | null | undefined
```

🚩🚩🚩 Компоненты React - это обычные функции JavaScript, но их имена должны **начинаться с заглавной буквы**, иначе они не
будут работать!

**[⬆ Back to Top](#компоненты---одна-из-основных-концепций-react)**

### Использование компонентов

Теперь, когда определены компоненты `<Header>` и `<Footer>`, их можно вложить в другие компоненты.

```jsx
const App = () => {
  return (
    <>
      <Heder />
      <main className="content">
        <img src="https://i.imgur.com/MK3eW3As.jpg" alt="Katherine Johnson" />
      </main>
      <Footer />
    </>
  );
};
```

🚩🚩🚩 Без круглых скобок любой код в строках после возврата будет игнорироваться!

🔗 [What are the rules for JavaScript's automatic semicolon insertion (ASI)?](https://stackoverflow.com/questions/2846283/what-are-the-rules-for-javascripts-automatic-semicolon-insertion-asi)

🚩🚩🚩 Компоненты могут отображать другие компоненты, но их определения (декларация компонента) никогда не следует
вкладывать друг в друга.

```jsx
export default function PageLayout() {
  // 🔴 Never define a component inside another component!
  function Header() {
    // ...
  }

  // ...
}
```

Приведенный выше фрагмент будет работает очень медленно и будет вызывать ошибки.

**[⬆ Back to Top](#компоненты---одна-из-основных-концепций-react)**

### Импорт и экспорт компонентов

Магия компонентов заключается в их возможности повторного использования: вы можете создавать компоненты, состоящие из
других компонентов. Но по мере того, как вы вкладываете все больше и больше компонентов, часто имеет смысл разбить их на
разные файлы. Это позволяет вам легко сканировать файлы и повторно использовать компоненты в большем количестве мест.

**💡 Компонент React = Модуль = Файл**

`Root component file` - это обычно с именем App.js (app.tsx). Однако в зависимости от ваших настроек ваш корневой
компонент может находиться в другом файле.

**💡В большинстве случаев, наименование файла будет определяться в рамках выбранной архитектуры.**

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

**[⬆ Back to Top](#компоненты---одна-из-основных-концепций-react)**

### Компоненты и пропсы

Компоненты React используют пропсы (Props) для взаимодействия друг с другом. Каждый родительский компонент может
передавать некоторую информацию своим дочерним компонентам, передав им пропсы.

Props - это информация, которую вы передаете в тег JSX. Например, `className`, `src`, `alt`, `width` и `height` - это
некоторые из пропсов (атрибутов), которые можно передать в `<img>`

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

Встроенные компоненты браузера в React `<img>`, `<div>`, `<input>` и т.д., ведут аналогично пользовательским
компонентам, они могут принимать пропсы (
атрибуты) и обработчики событий.

Пример передачи пропсов в пользовательские компоненты:

```jsx
export const Profile = () => {
  return <Avatar
    person={{name: 'Lin Lanying', imageId: '1bX5QH6'}}
    size={100}
  />;
};
```

💡 Двойные фигурные скобки после `person=` это объект внутри фигурных скобок JSX.

🔗 [Using “double curlies”: CSS and other objects in JSX](https://react.dev/learn/javascript-in-jsx-with-curly-braces#using-double-curlies-css-and-other-objects-in-jsx)

Передача пропсов в дочерний компонент не что иное, как передача аргументов в функцию JavaScript.

**[⬆ Back to Top](#компоненты---одна-из-основных-концепций-react)**

### Чтение props внутри дочернего компонента

```jsx
// Деструктурирующее присваивание (object destructuring)
const Avatar = ({person, size}) => {
  // person and size are available here
};
```

Этот синтаксис называется "деструктуризацией" и эквивалентен чтению свойств из параметра функции.

**[⬆ Back to Top](#компоненты---одна-из-основных-концепций-react)**

### Указание значения по умолчанию для props

```jsx
const Avatar = ({person, size = 100}) => {
  // ...
};
```

**[⬆ Back to Top](#компоненты---одна-из-основных-концепций-react)**

### Пересылка пропсов с помощью spread syntax JSX

```jsx
const Profile = (props) => {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
};
```

**[⬆ Back to Top](#компоненты---одна-из-основных-концепций-react)**

### Передача JSX как дочерние элементы (children)

Обычно в браузере используются вложенные теги

```html
<div>
  <img />
</div>
```

Таким же образом можно вложить компоненты

```js
<Card>
  <Avatar/>
</Card>
```

Когда вы вкладываете контент в тег JSX, родительский компонент получит этот контент в `props`,
называемом `children` (`props.children`).

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

💡 Пропсы (props) - это моментальные снимки значений, доступные только для чтения: при каждом рендере компонент
получает новую версию пропсов.

💡 Пропсы (props) нельзя изменить (immutable). Если нужна интерактивность, то нужно будет установить состояние.

```jsx
const Clock = ({color, time}) => {
  return <h1 style={{color: color}}>{time}</h1>;
};
```

Когда вам нужно отреагировать на ввод пользователя (например, изменить выбранный цвет), вам нужно будет "установить
состояние", о чем вы можете узнать в
[State: A Component's Memory](https://react.dev/learn/state-a-components-memory)

Документация по теме:

- 🔗 [Your First Component](https://react.dev/learn/your-first-component)
- 🔗 [Describing the UI](https://react.dev/learn/describing-the-ui)

**[⬆ Back to Top](#компоненты---одна-из-основных-концепций-react)**
