
# Знакомство с Redux Toolkit

Еще пока черновик...

📚 Содержание

- [Redux Toolkit на примере приложения Todo](#redux-toolkit-на-примере-приложения-todo)
  - [Термины и соглашения](#термины-и-соглашения)
  - [Установка Redux Toolkit](#установка-redux-toolkit)
  - [Подготовка файла для Redux Store](#подготовка-файла-для-redux-store)
  - [Установка связи между Redux Store и приложением React](#установка-связи-между-redux-store-и-приложением-react)
  - [Создание слайс-редюсера (slice reducer)](#создание-слайс-редюсера-slice-reducer)
  - [Добавление редюсера в `store`](#добавление-редюсера-в-store)
  - [Использование Redux Store в компонентах](#использование-redux-store-в-компонентах)
  - [Типизация useSelector и useDispatch](#типизация-useselector-и-usedispatch)
  - [Чтение списка Todo](#чтение-списка-todo)
  - [Добавление нового Todo](#добавление-нового-todo)
- [Пример приложения Todo](#пример-приложения-todo)

> Redux Toolkit (RTK) - Официальный набор инструментов для эффективной разработки Redux.

**Redux Toolkit** (далее просто **RTK**) упрощает разработку приложений, использующих Redux, делая код более читаемым и
поддерживаемым, а также уменьшая количество шаблонного кода, это более современный и удобный подход к управлению
состоянием, который рекомендуется для большинства проектов на базе Redux.

**RTK** подходит как для новых пользователей Redux, настраивающих свой первый проект, так и для опытных разработчиков,
которые хотят упростить существующее приложение.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

## Термины и соглашения

**Redux** - Это контейнер с предсказуемым состоянием для приложений JavaScript, библиотека, npm пакет `redux`.

**React Redux** - Это официальная библиотека для связывания Redux с React (React UI bindings layer ), npm пакет `react-redux`.

**Redux Toolkit (RTK)** - Это библиотека предназначенная для упрощения написания логики Redux, npm пакет `@reduxjs/toolkit`.

**Redux Thunk** - Thunk middleware для Redux. Он позволяет писать функции с логикой внутри, которые могут взаимодействовать с методами Redux `dispatch()` и `getState()`.

**Immer** - Это небольшая библиотека, позволяющая более удобно работать с неизменяемым (immutable) состоянием.

**Reselect** - Библиотека для создания меморизированных функций-селекторов (selector).  Обычно используется с Redux, но также может использоваться с любыми простыми неизменяемыми данными JS.

**Redux Store** - Глобальный стейт (state) приложения созданный с использованием библиотеки Redux или RTK

**store** - Это объект созданный при помощи `configureStore()`, он же Redux Store. 

**Action Creator** - Генераторы действий, это функции, которые создают действия (экшены).

**Cлайс (Slice)** - Это объект который описывает логику работы функций-редюсеров, на основе этого объекта будут сгенерированы обычные редьюсеры и действия, которые затем передаются в Redux, другими словами это часть Redux Store.  

**Cлайс-редюсер (slice reducer)** - Это функция которая описывает логику для обработки отдельного действия (action) внутри конкретного слайса.

**Root Reducer** - Это функция, которая объединяет все редюсеры (reducers) в приложении Redux в один главный редюсер, создается с использованием `combineReducers()`.

**ReducersMapObject** - Это объект в Redux, который используется для определения набора редьюсеров (reducers) в приложении.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

## Redux Toolkit на примере приложения Todo

Примеры будут взяты из проекта к этому разделу, написаны на TypeScript, там где будет использоваться JavaScript, это
будет указано.

### Установка Redux Toolkit

Для того что бы использовать Redux Toolkit установите пакет `@reduxjs/toolkit`.
Для того что бы React компоненты могли взаимодействовать с `Redux Store` требуется дополнительно
установить `react-redux`.

```shell
npm install @reduxjs/toolkit react-redux
```

Устанавливать библиотеку `redux` больше не требуется, она и еще ряд библиотек (`immer`, `redux-thunk`, `reselect`)
устанавливаются автоматически в качестве зависимостей вместе с установкой `@reduxjs/toolkit`.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Подготовка файла для Redux Store

Следующим шагом нужно создать файл, из которого будет экспортироваться объект `store` созданный при
помощи `configureStore()`.

В качестве конфигурации на старте будем использовать объект с одним параметром и пустой
функцией редюсер `todos`, позже мы еще вернемся к этому файлу для завершения настройки `store`.

```tsx
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  // Reducers Map Object
  reducer: {
    todos: () => {},
  },
});
```

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Установка связи между Redux Store и приложением React

Для передачи Redux Store в приложение React используется специальный компонент `<Provider>` из пакета `react-redux`.
Компонент `<Provider>` оборачивает весь корневой компонент приложения и предоставляет Redux Store всем компонентам
внутри него.

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import App from '@/app/app';
import { store } from '@/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
```

В дальнейшем каждый компонент, который нуждается в доступе к глобальному состоянию, может использовать хуки из
пакета `react-redux` для подключения к Redux Store и получения требуемых данных или выполнения действий над данными.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Создание слайс-редюсера (slice reducer)

При традиционном подходе в Redux (библиотека `redux`) требовалось создать функцию-редюсер с реализацией логики
обновления состояния на базе инструкций switch-case, отвечающую за обработку всех отправляемых действий и расчет того,
каким должен быть весь результат нового состояния (иммутабельный store - вы можете только создавать новую копию данных,
а не менять старое состояние store).

Помимо функции-редюсера требовалось создавать константы для действий (CONSTANTS) и сами действия (actions), а так же
генераторы действий (action-creator), если store состоял из нескольких частей (slices) то для каждой части нужно было
писать свою функцию-редюсер со всем необходимым кодом (шаблонный код).

> Несколько функцций-редюсеров объединяются в один Root Reducer при помощи
> функции [combineReducers()](https://redux.js.org/api/combinereducers) - эта функция так же доступна для импорта
> из `@reduxjs/toolkit` и используется для объединения слайсов.

Redux Toolkit предоставляет более упрощенный подход для создания редюсеров, вместо обычного редюсера RTK позволяет
создать объект Slice при помощи функции `createSlice()`, который будет содержать следующие свойства и методы:

- **name** - Имя слайса (slice);
- **reducer** - Функция редюсер этого слайса для добавления в Redux Store (`store`) на этапе конфигурирования
  через `configureStore()`;
- **actions** - Генераторы действий (action-creator) для типов действий (которые создаются автоматически),
  обрабатываемых
  редюсерами этого слайса.
- **caseReducers** - Отдельные функции редюсеры, которые были переданы как аргумент при вызове `createSlice()` для
  повторного использования и тестирования.
- **getInitialState()** - Метод который возвращает начальное состояние переданное как аргумент при
  вызове `createSlice()`;

Функция `createSlice()` принимает четыре параметра:

- **name** - Имя будущего слайса, которое будет задействовано в действиях (actions) с использованием
  нотации `domain/action`, в том числе и для Redux DevTools;
- **initialState** - Начальное состояние для соответствующих редюсеров (их несколько);
- **reducers** - Объект содержащий функции редюсеры. На основе имени функции-редюсера будет автоматически создаваться
  генератор действия и тип действия;
- **extraReducers** - Необязательный параметр в виде объекта, который используется для добавления дополнительных функций
  редьюсеров, обычно используется для реализации асинхронных действий (async actions);

В отличие от функции-редюсера при использовании пакета `redux`, функция `createSlice()` использует отдельные функции в
качестве функций-редюсеров без switch-case реализации, то есть это отдельные функции которые позволяют писать
логику на основе мутабельного механизма (mutating). Однако на самом деле они не изменяют состояние, поскольку
используют "под капотом" библиотеку `immer`, которая определяет изменения и создает совершенно новое "immutable"
состояние на основе этих изменений.

Функция-редюсер для `createSlice()` выглядит следующим образом:

```js
function addNewTodo(state, action) {
  state.todos.push({
    id: uuidv4(),
    title: action.payload,
    completed: false,
  });
}
```

Как видно из примера, функция получает текущее состояние (`state`) слайса и объект `action` в котором есть свойство
`payload`. Свойство `payload` будет содержать любые данные переданные в качестве аргументов в генератор действия (
action-creator). Генераторы действий автоматически создаются функцией `createSlice()` с именами соответствующими
функциям-редюсерам, например для примера выше будет создан генератор действия с названием `addNewTodo`:

```jsx
dispatch(addNewTodo('Create a new todo from this action.'));
```

Переданный аргумент в виде строки автоматически будет передаваться как `action.payload` для соответствующей
функции-редюсера;

Создайте файл `src/store/todos-slice.ts` с начальным состоянием в виде пустого массива объектов Todo `{ todos: [] }` и
тремя функциями-редюсерами:

```tsx
// src/store/todos-slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

export type TodosState = {
  todos: Todo[];
};

const initialState: TodosState = {
  todos: [],
};

export const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addNewTodo: (state, action: PayloadAction<string>) => {
      state.todos.push({
        id: uuidv4(),
        title: action.payload,
        completed: false,
      });
    },

    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(({ id }) => id !== action.payload);
    },

    toggleTodoCompleted: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.map((todo) => {
        if (todo.id === action.payload) {
          return {
            ...todo,
            completed: !todo.completed,
          };
        }
        return todo;
      });
    },
  },
});

export const { addNewTodo, removeTodo, toggleTodoCompleted } = todosSlice.actions;

export default todosSlice.reducer;
```

Здесь функция `createSlice()` возвращает объект типа `Slice` из которого экспортируются `actions` и `reducer` которые
создаются автоматически.

Обратите внимание, что в самих функциях-редюсерах идет прямое изменение переменной состояния `state`и сами функции
ничего не возвращают в отличии от классического подхода с использованием редюсеров, где логика в редюсерах была
иммутабельной.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Добавление редюсера в `store`

Теперь нужно внести изменения в ранее созданный файл с `configureStore()`:

```tsx
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';

import todosReducer from './todos-slice';

export const store = configureStore({
  reducer: todosReducer,
  devTools: true, // Defaults to true.
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
```

`configureStore()` это функция-wrapper для `createStore()` из пакета `redux`, которая использует упрощенную конфигурацию
и принимает в качестве аргумента Root Reducer или ReducersMapObject:

- **Root Reducer** - Это комбинация из нескольких функций-редюсеров созданная при помощи `combineReducers()`
- **ReducersMapObject** - Это объект, значения которого соответствуют различным функциям-редюсерам, так называемые
  слайс-редюсеры (slice reducers).

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

В данном примере слайсы находятся в раздельных директориях и собираются в Root Reducer, который затем добавляется в
`configureStore()`.

Полный список параметров для функции `configureStore()`, обязательный из них только `reducer`:

- **reducer** - Одиночная функция-редюсер, которая используется как Root Reducer или объект состоящий из
  слайс-редюсеров (
  slice reducers)
- **middleware** - Некоторый массив Redux middleware (промежуточное ПО, связующее программное
  обеспечение, посредник), по умолчанию включает уже некоторые middleware,
  например [redux-thunk](https://github.com/reduxjs/redux-thunk) для работы с асинхронными действиями.
- **devTools** - Включить ли интеграцию с Redux DevTools. По умолчанию включено.
- **preloadedState** - Начальное состояние, аналогичное начальному состоянию `createStore()`. Это можно использовать для
  гидратации состояния, полученного от сервера в универсальных приложениях, или для восстановления ранее сериализованной
  сессии пользователя.
- **enhancers** - Усилители, предоставляют возможность добавлять дополнительную функциональность к Redux Store. Это
  могут
  быть сторонние расширения, которые модифицируют поведение Redux Store.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Использование Redux Store в компонентах

Теперь вы можете использовать состояние из `store` и действия (actions) внутри своих компонентов, для этого
воспользуйтесь хуками из пакета `react-redux`:

- **useSelector()** - Для чтения данных из Redux Store;
- **useDispatch()** - Для отправки действий в Redux Store

Хук `useSelector()` принимает в качестве аргумента колбэк-функцию, и возвращает значение вычисленное на основе текущего
состояния Redux Store, каждый раз когда меняется состояние Redux Store меняется, хук возвращает новое значение тем самым
вызывая повторный рендеринг.

В случае использования TypeScript требует типизации.

Пример с использованием `useSelector()`:

```ts
import { useSelector } from 'react-redux';

const todos = useSelector((state) => state.todos);
```

`RootState` это тип `store` полученного через `ReturnType<typeof store.getState>`

Хук `useDispatch()` ничего не принимает в качестве параметров, возвращает функцию `store.dispatch` из объекта `store`,
который и является глобальным состоянием приложения именуемым Redux Store.

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

Правильнее использовать вариант с хуком `useDispatch()`, так как это уровень абстракции который позволяет не зависеть от
деталей связанных с объектом `store`, это то что принято назвать "best practices" и рекомендовано к использованию самими
разработчиками Redux.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Типизация useSelector и useDispatch

Для того что каждый раз не передавать типы при вызове хуков (данные хуки являются дженериками), достаточно создать свои
хуки-обертки над `useSelector()` и `useDispatch()`:

```ts
// src/store/hooks.ts
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';

import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

`RootState` и `AppDispatch` берется из файла `src/store/store.ts` где вызывается функция `configureStore()` и создается
объект `store` (Redux Store).

Фрагмент кода c определением типов для Redux Store и dispatch:

```ts
// src/store/store.ts
//...
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
```

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Чтение списка Todo

В базовом варианте вызов `useAppSelector()` будет выглядеть следующим образом:

```ts
const todos = useAppSelector((state) => state.todos);
```

Здесь мы передаем колбэк-функцию с некоторой логикой извлечения требуемого значения из текущего состояния.

Данный способ не совсем удачный, так как логика может быть достаточно сложной, например выборка может быть на основе
каких то критериев, соответственно кода будет больше, тестирование в рамках компонента где будет размещаться данный
селектор усложнится.

В качестве решения можно предложить вынести логику селектора в отдельный модуль или в слайс `todos-slice` вот таким
образом:

```ts
export const selectTodos = (state: TodosState) => state.todos;
```

Теперь это отдельная функция селектор, и полный листинг чтения данных в компоненте `<TodoList>` c
использованием `useAppSelector()` будет выглядеть следующим образом:

```tsx
// src/components/todo-list/todo-list.tsx
import { JSX } from 'react';

import styles from './todo-list.module.css';

import { TodoItem } from '../todo-item';
import { useAppSelector } from '@/store';
import { selectTodos } from '@/store/todos-slice';

export const TodoList = (): JSX.Element => {
  const todos = useAppSelector(selectTodos);

  const todoList = todos.map((todo) => <TodoItem key={todo.id} todo={todo} />);

  return <div className={styles.todoList}>{todoList}</div>;
};
```

Поимо обычного использования хука `useSelector()`, существует утилита `createSelector` из
библиотеки [Reselect](https://github.com/reduxjs/reselect).

Reselect позволяет кешировать результаты выборок данных, что позволяет уменьшить количество вычислений при изменении
состояния. Это особенно полезно, когда вы делаете сложные вычисления или фильтрацию данных. Выборки будут
пересчитываться только в случае изменения зависимых данных, что снижает нагрузку на приложение.

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Добавление нового Todo

Добавление нового Todo в список используйте хук `useAppDispatch()` и действие (action) `addNewTodo`.

```tsx
// src/components/add-todo-form/add-todo-form.tsx
import { JSX, useState } from 'react';

import { addNewTodo } from '@/store/todos-slice';
import { useAppDispatch } from '@/store';

export const AddTodoForm = (): JSX.Element => {
  const [title, setTitle] = useState('');
  const dispatch = useAppDispatch();

  const handleClick = (): void => {
    if (title) {
      dispatch(addNewTodo(title));

      setTitle('');
    }
  };

  return (
    <form>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button type="button" onCLick={handleClick}>
        Add new
      </button>
    </form>
  );
};
```

⬆ [Back to Top](#знакомство-с-redux-toolkit)

### Использование асинхронных действий

...coming soon

⬆ [Back to Top](#знакомство-с-redux-toolkit)

## Пример приложения Todo

Готовый пример с приложением находится в src раздела `chapter-22`.

Для запуска примера с готовым приложением выполните команды:

```shell
git clone https://github.com/shopot/react-101.git

git checkout chapter-22

npm install

npm run dev
```

⬆ [Back to Top](#знакомство-с-redux-toolkit)

Документация по теме:

⬆ [Back to Top](#знакомство-с-redux-toolkit)
