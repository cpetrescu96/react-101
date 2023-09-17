# Обработка событий

📚 Содержание

- [Обработчики событий - это пользовательские функции](#обработчики-событий---это-пользовательские-функции)
- [Добавление обработчиков событий](#добавление-обработчиков-событий)
- [Чтение пропсов в обработчиках событий](#чтение-пропсов-в-обработчиках-событий)
- [Передача обработчика событий в компонент](#передача-обработчика-событий-в-компонент)
- [Именование обработчика событий передаваемого как props](#именование-обработчика-событий-передаваемого-как-props)
- [Распространение событий (Event propagation)](#распространение-событий-event-propagation)
- [Остановка распространения (Stopping propagation )](#остановка-распространения-stopping-propagation-)
- [Предотвращение поведения по умолчанию](#предотвращение-поведения-по-умолчанию)
- [Могут ли обработчики событий иметь побочные эффекты?](#могут-ли-обработчики-событий-иметь-побочные-эффекты)

### Обработчики событий - это пользовательские функции

React позволяет добавлять обработчики событий в ваш JSX. Обработчики событий - это пользовательские функции, которые
будут запускаться в ответ на такие взаимодействия, как щелчок, наведение курсора, фокусировка на вводе формы и т. д.

Все обработчики событий получат объект события React. Его также иногда называют "синтетическим
событием" (`Synthetic event`). Он соответствует тому же стандарту, что и базовые события DOM, но исправляет некоторые
несоответствия браузера.

```ts
// TypeScript declaration
interface SyntheticEvent<T = Element, E = Event>
  extends BaseSyntheticEvent<E, EventTarget & T, EventTarget> {
}
```

Если по какой-то причине нужно базовое событие DOM, его можно получить из `e.nativeEvent`.

Более подробную информацию об объекте можно найти на на странице официальной документации:

- 🔗 [React event object](https://react.dev/reference/react-dom/components/common#react-event-object)

**[⬆ Back to Top](#обработка-событий)**

### Добавление обработчиков событий

Простой сценарий добавления обработчика в компонент `Button`:

- Объявить функцию `handleClick` внутри компонента `Button`.;
- Реализовать логику внутри этой функции;
- Добавить `onClick={handleClick}` в `<button>` JSX;

```jsx
export const Button = () => {
  const handleClick = () => {
    alert('You clicked me!');
  };

  return <button onClick={handleClick}>Click me</button>;
};
```

Другой альтернативный способ определить обработчик событий, встроенный в JSX (не очень хорошая практика):

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

💡 Функции, передаваемые обработчикам событий, должны передаваться, а не вызываться.

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

**[⬆ Back to Top](#обработка-событий)**

### Чтение пропсов в обработчиках событий

Поскольку обработчики событий объявляются внутри компонента, они имеют доступ к свойствам компонента.

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

**[⬆ Back to Top](#обработка-событий)**

### Передача обработчика событий в компонент

Часто требуется, чтобы родительский компонент указал обработчик событий для своего дочернего компонента.

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

**[⬆ Back to Top](#обработка-событий)**

### Именование обработчика событий передаваемого как props

По соглашению (Naming convention) пропсы обработчика событий должны начинаться с `on`, за которым следует заглавная
буква.

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

**[⬆ Back to Top](#обработка-событий)**

### Распространение событий (Event propagation)

Обработчики событий также будут перехватывать события от любых дочерних элементов вашего компонента.

Это значит что все события распространяются в React, за исключением `onScroll`, который работает только с тегом JSX, к
которому он прикреплен.

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

**[⬆ Back to Top](#обработка-событий)**

### Остановка распространения (Stopping propagation )

Если необходимо предотвратить попадание события в родительские компоненты, то нужно вызвать` e.stopPropagation()`:

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

**[⬆ Back to Top](#обработка-событий)**

### Предотвращение поведения по умолчанию

С некоторыми событиями браузера связано поведение по умолчанию. Например, событие отправки `<form>`, которое происходит
при нажатии кнопки внутри него, по умолчанию перезагрузит всю страницу.

Чтобы этого не произошло, необходимо вызвать `e.preventDefault()` для объекта события.

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

💡 Не путайте `e.stopPropagation()` и `e.preventDefault()`. Они оба полезны, но не связаны друг с другом:

- `e.stopPropagation()` останавливает срабатывание обработчиков событий, прикрепленных к тегам выше.
- `e.preventDefault()` предотвращает поведение браузера по умолчанию для тех немногих событий, которые его имеют.

**[⬆ Back to Top](#обработка-событий)**

### Могут ли обработчики событий иметь побочные эффекты?

Абсолютно! Обработчики событий - лучшее место для побочных эффектов.

В отличие от функций рендеринга, обработчики событий не обязательно должны быть чистыми, поэтому это отличное место для
того, чтобы что-то изменить - например, изменить значение ввода в ответ на ввод или изменить список в ответ на нажатие
кнопки.

### Итог

- Вы можете обрабатывать события, передавая функцию в качестве свойства элементу, например `<button>`;
- Обработчики событий должны передаваться, а не вызываться! `onClick={handleClick}`, а не `onClick={handleClick()}`;
- Вы можете определить функцию обработчика событий отдельно или встроенно.
- Обработчики событий определяются внутри компонента, поэтому они могут получать доступ к реквизитам;
- Вы можете объявить обработчик событий в родительском элементе и передать его в качестве свойства дочернему элементу;
- Вы можете определить свои собственные пропсы (как обработчик событий) с именами, специфичными для приложения;
- События распространяются вверх. Чтобы предотвратить это, вызовите `e.stopPropagation()` для первого аргумента;
  = События могут иметь нежелательное поведение браузера по умолчанию. Вызовите `e.preventDefault()`, чтобы
  предотвратить это;
- Явный вызов пропса (как обработчик событий) из дочернего обработчика является хорошей альтернативой распространению;

Документация по теме:

- 🔗 [Responding to Events](https://react.dev/learn/responding-to-events)
- 🔗 [React event object](https://react.dev/reference/react-dom/components/common#react-event-object)

**[⬆ Back to Top](#обработка-событий)**
