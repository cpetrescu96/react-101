# Применение стилей CSS

📚 Содержание

- [Встроенные стили (Inline Styling)](#встроенные-стили-inline-styling)
- [Использование классов CSS (внешние таблицы стилей)](#использование-классов-css-внешние-таблицы-стилей)
- [Применение нескольких классов по условию](#применение-нескольких-классов-по-условию)
- [Использование styled-components (CSS-in-JS)](#использование-styled-components-css-in-js)
- [Использование CSS-Modules](#использование-css-modules)
- [Использование препроцессоров CSS](#использование-препроцессоров-css)
- [Использование Tailwind CSS](#использование-tailwind-css)
- [Использование библиотек компонентов](#использование-библиотек-компонентов)

В данном разделе представлен краткий обзор методов стилизации компонентов React.

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

⛔ Использование атрибута `style` для оформления элементов не рекомендуется. Классы CSS обычно более производительны, чем
встроенные стили.

[⬆ Back to Top](#применение-стилей-css)

### Использование классов CSS (внешние таблицы стилей)

Классический способ использования стилей - подключение их из внешних css-файлов. Класс CSS указывается как значение для
атрибута с именем `className`. Он работает как обычный атрибут `class` в HTML.

```jsx
return <img className="avatar" />;
```

[⬆ Back to Top](#применение-стилей-css)

### Применение нескольких классов по условию

Чтобы условно применить классы CSS, вам необходимо самостоятельно создать строку `className` с помощью JavaScript.

```jsx
return <div className={'row ' + (isSelected ? 'selected' : '')}>...</div>;
```

Чтобы сделать это более читабельным, можно использовать небольшую вспомогательную библиотеку,
например [classnames](https://github.com/JedWatson/classnames):

```jsx
import cn from 'classnames';

const Row = ({isSelected}) => {
  return <div className={cn('row', isSelected && 'selected')}>...</div>;
};
```

Это особенно удобно, если используется несколько условных классов:

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

[⬆ Back to Top](#применение-стилей-css)

### Использование styled-components (CSS-in-JS)

Библиотека [styled-components](https://styled-components.com/) позволяет писать стили как обычный CSS-код, пользуясь при
этом всеми преимуществами JavaScript. Это означает то, что вы можете использовать весь функционал CSS, даже такой как
медиа запросы, псевдо-селекторы, вложения и т.п в JavaScript

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

👍 Плюсы

- Стилизация на основе компонентов. Стили записываются внутри компонента, что улучшает организацию кода и возможность
  повторного использования.
- Динамическое оформление. Стилизованные компоненты обеспечивают динамическое оформление на основе свойств или состояния
  компонента.
- Гарантируют отсутствие конфликтов стилей, генерируя уникальные имена классов для ваших написанных стилей.
- Поддерживают принцип DRY, предлагая отличные шаблоны для организации вашего кода, а стилизованные компоненты
  совместимы с широким спектром фреймворков и библиотек.
- Отлично подходят для разработки и поддержки дизайн систем.

👎 Минусы

- Сложность сборки: решения CSS-in-JS часто требуют дополнительных инструментов сборки и зависимостей.
- Влияние на производительность. Создание динамических стилей во время выполнения может повлиять на производительность
  приложения.

[⬆ Back to Top](#применение-стилей-css)

### Использование CSS-Modules

CSS-модуль - это файл CSS, в котором все имена классов и имена анимаций по умолчанию ограничены локально, они
компилируются в низкоуровневый формат обмена, называемый ICSS или Interoperable CSS, но записываются как обычные файлы
CSS, автоматически создавая уникальное имя класса в формате `[имя файла]_[имя класса]_[хеш]`

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

Инструмент [CRA](https://create-react-app.dev/) поддерживает модули CSS наряду с обычными таблицами стилей, используя
соглашение об именовании файлов `[name].module.css` (CRA считается устаревшим).

Аналогичным образом осуществляется поддержка CSS-Modules
инструментом [Vite](https://vitejs.dev/guide/features.html#css), для сборщика
модулей [Webpack](https://webpack.js.org/loaders/css-loader/) требуется отдельная настройка.

👍 Плюсы

- Изоляция на уровне компонента/модуля (в отличие от CSS/SASS)
- Уникальные сгенерированные имена классов исключают конфликт стилей.
- Можно использовать их сразу без настройки в проектах CRA/Vite.
- Может использоваться с SASS/CSS.

👎 Минусы

- Может быть сложно ссылаться на имена классов

[⬆ Back to Top](#применение-стилей-css)

### Использование препроцессоров CSS

Препроцессоры CSS, такие как SASS, LESS или Stylus, предоставляют дополнительные функции, такие как переменные,
вложение, примеси и многое другое. Это повышает производительность и удобство сопровождения CSS-кода.

👍 Плюсы

- Расширенные возможности: SCSS представляет мощные функции, которые упрощают написание CSS и управление им.
- Возможность повторного использования кода: SCSS позволяет создавать повторно используемые фрагменты кода с
  использованием примесей и переменных.
- Простая миграция: существующие файлы CSS можно постепенно преобразовать в SCSS без значительного рефакторинга.

👎 Минусы

- Шаг компиляции: файлы SCSS необходимо скомпилировать в обычный CSS, прежде чем их можно будет использовать.
- Разработчики должны изучить синтаксис SCSS и его особенности.

[⬆ Back to Top](#применение-стилей-css)

### Использование Tailwind CSS

[Tailwind CSS](https://tailwindcss.com/docs/installation) - это CSS-фреймворк, ориентированный на утилиты, который
предлагает обширный набор предопределенных служебных классов. Это способствует быстрой разработке и единообразному
стилю.

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

👍 Плюсы

- Быстрое прототипирование: Tailwind CSS предоставляет обширную коллекцию служебных классов, позволяющих быстро
  разрабатывать пользовательский интерфейс.
- Широкие возможности настройки. Платформа позволяет выполнять настройку с помощью файла конфигурации, обеспечивая
  индивидуальный стиль.
- Согласованный стиль. Используя предопределенные служебные классы, можно легко поддерживать согласованность стиля.

👎 Минусы

- Размер файла: включение всей CSS-инфраструктуры Tailwind может привести к увеличению размера пакета.
- Перегрузка классов. Чрезмерное использование служебных классов может привести к раздутию HTML-разметки.

[⬆ Back to Top](#применение-стилей-css)

### Использование библиотек компонентов

Библиотеки компонентов, такие
как [Chakra UI](https://chakra-ui.com), [Material UI](https://mui.com/material-ui/getting-started/)
и [Ant Design](https://ant.design/) предлагают предварительно созданные и стилизованные компоненты React вместе с
сопутствующими стилями. Эти библиотеки обеспечивают согласованный и связный язык проектирования пользовательского
интерфейса.

👍 Плюсы

- Быстрая разработка: готовые к использованию компоненты ускоряют процесс разработки.
- Согласованный стиль: компоненты в библиотеке соответствуют единой системе дизайна, обеспечивая визуальную
  согласованность.
- Обширная документация. Популярные библиотеки компонентов имеют хорошо документированные API и рекомендации.

👎 Минусы

- Ограничения настройки. Хотя эти библиотеки предлагают возможности настройки, они могут не соответствовать всем
  требованиям дизайна.
- Размер пакета. Включение всей библиотеки компонентов может увеличить размер пакета приложения.

[⬆ Back to Top](#применение-стилей-css)

### Итог

Каждый вариант имеет свои сильные и слабые стороны, а выбор зависит от конкретных требований и предпочтений проекта.

- Чистый CSS: подходит для небольших проектов или когда основное внимание уделяется настройке CSS. Он прост и знаком, но
  ему не хватает инкапсуляции, что может привести к конфликтам имен классов в более крупных проектах.
- CSS-Modules: идеально подходят для проектов среднего размера, требующих инкапсуляции стилей. Он предлагает стили с
  ограниченной областью действия, предотвращает конфликты имен классов и создает импорт и ссылки на уникальные имена
  классов.
- CSS-in-JS: хорошо подходит для проектов со сложными или динамическими требованиями к стилю. Написание CSS
  непосредственно в JavaScript предлагает стили на основе компонентов и возможности динамического стиля, но это может
  увеличить размер пакета и требует дополнительного обучения.
- Препроцессоры CSS: рекомендуются для проектов, в которых используется расширенный синтаксис CSS с переменными,
  примесями и другими функциями. Они продвигают повторно используемые и поддерживаемые стили, но требуют процесса сборки
  для компиляции.
- Tailwind CSS: идеально подходит для быстрой разработки и прототипирования. Он предоставляет обширный набор служебных
  классов для согласованного стиля, но из-за количества служебных классов может привести к большому размеру файла.
- Библиотеки компонентов: полезно, когда вам нужны готовые к использованию компоненты пользовательского интерфейса с
  согласованным дизайном и поддержкой тем. Они предлагают обширные библиотеки компонентов, но могут иметь ограниченные
  возможности настройки и увеличивают размер итогового приложения.

Документация по теме:

- 🔗 [Applying CSS styles](https://react.dev/reference/react-dom/components/common#applying-css-styles)
- 🔗 [Injecting dynamic styles from CSS-in-JS libraries](https://react.dev/reference/react/useInsertionEffect#injecting-dynamic-styles-from-css-in-js-libraries)
- 🔗 [styled-components](https://styled-components.com/docs)
- 🔗 [CSS-Modules](https://github.com/css-modules/css-modules)

[⬆ Back to Top](#применение-стилей-css)
