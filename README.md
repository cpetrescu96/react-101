
# Знакомство с Redux Toolkit

📚 Содержание

* [Термины и соглашения](#термины-и-соглашения)
* [Redux Toolkit на примере приложения Counter App](#redux-toolkit-на-примере-приложения-counter-app)
  * [План действий - Redux Toolkit Quick Start](#план-действий---redux-toolkit-quick-start)
  * [Установка Redux Toolkit](#установка-redux-toolkit)
  * [Подготовка файла для Redux Store](#подготовка-файла-для-redux-store)
  * [Установка связи между Redux Store и приложением React](#установка-связи-между-redux-store-и-приложением-react)
  * [Создание слайс-редюсера (slice reducer)](#создание-слайс-редюсера-slice-reducer)
  * [Добавление Slice Reducer в Redux Store](#добавление-slice-reducer-в-redux-store)
  * [Использование Redux Store в компонентах](#использование-redux-store-в-компонентах)
  * [Типизация useSelector и useDispatch](#типизация-useselector-и-usedispatch)
  * [Получение значения из Redux Store](#получение-значения-из-redux-store)
  * [Отправка действий в Redux Store](#отправка-действий-в-redux-store)
  * [Выполнение асинхронных действий](#выполнение-асинхронных-действий)
  * [Создание асинхронных действий с помощью createAsyncThunk](#создание-асинхронных-действий-с-помощью-createasyncthunk)

> Redux Toolkit (RTK) - Официальный набор инструментов для эффективной разработки Redux.

**Redux Toolkit** (далее просто **RTK**) упрощает разработку приложений, использующих Redux, делая код более читаемым и
поддерживаемым, а также уменьшая количество шаблонного кода, это более современный и удобный подход к управлению
состоянием, который рекомендуется для большинства проектов на базе Redux.

**RTK** подходит как для новых пользователей Redux, настраивающих свой первый проект, так и для опытных разработчиков,
которые хотят упростить существующее приложение.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

## Термины и соглашения

- **Redux** - Это контейнер с предсказуемым состоянием для приложений JavaScript, библиотека, npm пакет `redux`.
- **React Redux** - Это официальная библиотека для связывания Redux с React (React UI bindings layer ), npm пакет `react-redux`.
- **Redux Toolkit (RTK)** - Это библиотека предназначенная для упрощения написания логики Redux, npm пакет `@reduxjs/toolkit`.
- **Redux Thunk** - Thunk middleware для Redux. Он позволяет писать thunk-функции с асинхронной логикой внутри, которые могут взаимодействовать с методами Redux `dispatch()` и `getState()`.
- **Immer** - Это небольшая библиотека, позволяющая более удобно работать с неизменяемым (immutable) состоянием.
- **Reselect** - Библиотека для создания меморизированных функций-селекторов (selector). Обычно используется с Redux, но также может использоваться с любыми простыми неизменяемыми данными JS.
- **Redux Store** - Глобальный стейт (state) приложения созданный с использованием библиотеки Redux или RTK
- **store** - Это объект созданный при помощи `configureStore()`, он же Redux Store.
- **Action Creator** - Генераторы действий, это функции, которые создают действия (экшены).
- **Cлайс (Redux State Slice)** - Это объект который описывает логику работы функций-редюсеров, на основе этого объекта будут сгенерированы обычные редьюсеры и действия, которые затем передаются в Redux, другими словами это часть Redux Store.
- **Cлайс-редюсер (slice reducer)** - Это функция которая описывает логику для работы с состоянием отдельного слайса.
- **Root Reducer** - Это функция, которая объединяет все редюсеры (reducers) в приложении Redux в один главный редюсер, создается с использованием `combineReducers()`.
- **ReducersMapObject** - Это объект в Redux, который используется для определения набора редьюсеров (reducers) в приложении, в контексте RTK это набор слайс-редюсеров, может использоваться для создания Root Reducer.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

## Redux Toolkit на примере приложения Counter App

За основу будет взято приложение **Counter App** из раздела [Знакомство с Redux](https://github.com/shopot/react-101/tree/redux-base).

Приложение будет переписано с использованием RTK с версиями пакетов:

```json
"@reduxjs/toolkit": "^2.0.1",
"react": "^18.2.0",
"react-dom": "^18.2.0",
"react-redux": "^9.0.2",
```

В предидущей версии **Counter App** у нас была thunk-функция `reset()`, в этой реализации мы заменим ее на другой метод `incrementByAmount()`, 
который будет использовать вызов API `counterApi.getAmount()` и получать случайное число на которое будет увеличивать значение счетчика. 

### План действий - Redux Toolkit Quick Start

Давайте перечислим основные шаги для создания Redux Store для нашего приложения:

1. Установить необходимые пакеты `@reduxjs/toolkit` и `react-redux`.
2. Создать Redux Store с типизацией `RootState` и `AppDispatch` .
3. Обернуть компоненты React в `<Provider />` из `react-redux`, сделав доступным `store` для наших компонентов React.
4. Создать часть Redux Store в виде **Redux State Slice** при помощи функции `createSlice()`.
5. Добавить **Slice Reducer** в Redux Store.
6. Использовать Redux **State** и **Actions** в компонентах React.

### Установка Redux Toolkit

Для того что бы использовать Redux Toolkit установите пакет `@reduxjs/toolkit`.

Для того что бы React компоненты могли взаимодействовать с Redux Store требуется дополнительно установить `react-redux`.

```shell
npm install @reduxjs/toolkit react-redux
```

Устанавливать отдельно библиотеку `redux` больше не требуется, `redux` и еще ряд библиотек, таких как `immer`, `redux-thunk`, `reselect`
устанавливаются автоматически в качестве зависимостей вместе с установкой `@reduxjs/toolkit`.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Подготовка файла для Redux Store

Первым делом нужно создать файл, из которого будет экспортироваться объект `store` созданный при помощи `configureStore()`.

В качестве конфигурации на старте будем использовать объект с одним параметром и пустой функцией редюсер `counter`, позже мы еще вернемся к этому файлу для завершения настройки `store`.

```ts
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  // Reducers Map Object
  reducer: {
    counter: () => {},
  },
});
```

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Установка связи между Redux Store и приложением React

Для передачи Redux Store в приложение React используется специальный компонент `<Provider>` из пакета `react-redux`.
Компонент `<Provider>` оборачивает весь корневой компонент приложения и предоставляет Redux Store всем компонентам внутри него.

```tsx
// src/providers/app-provider.tsx
import { JSX, PropsWithChildren } from 'react';
import { Provider } from 'react-redux';

import { store } from '@/store';

export const AppProvider = ({ children }: PropsWithChildren): JSX.Element => {
  return <Provider store={store}>{children}</Provider>;
};
```

Компонент `<AppProvider />` это пользовательский компонент-обертка, который будет комбинировать все возможные провайдеры в один и который будет использован в компоненте `<App />`:

```tsx
// src/app/app.tsx
import { JSX } from 'react';

import { AppProvider } from '@/providers/app-provider';
import { Counter } from '@/features/counter';

const App = (): JSX.Element => {
  return (
    <AppProvider>
      <div>
        <h1>Counter App</h1>
        <Counter />
      </div>
    </AppProvider>
  );
};

export default App;
```

В дальнейшем каждый компонент, который нуждается в доступе к глобальному состоянию, может использовать хуки из
пакета `react-redux` для подключения к Redux Store и получения требуемых данных или выполнения действий над данными.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Создание слайс-редюсера (slice reducer)

При традиционном подходе в Redux (библиотека `redux`) требовалось создать функцию-редюсер с реализацией логики
обновления состояния на базе инструкций `switch..case`, отвечающую за обработку всех отправляемых действий и расчет того,
каким должен быть весь результат нового состояния (иммутабельный store - вы можете только создавать новую копию данных,
а не менять старое состояние store).

Помимо функции-редюсера требовалось создавать константы для действий (constants) и сами действия (actions), а так же
генераторы действий (action-creator), если store состоял из нескольких частей (slices) то для каждой части нужно было
писать свою функцию-редюсер со всем необходимым кодом (шаблонный код).

> Несколько функцций-редюсеров объединяются в один Root Reducer при помощи
> функции [combineReducers()](https://redux.js.org/api/combinereducers) - эта функция так же доступна для импорта
> из `@reduxjs/toolkit` и используется для объединения слайсов (Redux State Slice).

RTK предоставляет более упрощенный подход для создания редюсеров, вместо обычного редюсера RTK позволяет
создать объект **Redux State Slice** при помощи функции `createSlice()`, который будет содержать следующие свойства и методы:

- **name** - Имя слайса.
- **reducer** - Функция редюсер этого слайса для добавления в Redux Store (`store`) на этапе конфигурирования через `configureStore()`.
- **actions** - Генераторы действий (action-creator) для типов действий (которые создаются автоматически), обрабатываемых редюсерами этого слайса.
- **caseReducers** - Отдельные функции редюсеры, которые были переданы как аргумент при вызове `createSlice()` для повторного использования и тестирования.
- **getInitialState()** - Метод который возвращает начальное состояние переданное как аргумент при вызове `createSlice()`.

Функция `createSlice()` принимает четыре параметра:

- **name** - Имя будущего слайса, которое будет задействовано в действиях (actions), `domain` часть в нотации `domain/action`, это имя так же будет использовано в Redux DevTools;
- **initialState** - Начальное состояние для соответствующих редюсеров (их несколько);
- **reducers** - Объект содержащий функции редюсеры. На основе имени функции-редюсера будет автоматически создаваться генератор действия и тип действия;
- **extraReducers** - Необязательный параметр в виде объекта, который используется для добавления дополнительных функций редьюсеров, обычно используется для реализации асинхронных действий (async actions);

В отличие от функции-редюсера при использовании пакета `redux`, функция `createSlice()` использует отдельные функции в качестве функций-редюсеров без switch-case реализации, то есть это отдельные функции которые позволяют писать логику на основе мутабельного механизма (mutating).

Однако на самом деле они не изменяют состояние, поскольку используют "под капотом" библиотеку `immer`, которая определяет изменения и создает совершенно новое "immutable" состояние на основе этих изменений.

Функция-редюсер для `createSlice()` выглядит следующим образом:

```js
const incremet = (state) => {
  state.value += 1;
}
```
Функция-редюсер может получать два аргумента:

* `state` - текущее состояние слайса.
* `action` - объект `action` в котором есть свойство `payload`, которое будет содержать любые данные переданные в качестве аргументов в action-creator.

Генераторы действий (Action creators) автоматически создаются функцией `createSlice()` с именами соответствующими функциям-редюсерам, например для примера выше будет создан генератор действия с названием `increment()`, который затем можно будет использовать с вызовом функции `dispatch()`:

```js
dispatch(incremet());
```

> Если в action-creator передается аргумент, то он автоматически будет передаваться как `action.payload` для соответствующей функции-редюсера;

Теперь следует создать файл `counter-slice.ts` с начальным состоянием `{ value: 0 }` и тремя функциями-редюсерами:

```tsx
// src/features/counter/stores/counter-slice.ts
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '@/store';

import { counterApi } from '../api/counter-api';

export interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },

    decrement: (state) => {
      state.value -= 1;
    },

    reset: (state) => {
      state.value = 0;
    },
  }
});

// Action creators are generated for each case reducer function
export const { increment, decrement, reset } = counterSlice.actions;

export default counterSlice.reducer;
```

Здесь функция `createSlice()` возвращает объект типа `Slice` из которого экспортируются `actions` и `reducer` которые создаются автоматически.

Обратите внимание, что в самих функциях-редюсерах идет прямое изменение переменной состояния `state.value`и сами функции ничего не возвращают в отличии от классического подхода с использованием редюсеров, где логика в редюсерах была иммутабельной.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Добавление Slice Reducer в Redux Store

Теперь нужно внести изменения в ранее созданный файл с `configureStore()`:

```tsx
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';

import { counterReducer } from '@/features/counter';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: { counter: CounterState }
export type AppDispatch = typeof store.dispatch;
```

`configureStore()` это функция-wrapper для `createStore()` из пакета `redux`, которая использует упрощенную конфигурацию и принимает в качестве аргумента Root Reducer или ReducersMapObject:

- **Root Reducer** - Это комбинация из нескольких функций-редюсеров созданная при помощи `combineReducers()`
- **ReducersMapObject** - Это объект, значения которого соответствуют различным функциям-редюсерам, так называемые слайс-редюсеры (slice reducers).

Пример с двумя слайсами в виде ReducersMapObject:

```js
/* JavaScript */

// srs/store/index.js
import { configureStore } from '@reduxjs/toolkit';

import entity1Reducer from './entity1-slice';
import entity2Reducer from './entity2-slice';

export const store = configureStore({
  reducer: {
    entity1: entity1Reducer,
    entity2: entity2Reducer,
  },
});
```

Тот же пример с `combineReducers()`:

```js
/* JavaScript */

// srs/store/root-reducer.js
import { combineReducers } from '@reduxjs/toolkit';

import entity1Reducer from '@/features/entity1/entity1-slice';
import entity2Reducer from '@/features/entity2/entity2-slice';

export const rootReducer = combineReducers({
  // Define a top-level state field named `entity1`, handled by `entity1Reducer`
  entity1: entity1Reducer,
  entity2: entity1Reducer,
});
```

```js
/* JavaScript */

// srs/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './root-reducer';

export const store = configureStore({
  reducer: rootReducer,
});
```

В данном примере каждый слайс находятся в отдельном модуле и собираются в Root Reducer, который затем добавляется в `configureStore()`.

Полный список параметров для функции `configureStore()`, обязательный из них только `reducer`:

- **reducer** - Одиночная функция-редюсер, которая используется как Root Reducer или объект состоящий из
  слайс-редюсеров (
  slice reducers)
- **middleware** - Некоторый массив Redux middleware (промежуточное ПО, связующее программное
  обеспечение, посредник), по умолчанию включает уже некоторые middleware,
  например [redux-thunk](https://github.com/reduxjs/redux-thunk) для работы с асинхронными действиями.
- **devTools** - Включить ли интеграцию с Redux DevTools. По умолчанию включено.
- **preloadedState** - Начальное состояние, аналогичное начальному состоянию `createStore()`. Это можно использовать для гидратации состояния, полученного от сервера в универсальных приложениях, или для восстановления ранее сериализованной сессии пользователя.
- **enhancers** - Усилители, предоставляют возможность добавлять дополнительную функциональность к Redux Store. Это могут быть сторонние расширения, которые модифицируют поведение Redux Store.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Использование Redux Store в компонентах

Теперь вы можете использовать состояние из `store` и действия (actions) внутри своих компонентов, для этого воспользуйтесь хуками из пакета `react-redux`:

- **useSelector()** - Для чтения данных из Redux Store;
- **useDispatch()** - Для отправки действий в Redux Store

Хук `useSelector()` принимает в качестве аргумента колбэк-функцию, и возвращает значение вычисленное на основе текущего состояния Redux Store, каждый раз когда меняется состояние Redux Store меняется, хук возвращает новое значение тем самым вызывая повторный рендеринг.

В случае использования TypeScript требует типизации.

Пример с использованием `useSelector()`:

```ts
import { useSelector } from 'react-redux';

const todos = useSelector((state) => state.todos);
```

`RootState` это тип `store` полученного через `ReturnType<typeof store.getState>`

Хук `useDispatch()` ничего не принимает в качестве параметров, возвращает функцию `store.dispatch` из объекта `store`, который и является глобальным состоянием приложения именуемым Redux Store.

То есть вызов:

```js
import { useDispatch } from 'react-redux';
//...
const dispatch = useDispatch();
//...
const handleSomeAction = () => {
  dispatch(someAction());
};
```

Будет эквивалентом для:

```js
import { store } from '@/store';
//...
const handleSomeAction = () => {
  store.dispatch(someAction());
};
```

Правильнее использовать вариант с хуком `useDispatch()`, так как это уровень абстракции который позволяет не зависеть от деталей связанных с объектом `store`, это то что принято назвать "best practices" и рекомендовано к использованию самими разработчиками Redux.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Типизация useSelector и useDispatch

Для того что каждый раз не передавать типы при вызове хуков (данные хуки являются дженериками), достаточно создать свои хуки-обертки над `useSelector()` и `useDispatch()`:

```ts
// src/store/hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

`RootState` и `AppDispatch` берется из файла `src/store/store.ts` где вызывается функция `configureStore()` и создается объект `store` (Redux Store).

Фрагмент кода c определением типов для Redux Store и dispatch:

```ts
// src/store/store.ts
//...
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Получение значения из Redux Store

Что бы получить значение нашего счетчика нужно вызвать хук  `useAppSelector()` следующим образом:

```ts
const counter = useAppSelector((state) => state.counter.value);
```

Здесь мы передаем колбэк-функцию с некоторой логикой извлечения требуемого значения из текущего состояния.

Данный способ не совсем удачный, так как логика может быть достаточно сложной, например выборка может быть на основе каких то критериев, соответственно кода будет больше, тестирование в рамках компонента где будет размещаться данный селектор усложнится.

В качестве решения можно предложить вынести логику селектора в отдельный модуль или в слайс `counter-slice` вот таким образом:

```ts
export const selectCount = (state: RootState) => state.counter.value;
```

Теперь это отдельная функция селектор, и полный листинг чтения данных в компоненте `<CounterResult>` c использованием `useAppSelector()` будет выглядеть следующим образом:

```tsx
// src/features/counter/components/counter-result/counter-result.tsx
//...
export const CounterResult = (): JSX.Element => {
  const count = useAppSelector(selectCount);

  return <div>{count}</div>;
};
```

Поимо обычного использования хука `useSelector()`, существует утилита `createSelector` из библиотеки [Reselect](https://github.com/reduxjs/reselect).

Reselect позволяет кешировать результаты выборок данных, что позволяет уменьшить количество вычислений при изменении состояния. Это особенно полезно, когда вы делаете сложные вычисления или фильтрацию данных. 
Выборки будут пересчитываться только в случае изменения зависимых данных, что снижает нагрузку на приложение.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Отправка действий в Redux Store

Для отправки действий используется хук `useAppDispatch()` который возвращает функцию `dispatch()`, 
в функцию `dispatch()` передается action-creator сгенерированный при создании слайса:

```tsx
// src/features/counter/components/counter-form/counter-form.tsx
//...
import { decrement, increment } from '../../stores/counter-slice';

export const CounterForm = (): JSX.Element => {
  const dispatch = useAppDispatch();

  const handleDecrement = () => {
    dispatch(decrement());
  };

  const handleIncrement = () => {
    dispatch(increment());
  };

  return (
    <div className={styles.controls}>
      <Button onCLick={handleDecrement}>Decrement</Button>
      <Button onCLick={handleIncrement}>Increment</Button>
    </div>
  );
};
```

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Выполнение асинхронных действий

Для работы с асинхронными сценариями, существует несколько решений в виде отдельных библиотек, которые используются как Middleware в Redux.

Middleware в Redux - это слой кода, который располагается между Redux dispatcher и функцииями-редюсерами (reducers).
Он позволяет перехватывать и обрабатывать действия (actions), отправляемые через dispatcher, до того, как они достигнут редюсеров.
Middleware может выполнять дополнительные действия, такие как протоколирование, отправка асинхронных запросов или изменение данных, прежде чем действие доходит до редюсера.

Вот список наиболее популярных библиотек для работы с асинхронными сценариями:

- **Redux Thunk** - это middleware для Redux, который позволяет вам создавать асинхронные действия с использованием функций. Он достаточно популярен и может быть легко интегрирован с Redux Toolkit.
- **Redux Saga** - это библиотека для управления побочными эффектами в Redux-приложениях. Он позволяет вам описывать логику асинхронных операций в виде генераторов JavaScript. Redux Saga также может использоваться вместе с Redux Toolkit.
- **Redux Observable** - это библиотека, основанная на реактивном программировании с использованием RxJS. Она позволяет вам управлять асинхронными операциями в Redux, используя потоки событий. Redux Observable также может быть интегрирован с Redux Toolkit.
- **RTK Query** - это часть Redux Toolkit, предназначенная для управления данными из асинхронных источников, таких как API. Она предоставляет удобные средства для выполнения HTTP-запросов и автоматического обновления данных в хранилище Redux.

Помимо RTK Query, по умолчанию с RTK устанавливается Middleware `redux-thunk`, в дополнение к этому, RTK имеет встроенный API метод `createAsyncThunk()` для создания асинхронных thunk-функций, которые автоматически обрабатывают запросы на начало, успешное завершение или ошибки асинхронной операции.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Создание асинхронных действий с помощью createAsyncThunk

При создании асинхронного thunk действия с помощью `createAsyncThunk()`, RTK автоматически генерирует имена дополнительных действий (type) и самих генераторов действий к ним:

- **pending** - Запрос начат;
- **fulfilled** - Успешное завершение операции;
- **rejected** - Ошибка операции;

Эти дополнительные действия могут быть использованы для обновления состояния приложения, отображения состояния загрузки или отображения сообщений об ошибках.

`createAsyncThunk()` принимает два обязательных параметра (третий options - не обязательный):

- **type** - Тип действия, строка в нотации `domain/actionInCamelCase`;
- **payloadCreator** - Это функция, которая выполняет асинхронную операцию, она должна возвращать промис, который будет разрешен или отклонен в зависимости от успешности или не успешности операции.

Предположим у нас есть некое API для выполнение запросов на backend-сервер, и в нем есть метод, который получает некое значение `amount`, которое мы будет прибавлять к нашему счетчику:

```ts
// src/features/counter/api/counter-api.ts
const delay = (ms: number) => new Promise((_) => setTimeout(_, ms));

export const counterApi = {
  getAmount: async () => {
    await delay(10);

    return {
      data: Math.round(Math.random() * 100),
    };
  },
};
```

Теперь мы можем создать асинхронное действие (Async action) с использованием `createAsyncThunk()`:

```ts
export const incrementByAmount = createAsyncThunk('counter/incrementByAmount', async () => {
  const response = await counterApi.getAmount();

  return response.data;
});

```

`createAsyncThunk()` возвращает _Redux thunk action creator_ (AsyncThunk), это thunk-функция которая, будет содержать три простых генератора действий для `pending`, `fulfilled` и `rejected` с логикой для обработки этих состояний.

Для того что бы добавить thunk-функцю `incrementByAmount()` в слайс, нудно использовать параметр **extraReducers** функции `createSlice()`.

В случае с TypeScript рекомендуемым способом является метод с использованием **Builder Callback** нотации, подробная документация на [официальной странице RTK](https://redux-toolkit.js.org/api/createReducer#usage-with-the-builder-callback-notation).

Функция "builderCallback" `(builder: Builder) => void` - это обратный вызов (callback), который принимает объект `builder` для определения редьюсеров (reducers) для обработки различных действий (actions). 
С помощью этой функции можно добавить редьюсеры для конкретных действий, используя метод:

* **builder.addCase(actionCreatorOrType, reducer)**

В данном контексте:

* **builder** - Это объект, предоставляющий методы для создания редьюсеров, Метод `builder.addCase` используется для определения редьюсеров, которые будут обрабатывать различные действия (actions) в приложении;
* **actionCreatorOrType** - Это действие (action) или его тип (type), для которого мы хотим определить редьюсер;
* **reducer** - Функция, которая будет выполняться при вызове указанного действия и изменять состояние приложения соответствующим образом;

Добавление редюсера для для `incrementByAmount()` в `extraReducers` функции `createSlice()`:

```ts
// src/features/todos/stores/todos-slice.ts
//...
export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  //...
  extraReducers: (builder) => {
    builder.addCase(incrementByAmount.fulfilled, (state, { payload }) => {
      state.value += payload;
    });
  },
});
//...
```

Теперь можно добавить вызов `disptach(incrementByAmount())` в компонент `<CounterForm>`:

```tsx
// src/features/counter/components/counter-form/counter-form.tsx
//...
import { useAppDispatch } from '@/store';
import { decrement, increment, incrementByAmount } from '../../stores/counter-slice';

export const CounterForm = (): JSX.Element => {
  const dispatch = useAppDispatch();
  //...
  const handleIncrementByAmount = () => {
    void dispatch(incrementByAmount());
  };
  //...

  return (
    <div className={styles.controls}>
      <Button onCLick={handleDecrement}>Decrement</Button>
      <Button onCLick={handleIncrementByAmount}>Increment By Random</Button>
      <Button onCLick={handleIncrement}>Increment</Button>
    </div>
  );
};

```

Это упрощенный пример демонстрирующий использование асинхронной логики с Redux Toolkit.

Готовый пример с приложением находится в директории `src` раздела `redux-tollkit-quick`.

Для запуска примера с готовым приложением выполните команды:

```shell
git clone https://github.com/shopot/react-101.git

git checkout redux-toolkit-quick

npm install

npm run dev
```

⬆ [Back to Top](#знакомство-с-redux-toolkit)

Документация по теме:

- 🔗 [Redux Toolkit](https://redux-toolkit.js.org/introduction/getting-started)
- 🔗 [Redux Toolkit API: createSlice](https://redux-toolkit.js.org/api/createSlice)
- 🔗 [Redux Toolkit API: createAsyncThunk](https://redux-toolkit.js.org/api/createAsyncThunk)
- 🔗 [Redux Toolkit API:createReducer](https://redux-toolkit.js.org/api/createReducer)
- 🔗 [Usage With TypeScript](https://redux-toolkit.js.org/usage/usage-with-typescript)
- 🔗 [How to Use Redux and Redux Toolkit – Tutorial for Beginners](https://www.freecodecamp.org/news/redux-and-redux-toolkit-for-beginners/)

⬆ [Back to Top](#знакомство-с-redux-toolkit)
