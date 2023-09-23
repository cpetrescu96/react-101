# Знакомство с React API: createPortal

📚 Содержание:

- [Применение: рендеринг в другую часть DOM](#применение-рендеринг-в-другую-часть-dom)
- [Рендеринг модального диалога с порталом](#рендеринг-модального-диалога-с-порталом)

**createPortal** - это метод, который позволяет визуализировать компоненты React в DOM-узел, находящийся вне
DOM-иерархии родительского компонента.

```jsx
<div>
  <SomeComponent />
  {createPortal(children, domNode, key ?)}
</div>;
```

### Описание метода `createPortal()`

Обычно рендеринг компонентов осуществляется внутри тега `div`, который находится в корневом узле React приложения. Но в
некоторых случаях может быть нужно разместить компонент где-то вне этого узла. Например, это может понадобиться для
создания модальных окон, всплывающих подсказок или пользовательских виджетов.

В этом случае `createPortal()` позволяет разработчикам выбрать произвольный DOM-узел и поместить туда компонент React,
используя простой синтаксис.

Чтобы создать портал, вызовите createPortal, передав некоторый JSX и узел DOM, где он должен быть отображен:

```jsx
import { createPortal } from 'react-dom';

// ...

<div>
  <p>This child is placed in the parent div.</p>
  {createPortal(
    <p>This child is placed in the document body.</p>,
    document.body
  )}
</div>
```

Портал меняет только физическое размещение узла DOM, он не меняет свое местоположение в дереве React компонентов. JSX
или компонент React, который вы рендерите через портал, ведет себя как дочерний узел компонента React, который его
отображает.

Параметры:

```jsx
createPortal(children, domNode, key ?);
```

- `children`: все, что можно отобразить с помощью React, например часть JSX (например, `<div />`
  или `<SomeComponent />`), фрагмент `(<>...</>`), строка или число, или массив из них.
- `domNode`: некоторые узлы DOM, например те, которые возвращаются `document.getElementById()`. Узел должен уже
  существовать. Передача другого узла DOM во время обновления приведет к воссозданию содержимого портала.
- `key` - необязательный параметр, уникальная строка или число, которое будет использоваться в качестве ключа портала.

`createPortal()` - возвращает узел React, который можно включить в JSX или вернуть из компонента React. Если React
обнаружит
его в выводе рендеринга, он поместит предоставленные дочерние элементы внутри предоставленного `domNode`.

⚠️ Предостережения

События с порталов распространяются в соответствии с деревом React, а не с деревом DOM. Например, если вы щелкнете
внутри портала, а портал обернут в `<div onClick={...}>`, сработает обработчик `onClick()`. Если это вызывает проблемы,
либо остановите распространение событий изнутри портала, либо переместите сам портал вверх в дереве React.

Некоторые распространенные сценарии, когда применяется метод `createPortal()`:

- Модальные окна и подсказки (pop-ups and tooltips): Когда необходимо отобразить контент поверх других элементов на
  странице или чтобы контент плавающих подсказок отображался на верху (или боком) элемента, в котором произошла мышь
  над.
- Рендеринг за пределами корневого узла React-приложения (Rendering outside of React-DOM root node): Иногда требуется
  отобразить элементы вне React дерева. Например, чтобы интегрировать со сторонними виджетами.
- Виджеты и элементы управления (widgets and controls): Вы можете использовать `createPortal()` для создания
  пользовательских элементов управления, которые можно отображать на любой странице вашего сайта или приложения.

### Применение: рендеринг в другую часть DOM

Порталы позволяют вашим компонентам отображать некоторые из своих дочерних элементов в другом месте DOM. Это позволяет
определенной части вашего компонента выйти за переделы из любых контейнеров, в которых он может находиться. Например,
компонент может отображать модальное диалоговое окно или всплывающую подсказку, которая появляется над остальной частью
страницы и за ее пределами:

```jsx
import { createPortal } from 'react-dom';

const MyComponent = () => {
  return (
    <div style={{border: '2px solid black'}}>
      <p>This child is placed in the parent div.</p>
      {createPortal(
        <p>This child is placed in the document body.</p>,
        document.body
      )}
    </div>
  );
};
```

Без портала второй тег `<p>` был бы помещен внутри родительского тега `<div>`, но портал «телепортировал» его в
`document.body`.

Обратите внимание, как второй абзац визуально выглядит за пределами родительского `<div>` с рамкой.
Если вы проверите структуру DOM с помощью инструментов разработчика, вы увидите, что второй тег `p` помещен
непосредственно в конец тега `<body>`:

```html

<body>
<div id="root">
  ...
  <div style="border: 2px solid black">
    <p>This child is placed inside the parent div.</p>
  </div>
  ...
</div>
<p>This child is placed in the document body.</p>
</body>
```

Портал меняет только физическое размещение узла DOM. Во всех остальных отношениях JSX, который вы отображаете на
портале, действует как дочерний узел компонента React, который его отображает. Например, дочерний компонент может
получить доступ к контексту, предоставленному родительским деревом, и события по-прежнему передаются от дочерних
компонентов к родителям в соответствии с деревом React.

### Рендеринг модального диалога с порталом

Вы можете использовать портал для создания модального диалогового окна, которое располагается над остальной частью
страницы, даже если компонент, вызывающий диалоговое окно, находится внутри контейнера с `overflow: hidden` или
другими стилями, которые мешают диалоговому окну.

```jsx
// src/components/modal-content.jsx
export const ModalContent = ({onClose}) => {
  return (
    <div className="modal">
      <div>I'm a modal dialog</div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
```

```jsx
// src/app.jsx
import { useState } from 'react';
import { createPortal } from 'react-dom';

export const App = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>
        Show modal using a portal
      </button>
      {showModal && createPortal(
        <ModalContent onClose={() => setShowModal(false)} />,
        document.body
      )}
    </>
  );
}
```

Важно убедиться, что ваше приложение доступно при использовании порталов. Например, вам может потребоваться управлять
фокусом клавиатуры, чтобы пользователь мог естественным образом перемещать фокус на портал и обратно.

При создании модальных окон следуйте
рекомендациям [WAI-ARIA Modal Authoring Practices](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/) по созданию
модальных окон. Если вы используете сторонний пакет (библиотеку) сообщества, убедитесь, что он использует семантику
доступности и соответствует рекомендациям ARIA.

[⬆ Back to Top](#знакомство-с-react-api-createportal)

Готовый пример с приложением находится в src раздела chapter-19.

Для запуска примера с готовым приложением выполните команды:

```shell
git clone https://github.com/shopot/react-101.git

git checkout chapter-10

npm install

npm run dev
```

Документация по теме:

- 🔗 [React API: createPortal](https://react.dev/reference/react-dom/createPortal)

[⬆ Back to Top](#знакомство-с-react-api-createportal)
