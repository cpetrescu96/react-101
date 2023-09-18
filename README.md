# Знакомство с хуком useRef

📚 Содержание:

- [Общее описание: useRef(initialValue)](#общее-описание-userefinitialvalue)
- [Применение useRef()](#применение-useref)
- [Примеры использования useRef()](#примеры-использования-useref)
- [Манипулирование DOM с помощью `ref`](#манипулирование-dom-с-помощью-ref)
- [Как избежать повторного создания содержимого `ref`](#как-избежать-повторного-создания-содержимого-ref)
- [Как избежать проверок на `null` после инициализации useRef()](#как-избежать-проверок-на-null-после-инициализации-useref)
- [Когда использовать `ref`](#когда-использовать-ref)

### Общее описание: useRef(initialValue)

**useRef()** - это React Hook, который позволяет ссылаться на значение, которое не требуется для рендеринга компонента.

```jsx
const ref = useRef(initialValue);
```

**useRef()** - возвращает изменяемый ref-объект, свойство `current` которого инициализируется начальным
значением `initialValue`. Возвращённый объект будет сохраняться в течение всего времени жизни компонента.

Как и все хуки React, он должен вызываться на верхнем уровне вашего компонента:

```jsx
import { useRef } from 'react';

const MyComponent = () => {
  const intervalRef = useRef(0);
  const inputRef = useRef(null);
  // ...
}
```

#### Параметры и возвращаемое значение

- `initialValue` - это значение, которое будет присвоено свойству `current` объекта `ref` изначально. Это может
  быть значение любого типа. Этот аргумент будет игнорироваться после первоначального рендеринга.

`useRef()` возвращает объект с одним свойством `current`:

- `current` - это значение, которое было установлено при первом вызове `useRef()`. Позже вы можете установить
  его на что-нибудь другое. Если вы передадите ref-объект как атрибут `ref` для JSX элемента (`JSX.Element`), то
  React установит этот элемент его как текущее значение свойства `current`.

При повторных рендерах компонента, хук `useRef()` вернет тот же объект.

#### ⚠️ Предостережения

- Вы можете изменить свойство `ref.current`. В отличие от состояния, оно изменяемо (Mutable type). Однако
  если `ref.current` содержит объект, используемый для рендеринга (например, часть вашего состояния), вам не следует
  изменять этот объект.
- Когда вы меняете свойство `ref.current`, React не выполняет повторный ренедеринг вашего компонента. React не
  отслеживает изменения объекта `ref`, поскольку `ref` - это простой объект JavaScript.
- Не записывайте и не читайте `ref.current` во время рендеринга, за исключением инициализации. Это делает поведение
  вашего компонента непредсказуемым.
- В строгом режиме (Strict Mode) React дважды вызовет функцию вашего компонента, чтобы помочь вам найти случайные
  побочные эффекты. Это поведение предназначено только для разработки и не влияет на производство. Каждый ref-объект
  будет создан дважды, но одна из версий будет отброшена. Если ваша функция компонента чистая (как и должно быть), это
  не должно влиять на поведение.

[⬆ Back to Top](#знакомство-с-хуком-useref)

### Применение useRef()

`useRef()` возвращает ref-объект (далее просто `ref`) с одним свойством `current`, изначально установленным в указанное
вами `initialValue`.

При повторном рендеренге `useRef()` вернет тот же самый объект. Вы можете изменить свойство `current`, чтобы сохранить
информацию и прочитать ее позже. Это похоже на состояние компонента (state), но есть важное отличие.

💡 Изменение `ref` не вызывает повторный рендеринг. Это означает, что  `ref` идеально подходят для хранения информации,
которая не влияет на визуальный вывод вашего компонента. Например, если вам нужно
сохранить [interval ID](https://developer.mozilla.org/en-US/docs/Web/API/setInterval) и получить его позже, вы можете
поместить его в `ref`. Чтобы обновить значение внутри `ref`, вам необходимо вручную изменить его свойство `current`:

```jsx
import { useRef } from 'react';

export const Stopwatch = () => {
  const handleStartClick = () => {
    const intervalId = setInterval(() => {
      // ...
    }, 1000);

    intervalRef.current = intervalId;
  }
  //...
}
```

Позже вы можете прочитать этот идентификатор интервала из `ref`, чтобы можно было остановить таймер, заданный
функцией `setInterval()`:

```jsx
const handleStopClick = () => {
  const intervalId = intervalRef.current;

  clearInterval(intervalId);
};
```

Используя `ref`, вы гарантируете, что:

- Вы можете хранить информацию между повторными рендерингами (в отличие от обычных переменных, которые сбрасываются при
  каждом рендеринге).
- Его изменение не приводит к повторному рендерингу (в отличие от переменных состояния, которые запускают повторный
  рендеринг).
- Информация является локальной для каждой копии вашего компонента (в отличие от внешних переменных, которые являются
  общими).

⚠️ ️️Изменение `ref` не приводит к повторному рендерингу, поэтому `ref` объекты не подходят для хранения информации,
которую вы
хотите отобразить на экране, вместо этого используйте состояние.

[⬆ Back to Top](#знакомство-с-хуком-useref)

### Примеры использования useRef()

#### Пример ссылки на значение с помощью useRef() - Click counter

Этот компонент использует `ref` для отслеживания того, сколько раз была нажата кнопка. Обратите внимание, что здесь
можно использовать `ref` вместо состояния, поскольку количество кликов считывается и записывается только в обработчике
событий.

```jsx
export const Counter = () => {
  let ref = useRef(0);

  const handleClick = () => {
    ref.current = ref.current + 1;

    alert('You clicked ' + ref.current + ' times!');
  };

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
};
```

Если вы отобразите `{ref.current}` в JSX, число не будет обновляться при нажатии. Это связано с тем, что установка
значения для `ref.current` не запускает повторный рендеринг.

#### Пример ссылки на значение с помощью useRef() - Секундомер

В этом примере используется комбинация состояния и `ref`. И `startTime`, и `now` являются переменными состояния,
поскольку они используются для рендеринга. Но нам также необходимо сохранить `interval ID`, чтобы мы могли
остановить интервал нажатием кнопки. Поскольку `interval ID` не используется для рендеринга, целесообразно сохранить его
в ссылке и обновлять вручную.

```jsx
import { useState, useRef } from 'react';

export const Stopwatch = () => {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  const handleStart = () => {
    setStartTime(Date.now());

    setNow(Date.now());

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  const handleStop = () => {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;

  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

⚠️ Не записывайте и не читайте `ref.current` во время рендеринга.

React ожидает, что ваш функциональный компонент будет вести себя как чистая функция:

- Если входные данные (пропсы, состояние и контекст) одинаковы, то компонент возвращать точно такой же JSX.
- Вызов его в другом порядке или с другими аргументами не должен влиять на результаты других вызовов (рендеринг
  компонента не должен влиять на последуюущие рендеренги этого компонента).

```jsx
const MyComponent = () => {
  // ...
  // ❌ Don't write a ref during rendering
  myRef.current = 123;
  // ...
  // ❌ Don't read a ref during rendering
  return <h1>{myOtherRef.current}</h1>;
}
```

Вместо этого вы можете читать или записывать `ref` из обработчиков событий или эффектов.

```jsx
const MyComponent = () => {
  // ...
  useEffect(() => {
    // ✅ You can read or write refs in effects
    myRef.current = 123;
  });
  // ...
  const handleClick = () => {
    // ✅ You can read or write refs in event handlers
    doSomething(myOtherRef.current);
  };
  // ...
};
```

Если вам нужно что-то прочитать или записать во время рендеринга, используйте вместо этого состояние.

[⬆ Back to Top](#знакомство-с-хуком-useref)

### Манипулирование DOM с помощью `ref`

Очень часто `ref` используется для манипуляций с DOM.

Сначала объявите объект `ref` с начальным значением `null`:

```jsx
import { useRef } from 'react';

const MyComponent = () => {
  const inputRef = useRef(null);
  // ...
}
```

Затем передайте `ref` в качестве атрибута элемента DOM в JSX, которым вы хотите манипулировать:

```jsx
// ...
return <input ref={inputRef} />;
```

После того, как React создаст узел DOM и отобразит его на экране, React установит свойство `current` вашего
объекта `ref`
для этого узла DOM. После этого вы сможете получить доступ к узлу DOM `<input>` и вызвать такие методы, например
как `focus()`:

```jsx
const handleClick = () => {
  inputRef.current.focus();
};
```

React вернет свойству `current` значение `null`, когда узел будет удален с экрана.

[⬆ Back to Top](#знакомство-с-хуком-useref)

### Как избежать повторного создания содержимого `ref`

React сохраняет исходное значение `ref` один раз и игнорирует его при следующих рендерах.

```jsx
const Video = () => {
  const playerRef = useRef(new VideoPlayer());
  // ...
}
```

Хотя результат `new VideoPlayer()` используется только для первоначального рендеринга, вы все равно вызываете эту
функцию при каждом рендеринге. Это может быть расточительно, если создание объекта это ресурсоемкая операция.

Чтобы решить эту проблему, вы можете вместо этого инициализировать `ref` следующим образом:

```jsx
const Video = () => {
  const playerRef = useRef(null);

  if (playerRef.current === null) {
    playerRef.current = new VideoPlayer();
  }
  // ...
};
```

Обычно запись или чтение `ref.current` во время рендеринга не допускается. Однако в данном случае это нормально,
поскольку результат всегда один и тот же, а условие выполняется только во время инициализации, поэтому оно полностью
предсказуемо.

[⬆ Back to Top](#знакомство-с-хуком-useref)

### Как избежать проверок на `null` после инициализации `useRef()`

Если вы используете средство проверки типов и не хотите всегда проверять значение на `null`, вместо этого вы можете
попробовать такой паттерн:

```jsx
const Video = () => {
  const playerRef = useRef(null);

  const getPlayer = () => {
    if (playerRef.current === null) {
      const player = new VideoPlayer();

      playerRef.current = player;
    }

    return playerRef.current;
  };

  // ...
};
```

Затем вы можете использовать `getPlayer()` в своих обработчиках событий.

[⬆ Back to Top](#знакомство-с-хуком-useref)

### Когда использовать `ref`

`ref` дает возможность получить доступ к DOM-узлам или React-элементам, созданным в рендер-методе.

В обычном потоке данных React, родительские компоненты могут взаимодействовать с дочерними только через пропсы. Чтобы
модифицировать потомка, вы должны заново отрендерить его с новыми пропсами. Тем не менее, могут возникать ситуации,
когда вам требуется императивно изменить дочерний элемент, в обход обычного потока данных. Подлежащий изменениям
дочерний элемент может быть как React-компонентом, так и DOM-элементом, вы этих случаях можно воспользоваться `ref`.

Ситуации, в которых использование `ref` является оправданным:

- Управление фокусом, выделение текста или воспроизведение медиа;
- Императивный вызов анимаций, например прокрутка изображения для просмотра;
- Интеграция со сторонними DOM-библиотеками.
- Предоставление ссылки на ваш собственный компонент (использование в паре
  с [forwardRef()](https://react.dev/reference/react/forwardRef))

⚠️ Избегайте использования рефов в ситуациях, когда задачу можно решить декларативным способом.

⚠️ Нельзя использовать `ref` атрибут с функциональными компонентами, потому что для них не создаётся экземпляров как для
классовых компонентов.

```jsx
import { useRef } from 'react';

const MyInputComponent = () => {
  return <input />;
};

const SomeParentComponent = () => {
  const textInput = useRef(null);

  // ❌ This will not work!
  return (
    <MyInputComponent ref={textInput} />
  );
};
```

Для того что бы передать `ref` внутрь дочернего компонента существует React API
метод [forwardRef()](https://react.dev/reference/react/forwardRef), который позволяет вашему компоненту предоставлять
узел DOM родительскому компоненту с помощью `ref`.

```jsx
import { useRef } from 'react';

const MyInputComponent = forwardRef((props, ref) => {
  return <input ref={ref} />;
});

const SomeParentComponent = () => {
  const textInput = useRef(null);

  // ✅ This will work!
  return (
    <MyInputComponent ref={textInput} />
  );
};
```

### Bnju

- `useRef(initialValue)` возвращает ref-объект, этот объект имеет свойство `current`: вы можете использовать это
  свойство для чтения или записи в него значения;
- Между повторными рендерингами компонента значение `ref.current` сохраняется;
- Обновление `ref.current`, в отличие от обновления состояния, не вызывает повторный рендеринг компонента;
- `ref` также может ссылаться на элемент DOM, это позволяет получить доступ к элементу DOM и его свойствам;
- Вместо записи или чтения `ref.current` во время рендеринга, лучше использовать для этого обработчики событий или
  эффекты (хук useEffect);
- Нельзя использовать `ref` атрибут с функциональными компонентами, потому что для них не создаётся экземпляров как для
  классовых компонентов;
- Для того, что бы передать `ref` для использования его в дочернем компоненте, нужно обернуть дочерний компонент в вызов
  React API метода `forwardRef()`;

Документация по теме:

- 🔗 [React Hook useRef()](https://react.dev/reference/react/useRef)
- 🔗 [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs)
- 🔗 [React API: forwardRef()](https://react.dev/reference/react/forwardRef)

[⬆ Back to Top](#знакомство-с-хуком-useref)
