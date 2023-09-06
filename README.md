# React DOM компоненты - компоненты форм

React поддерживает все встроенные в браузер компоненты HTML и SVG.

Встроенные компоненты браузера `<input>`, `<select>` и `<textarea>`принимают вводимые пользователем данные. Это особенные компоненты в React, потому что передача им значения в виде атрибута (пропса) делает их контролируемыми.

💡 **Контролируемый компонент** (`Controlled component`) в React - это компонент, значение которого управляется React. Обычно это достигается через использование состояния (state) компонента, чтобы хранить значение компонента и обновлять его в соответствии с пользовательским вводом.

```xml
<input value={myInputValue} />
```

## Компонент формы `<input>`

Встроенный в браузер компонент `<input>` позволяет отображать и вводить различные типы входных данных формы.

💡 `<input>` поддерживает все [общие атрибуты элементов](https://react.dev/reference/react-dom/components/common#props).

```jsx
<input name="myInput" />
```

Вы можете сделать input управляемым, передав в него один из этих атрибутов (пропсов):

- `checked` - логическое значение. Для флажков `checkbox` и переключателей `radio button`, этот атрибут определяет, помечен (выбран) ли заранее элемент.
- `value` - строка. Управляет текстовым значением элемента. (Для переключателя `radio button` определяет данные формы).

💡 При передаче любого атрибута `checked` или `value`, нужно так же передать обработчик события `onChange`, который ,будет обновлять переданное значение (State).

Следующие атрибуты (пропсы) `<input>` актуальны только если компонент определен как неконтролируемый:

- `defaultChecked`: логическое значение. Определяет начальное значение для флажков `type="checkbox"` и переключателей `type="radio"`.
- `defaultValue`: строка. Определяет начальное значение для текстового ввода.

### Отображение `<input>` разных типов

Чтобы отобразить ввод, визуализируйте компонент `<input>`. По умолчанию это будет текстовый ввод `type="text"`. Вы можете передать `type="checkbox"` для флажка, `type="radio"` для переключателя или один из других [доступных типов](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#input_types).

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

### Создание метки `<label>` для элемента `<input>`

Обычно каждый элемент `<input>` помещается внутри тега `<label>`. Это сообщает браузеру, что эта метка связана с этим вводом. Когда пользователь нажимает на метку, браузер автоматически фокусирует ввод. Это также важно для доступности (`Accessibility`): программа чтения с экрана объявляет заголовок метки, когда пользователь фокусирует соответствующий ввод.

Если нет возможности вложить `<input>` в `<label>`, свяжите их, передав один и тот же идентификатор ()`id`) в `<input id>` и `<label htmlFor>`. Чтобы избежать конфликтов между несколькими экземплярами одного компонента, сгенерируйте такой идентификатор с помощью `React.useId()`.

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

### Установка начального значения для `<input>`

Можно указать начальное значение для любого элемента `<input>`. Достаточно передать его как строку в атрибут (пропс) `defaultValue` для текстового типа `<input>`.

Для флажков `type="checkbox"` и переключателей `type="radio"` начальное значение указывается с помощью логического значения для атрибута (пропса) `defaultChecked`.

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

### Чтение значений `<input>` при отправке формы

💡 По умолчанию при отправке формы `<form>` через нажатие кнопки `<button type="submit">`, будет вызван обработчик событий `<form onSubmit>`, браузер отправит данные формы на текущий URL-адрес и обновит страницу.

Можно переопределить это поведение, вызвав `e.preventDefault()` и прочитать данные формы с помощью `new FormData(e.target)`.

```jsx
export const MyForm = () => {
  function handleSubmit(e) {
    // Prevent the browser from reloading the page
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // You can pass formData as a fetch body directly:
    fetch('/some-api', { method: form.method, body: formData });

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

Если дать имя каждому элементу формы, например `<input name="firstName" defaultValue="Taylor" />`, то указанное имя будет использоваться в качестве ключа в данных формы, например `{ firstName: "Taylor" }`.

```jsx
// Read the form data
const form = e.target;
const formData = new FormData(form);

console.log(formData.firstName);
```

💡 По умолчанию любая кнопка `<button>` внутри `<form>` делает ее отправку `<form onSubmit>`. Если вы создали пользовательский компонент React `<Button>`, то нужно предусмотреть возможность возврата `<button type="button">` вместо `<button>` без явного указания типа. Для кнопок, которые должны отправлять используйте используйте `<button type="submit">`, это определит порядок и четкие правила с явным указанием какая кнопка отвечает за отправку формы.

### Управление `<input>` с помощью переменной состояния

По умолчанию компонент типа `<input />` неконтролируемый. Даже если вы передаете начальное значение, например `<input defaultValue="Initial text" />`, JSX указывает только начальное значение и контролирует, какое значение должно быть прямо сейчас.

Чтобы выполнить рендер (визуализировать) контролируемого компонента типа `<input />`, ему нужно передать пропс (атрибут) `value` (или `checked` для флажков `type="checkbox"` и переключателей `type="radio"`). Тогда React будет всегда контролировать значение через переданный пропс `value`.

Обычно это можно сделать, объявив переменную состояния через вызов хука `useState`:

```jsx
const MyForm = () => {
  // Объявление переменной состояния
  const [firstName, setFirstName] = useState('');
  // ...

  // Связать значение input с переменной состояния
  // ... и обновлять переменную состояния при любых изменениях!
  return <input value={firstName} onChange={(e) => setFirstName(e.target.value)} />;
};
```

💡 Значение, которое вы передаете управляемым компонентам, не должно быть `undefined` или `null`. Если вам нужно, чтобы начальное значение было пустым, то инициализируйте переменную состояния пустой строкой `useState('')` как в примере выше.

💡 Если вы хотите управлять вводом при помощи переменной состояния, то вы должны обязательно передать обработчик событий `onChange`.

```jsx
// 🔴 Bug: controlled text input with no onChange handler
<input value={something} />

// ✅ Good: uncontrolled input with an initial value
<input defaultValue={something} />

// ✅ Good: controlled input with onChange
<input value={something} onChange={e => setSomething(e.target.value)} />

// ✅ Good: readonly controlled input without on change
<input value={something} readOnly={true} />

```

Примеры с `type="checkbox"`

```jsx
// ✅ Good: uncontrolled checkbox with an initial value
<input type="checkbox" defaultChecked={something} />

// ✅ Good: controlled checkbox with onChange
<input type="checkbox" checked={something} onChange={e => setSomething(e.target.checked)} />

// ✅ Good: readonly controlled input without on change
<input type="checkbox" checked={something} readOnly={true} />
```

⚠️ Переменную состояния контролируемого компонента нельзя обновлять асинхронно.

```jsx
const handleChange = (e) => {
  // 🔴 Bug: updating an input asynchronously
  setTimeout(() => {
    setFirstName(e.target.value);
  }, 100);
};

const handleChange = (e) => {
  // ✅ Updating a controlled input to e.target.value synchronously
  setFirstName(e.target.value);
};
```

### Оптимизация повторного рендеринга при каждом нажатии клавиши

Когда вы используете контролируемый ввод, вы устанавливаете состояние при каждом нажатии клавиши. Если компонент, содержащий ваше состояние, повторно отображает большое дерево, это будет сказываться на производительности:

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

Обновление состояния вызванное методом из хука `useState` приводит к повторному рендеренгу компонента и всех его потомков.

Поскольку `<PageContent />` не зависит от состояния ввода, то форму с вводом можно вынести в отдельный компонент:

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

Это значительно повышает производительность, поскольку теперь при каждом нажатии клавиши перерисовывается только компонент `<MyForm />`. Еще один из методов оптимизации повторного рендеринга это использование хука [useDeferredValue](https://react.dev/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui).

Документация по теме:

- 🔗 [Common components (e.g. `<div>`)](https://react.dev/reference/react-dom/components/common)
- 🔗 [Component `<input>`](https://react.dev/reference/react-dom/components/input)
- 🔗 [useDeferredValue](https://react.dev/reference/react/useDeferredValue#deferring-re-rendering-for-a-part-of-the-ui)

[⬆ Back to Top](#react-dom-компоненты---компоненты-форм)

```

```
