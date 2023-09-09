# Совместное использование состояния между компонентами

### Подъём состояния (Lifting state up)

Иногда нужно, чтобы состояние двух компонентов всегда менялось одновременно. Для этого нужно удалить состояние из обоих
компонентов и переместить состояние к их ближайшему общему родительскому компоненту, а затем состояние будет
передаваться им в виде пропса (атрибута). Этот прием известен как ***Подъём состояния (Lifting state up)***, и это одна
из самых
распространенных вещей, которые вы будете делать при написании кода React.

### Подъём состояния на примере Accordion

В этом примере родительский компонент `<Accordion />` отображает две отдельные панели:

- `<Accordion />`
  - `<Panel />`
  - `<Panel />`

Каждый компонент `Panel` имеет логическое состояние `isActive`, которое определяет, видимо ли его содержимое.

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

Но теперь предположим, что вы хотите изменить его так, чтобы в любой момент времени была открыта только одна панель. При
таком дизайне открытие второй панели должно свернуть первую.

Чтобы скоординировать эти две панели, вам нужно «поднять их состояние» до родительского компонента в три этапа:

1. Удалить состояние из дочерних компонентов.
2. Передать данные от общего родителя.
3. Добавить состояние в общем родительском компоненте и передать его вместе с обработчиками событий.

Это позволит компоненту `<Accordion />` координировать обе панели и открывать их только по одной.

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

На этом подъем состояния завершен!  Перемещение состояния в общий родительский компонент позволило скоординировать две
панели. Использование активного индекса вместо двух флагов `«is shown»` гарантировало, что в данный момент времени
активна
только одна панель. А передача обработчика событий дочернему элементу позволила дочернему элементу изменить состояние
родителя.

### Итог

- Если вы хотите скоординировать два компонента, переместите их состояние к их общему родительскому компоненту.
- Затем передайте информацию через пропс (props) от их общего родителя.
- Наконец, передайте обработчики событий из родительского компонента, чтобы дочерние компоненты могли изменить состояние
  родительского компонента.
- Полезно рассматривать компоненты как `«контролируемые»` (управляемые пропсами) или `«неуправляемые»` (управляемые
  состоянием).

🔗 [Ссылка на деплой приложения React Roadmap (Accordion)](https://react-roadmap-ab1e50.netlify.app/)

Готовый пример с приложением находится в src раздела chapter-09.

Для запуска примера с готовым приложением выполните команды:


```shell
git clone https://github.com/shopot/react-101.git

git checkout chapter-10

npm install

npm run dev
```

Документация по теме:

- 🔗 [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)

[⬆ Back to Top](#совместное-использование-состояния-между-компонентами)

