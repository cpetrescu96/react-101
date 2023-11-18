# Знакомство с RTK Query

📚 Содержание

* [Термины и соглашения](#термины-и-соглашения)
* [Установка RTK Query](#установка-rtk-query)
* [Из чего состоит RTK Query](#из-чего-состоит-rtk-query)
* [Создание API Slice](#создание-api-slice)
* [RTK Query на примере приложения Todo](#rtk-query-на-примере-приложения-todo)
  * [JSON-Server для Todo REST API](#json-server-для-todo-rest-api)
  * [Определение маршрутов для запросов](#определение-маршрутов-для-запросов)
  * [Создание Query endpoint'а - getTodos](#создание-query-endpointа---gettodos)
  * [Настройка Query responses с помощью TransformResponse](#настройка-query-responses-с-помощью-transformresponse)
  * [Создание Mutation endpoint'а - addTodo](#создание-mutation-endpointа---addtodo)
  * [Создание Mutation endpoint'а - deleteTodo](#создание-mutation-endpointа---deletetodo-)
  * [Создание Mutation endpoint'а - toggleTodoCompleted](#создание-mutation-endpointа---toggletodocompleted)
  * [Экспорт хуков из API Slice](#экспорт-хуков-из-api-slice)
  * [Добавление API Slice в Redux Store](#добавление-api-slice-в-redux-store-)
  * [Обзор API Slices: React Hooks](#обзор-api-slices-react-hooks)
  * [Чтение данных - useGetTodosQuery](#чтение-данных---usegettodosquery)
  * [Изменение данных useDeleteTodoMutation и useToggleTodoCompletedMutation](#изменение-данных-usedeletetodomutation-и-usetoggletodocompletedmutation)
  * [Добавление данных useAddTodoMutation](#добавление-данных-useaddtodomutation)

**RTK Query** - это библиотека в составе Redux Toolkit, предназначенная для упрощения работы с сетевыми запросами в Redux-приложениях. Она предоставляет удобный и декларативный способ определения взаимодействия с API, автоматически генерируя actions, reducers и хуки для работы с данными.

## Термины и соглашения

- **Redux** - Это контейнер с предсказуемым состоянием для приложений JavaScript, библиотека, npm пакет `redux`;
- **React Redux** - Это официальная библиотека для связывания Redux с React (React UI bindings layer ), npm пакет `react-redux`, предоставляет компонент `<Provider />`;
- **Redux Toolkit (RTK)** - Это библиотека предназначенная для упрощения написания логики Redux, npm пакет `@reduxjs/toolkit`;
- **RTK Query (Redux Toolkit Query)** - инструмент запросов (data fetching) и кэширования данных. Он предназначен для упрощения загрузки данных в веб-приложение, без необходимости самостоятельно писать логику выборки и кэширования данных;
- **Redux Store** - Глобальный стейт (state) приложения созданный с использованием библиотеки Redux или RTK;
- **store** - Это объект созданный при помощи `configureStore()`, он же Redux Store;
- **Action Creator** - Генераторы действий, это функции, которые создают действия (экшены);
- **Thunk-функции** - это функции, которые используются для асинхронных операций и взаимодействия с Redux Store, они позволяют создавать действия (actions) и выполнять их асинхронно;
- **Endpoint** - это адрес, по которому отправляется запрос отдельным HTTP(S) методом для получения данных;
- **API Slice (API service "slice")** - Это объект, созданный при помощи `createApi()`, который содержит логику для работы с запросами на основе **endpoints**, включает себя функцию-редюсер для управления кэшированными данными, **middleware** для управления временем жизни кэша и подписками, а также селекторы и thunk-функции с асинхронной логикой для каждого **endpoint**;
- **Объект API** - синоним для **API Slice (API service "slice")**
- **API Slice Utilities** - Это свойство `util` объекта **API Slice**, которое включает в себя различные служебные функции, которые можно использовать для управления кешем, включая ручное обновление данных кеша запросов, запуск предварительной выборки данных, ручное аннулирование тегов и ручной сброс состояния API, а также другие служебные функции, которые можно используется в различных сценариях, включая SSR;
- **Provider (Провайдер)** - Это компонент, в который оборачивают корневой компонент приложения, и который предоставляет доступ к  Redux Store всем компонентам внутри него;
- **ApiProvider** - Это компонент, в который оборачивают корневой компонент приложения для доступа к **API Slice**, используется вместо `<Provider />`;
- **Query endpoint** - Это объект, который содержат информацию о URL-адресе, методе запроса, и других параметрах, необходимых для выполнения запроса для получения данных (GET) с сервера;
- **Mutation endpoint** - Это объект, который содержит информацию о URL-адресе, методе запроса, и других параметрах, необходимых для выполнения запроса для изменения данных (POST, UPDATE, PATCH, DELETE) на сервере;

⬆ [Back to Top](#знакомство-с-rtk-query)

## Установка RTK Query

**RTK Query** - это дополнительное дополнение (addon), включенное в пакет Redux Toolkit, и его функциональность построена поверх других API в Redux Toolkit.

Устанавливать RTK Query отдельно не требуется, вы должны установить `@reduxjs/toolkit`, который включает в себя RTK Query:

```shell
npm install @reduxjs/toolkit
```

⬆ [Back to Top](#знакомство-с-rtk-query)

## Из чего состоит RTK Query

RTK Query включает в себя следующие API:

- **createApi()** - Фундаментальная функция RTK Query, позволяющая определить набор "endpoint'ов", которые описывают, как получать данные с бэкенд-API и из других асинхронных источников, включая настройки для получения и преобразования данных. В большинстве случаев, рекомендуется использовать эту функцию один раз для всего приложения, придерживаясь принципа "один API slice для каждого базового URL";
- **fetchBaseQuery()** - Это небольшая обертка вокруг fetch, которая упрощает отправку запросов. Рекомендуется использовать в качестве `baseQuery()` в функции `createApi()`;
- **ApiProvider** - Это компонент, который может использоваться вместо `<Provider />` в качестве провайдера, если у вас еще нет Redux Store и вы не предполагаете использовать `<Provider />` из `react-redux`;
- **setupListeners()** - Утилита, позволяющая включить поведение `refetchOnMount` и `refetchOnReconnect`, эти параметры позволяют контролировать поведение повторного запроса (refetching) при монтировании компонента или переподключении к интернету:
  - **refetchOnMount** - Этот параметр указывает, должен ли выполниться повторный запрос при монтировании компонента, который использует данный запрос или подписку. Если refetchOnMount установлен в true, то запрос будет автоматически повторен при монтировании компонента, что позволяет получить актуальные данные с сервера. Если установлен в false, то повторный запрос не будет выполнен при монтировании.
  - **refetchOnReconnect** - Этот параметр определяет, должен ли выполниться повторный запрос при переподключении к интернету (после потери связи). Если refetchOnReconnect установлен в true, то запрос будет автоматически повторен при восстановлении связи, что помогает обновить данные после отсутствия соединения. Если установлен в false, то повторный запрос не будет выполнен после переподключения.

## Создание API Slice

API Slice создается вызовом функции `createApi()`. 

Функция `createApi()` принимает объект с различными параметрами для настройки и определения вашего API Slice. Некоторые из наиболее распространенных параметров включают:

- **baseQuery()** - Обязательный параметр функция, определяющая, как выполнять запросы. По умолчанию используется `fetchBaseQuery()`, которая идет в составе RTK Query. Может быть настроена для использования различных HTTP-клиентов, таких как `axios` или `fetch`;
- **tagTypes** - Это объявление массива пользовательских тегов в для запросов, мутаций и подписок API Slice. Теги являются строковыми значениями, которые присваиваются запросам, мутациям и подпискам для их идентификации и управления;
- **reducerPath** - Это уникальный ключ, к которому будет подключен ваш API service "slice" в вашем `store`. Если вы вызываете `createApi()` несколько раз, то вам нужно будет каждый раз указывать уникальное значение для каждого вызова `cerateApi()`. По умолчанию если не указано то имеет значение "api";
- **endpoints** - Обязательный параметр, определяющий списком ваших endpoint запросов, мутаций и подписок.

`createApi()` возвращает объект, который представляет ваш экземпляр RTK Query API в виде API service "slice". Этот объект содержит множество полезных методов и свойств, таких как endpoints, useBaseQuery, useQuery, useMutation, useSubscription и другие, которые позволяют вам взаимодействовать с вашими endpoint'ами и выполнять запросы, мутации и подписки.

Кроме того, объект RTK Query API также содержит встроенный редюсер, который автоматически управляет обновлением состояния вашего кэша данных и обрабатывает запросы, мутации и подписки.

Общая сигнатура функции `createApi()` выглядит следующим образом:

```js
const yourApi = createApi({
  reducerPath: 'yourApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://example.com/api/v1/' }),
  endpoints: (builder) => ({
    // Определения запросов, мутаций и подписок
  }),
});
```

Настройка endpoints, подключение к Redux Store и использование RTK Query API будет рассмотрено дальше на примере приложения Todo.  

⬆ [Back to Top](#знакомство-с-rtk-query)

## RTK Query на примере приложения Todo

Это всего лишь базовый пример где будет рассмотрен основной функционал RTK Query, полную информацию по возможностям RTK Query вы можете найти в [официальной документации](https://redux-toolkit.js.org/rtk-query/overview).   

### JSON-Server для Todo REST API

Для работы на стороне бэкенда мы будем использовать инструмент JSON-Server, используемый для создания фейкового RESTful API (API, который эмулирует поведение настоящего API) на основе файла JSON. 

JSON-Server предоставляет локальный сервер, который работает с данными в формате JSON и позволяет выполнять операции чтения, записи, изменения и удаления данных (CRUD), как это происходило бы с настоящим API.

В корне проекта текущей ветки есть директория `./backend`, которая содержит полностью настроенный и готовый к использованию JSON-Server с данными Todo.

Для того что бы запустить локальный сервер с RESTful API нужно выполнить две команды:

```shell
# Установить зависимости для запуска
npm run backend:install

# Запустить сервер
npm run backend:start
```

При успешном запуске вы увидите в консоле сообщение что сервер запущен на порту 3000:

```shell
> mock-server-api@1.0.0 start
> node server.js

Server is running on: http://localhost:3000
API baseURL: http://localhost:3000/api
```

🚧 JSON-Server полезен для разработки и тестирования клиентских приложений, когда реальный серверный API еще не доступен или не готов. Он позволяет создавать и имитировать различные сценарии для работы с данными без необходимости создания и поддержки полноценного сервера.

⚠️ JSON-Server не предназначен для развертывания в производственных средах, так как это лишь эмуляция настоящего API.

⬆ [Back to Top](#знакомство-с-rtk-query)

### Определение маршрутов для запросов

`baseUrl: http://localhost:3000/api` это базовый URL вашего API.

`endpoint: /todos` это конечная точка для доступа к данным c todo.  

Запросы с `endpoint: /todos` бдут следующие:

- Получение всех Todos (пагинация в том числе): 
  ```text
  GET     /todos
  GET     /todos?_page=1&limit=10
  ```
- Добавление нового Todo
  ```text
  POST    /todos
  ```
- Частичное изменение Todo (будем менять поле completed)
  ```text
  PATCH   /todos/{id}
  ```
- Удаление Todo из списка
  ```text
  DELETE  /todos/{id}
  ```

Метод `GET` относятся к операциям типа **Queries**.

Методы `POST`, `PATCH` и `DELETE` относятся  операциям типа **Mutations**.

То есть Todo API Slice будет содержать четыре конечные точки (endpoints) в которых будут выполнятся запросы и остальная логика для управления данными.  

⬆ [Back to Top](#знакомство-с-rtk-query)

### Создание Query endpoint'а - getTodos

Для создания Query endpoint'а в функции `createApi()` используется метод `builder.query()`.
Он позволяет определить запрос на получение данных и связать его с вашим API.

Декларация типа `builder.query()` выглядит вот так:

```ts
query<ResultType, QueryArg>
```

- `ResultType` - Тип возвращаемого значения;
- `QueryArg` - Тип передаваемого аргумента, объект или примитивный тип, если аргумента нет можно указать `void`;

Query endpoint `getTodos`:

```tsx
// src/features/todos/api/todos-api-slice.ts
const TODOS_API_ENDPOINT = '/todos';

export const todosApi = createApi({
  tagTypes: ['Todos'], // Список тегов для использования в запросах и мутациях 

  reducerPath: 'todosApi',

  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api' }),

  endpoints: (build) => ({
    getTodos: build.query<Todo[], void>({
      query: () => `${TODOS_API_ENDPOINT}`,
      providesTags: ['Todos'],
    }),
  }),
});
```

В этом примере мы определили Query endpoint с именем `getTodos`.
Внутри `builder.query()` мы указали свойство query и передали в него функцию, которая возвращает путь запроса `/todos`.

`builder.query()` возвращает результат запроса с данными, которые будут сохранены в кэше и могут быть получены через хуки API slice.    

Параметр `providesTags` используется в только в query endpoints, он определяет какой тег будет использоваться для инвалидации кэша в запросе.

> Теги - это механизм, используемый в RTK для отслеживания кэшированных данных и их инвалидации при необходимости. Когда происходит успешное выполнение мутации, данные, связанные с определенными тегами, могут быть инвалидированы, чтобы обеспечить их обновление или перезагрузку при следующем запросе.

⬆ [Back to Top](#знакомство-с-rtk-query)

### Настройка Query responses с помощью TransformResponse

Каждый запрос или мутация может содержать дополнительный параметр `transformResponse`, который позволяет манипулировать полученными данными до того как они попадут в кэш.

Возьмем в качестве примера (выдуманный кейс) задачу в которой нам требуется получить массив todo где у каждого todo будет обозначен случайный цвет. 

```ts
getTodos: build.query<Todo[], void>({
  query: () => `${TODOS_API_ENDPOINT}`,
  providesTags: ['Todos'],
  transformResponse: (response: Todo[]) => {
    return response.map((todo) => ({ ...todo, color: getRandomColor() }));
  },
})
```

После того как будет выполнен запрос будет вызвана функция переданная в параметр `transformResponse`, эта функция принимает три параметра:

- `baseQueryReturnValue` - Результат выполнения запроса, то есть это массив из todo; 
- `meta` - Это объект, который содержит информацию о запросе и endpoint, включая заголовки ответа и аргументы запроса; 
- `arg` - Это аргумент используемый при вызове запроса или мутации;

Теперь в результате выполнения `getTodos` в кэш будет сохранен новый массив, в котором для каждого todo будет добавлено новое поле `color`.    

⬆ [Back to Top](#знакомство-с-rtk-query)

### Создание Mutation endpoint'а - addTodo

Для создания Mutation endpoint'а в функции `createApi()` используется метод `builder.mutation()`.
Он позволяет определить запрос на изменение или отправку данных на сервер (backend).

Декларация типа `builder.mutation()` выглядит вот так:
```ts
mutation<ResultType, QueryArg>
```

- `ResultType` - Тип возвращаемого значения, если запрос ничего не возвращает можно указать `unknown`;  
- `QueryArg` - Тип передаваемого аргумента, объект или примитивный тип;


Mutation endpoint `addTodo`:

```ts
addTodo: build.mutation<Todo, Partial<Todo>>({
  query: (todoData) => {
    const newTodo = {
      ...todoData,
      completed: false,
      id: uuidv4(),
    };

    return {
      url: `${TODOS_API_ENDPOINT}`,
      method: 'POST',
      body: newTodo,
    };
  },
  invalidatesTags: ['Todos'],
})
```

В этом примере мы определили Mutation endpoint с именем `addTodo`. 
Внутри `builder.mutation()` вы должны указать параметр `query`, в который передается функция принимающая `todoData` в качестве аргумента и возвращающая объект с настройками запроса (URL, метод и тело запроса).

Аргумент `todoData` (название произвольное) это объект или значение примитивного типа, которое будет передано при вызове мутации и будет отправлено в виде данных на сервер (backend).  

Вторым параметром передается массив тегов в `invalidatesTags`, после успешного выполнения мутации `addTodo`,
тег с именем `"Todos"` будет инвалидирован, что позволит обновить данные, связанные с этим тегом при следующем запросе списка Todo (`getTodos`).

⬆ [Back to Top](#знакомство-с-rtk-query)

### Создание Mutation endpoint'а - deleteTodo 

Следующая мутация предназначена для удаления todo:

```ts
deleteTodo: build.mutation<undefined, string>({
  query(id) {
    return {
      url: `${TODOS_API_ENDPOINT}/${id}`,
      method: 'DELETE',
    };
  },
  invalidatesTags: ['Todos'],
})
```

Запрос `DELETE` на JSON Server ничего не возвращает, кроме с HTTP Status Code.
Возвращения данных в запросах типа `DELETE` зависит от конкретной реализации REST API, в некоторых реализациях 
в случае успеха этот запрос возвращает объект который был удален.


### Создание Mutation endpoint'а - toggleTodoCompleted

Существует два способа изменить данные на сервере (реализация JSON Server):

- Метод `UPDATE`, полностью перезаписывает поля объекта, поэтому требует наличия всех полей при отправке на сервер, валидации полей на сервере нет, это одна из причин почему данный сервер (JSON Server) не подходи для продакшен;
- Метод `PATCH`, частичное обновление данных, перезаписывает поля только те которые пришли в запросе на сервер;  

В нашей реализации `toggleTodoCompleted` мы будем использовать метод `PATCH` и отправлять на сервер объект 
с одним полем `{ completed: true }` или `{ completed: false }`. 

Реализация `toggleTodoCompleted` очень похожа на `deleteTodo`, с той лишь разницей, что мы передаем объект и используем метод `PATCH`.

Как и в случае с `deleteTodo`, поле выполнения мутации необходимо обновить кэш со списком todo (`getTodos`), и здесь мы будем
использовать другой подход, который называется **Optimistic Update**.

**Optimistic Update** - это паттерн, который реализует обновление локального состояние вашего приложения сразу после отправки запроса мутации, прежде чем придет ответ от сервера.

Mutation endpoint `toggleTodoCompleted`:

```ts
toggleTodoCompleted: build.mutation<unknown, Pick<Todo, 'id'> & Partial<Todo>>({
  query: ({ id, ...patch }) => ({
    url: `${TODOS_API_ENDPOINT}/${id}`,
    method: 'PATCH',
    body: patch,
  }),
  
  onQueryStarted: ({ id, completed }, { dispatch, queryFulfilled }) => {
    const patchResult = dispatch(
      todosApi.util.updateQueryData('getTodos', undefined, (draft) => {
        const index = draft.findIndex((todo: Todo) => todo.id === id);

        if (index !== -1) {
          draft[index].completed = Boolean(completed);
        }
      })
    );

    queryFulfilled.catch(patchResult.undo);
  },
})
```

Функция `onQueryStarted()` используется для определения действий, которые должны быть выполнены перед началом выполнения мутации. 

Первый аргумент содержит данные для запроса, переданные при вызове мутации, в нашем случае это объект со свойствами `{ id, completed }`.

Вторым аргументом в функцию передается API-объект жизненного цикла, содержащим такие свойства, как `dispatch`, `queryFulfilled`, позволяющие запускать код при запуске запроса, при его успешном выполнении и при сбое (т. е. на протяжении жизненного цикла отдельного запроса/вызова мутации).

`todosApi.util.updateQueryData` - утилита **thunk action creator**, которая при отправке создает и применяет набор объектов JSON `diff/patch` к текущему состоянию, 
при помощи нее мы делаем обновление одного todo в текущем состоянии API Slice которе хранится в кэше запроса `getTodos`.

Таким образом функция `onQueryStarted()` обновит кэш не дожидаясь когда будет выполнен запрос, а вызов `queryFulfilled.catch` сделает откат изменений для кэша в случае если мутация завершится успешно, но сервер вернет ошибку.

⬆ [Back to Top](#знакомство-с-rtk-query)

### Экспорт хуков из API Slice

После того как вы описали все конечные точки (endpoints) в `createApi()` необходимо сделать экспорт хуков для выполнения запросов и мутаций в ваших React компонентах:

```ts
// src/features/todos/api/todos-api-slice.ts
//...
export const todosApiSlice = createApi({
  //...
});

export const {
  useGetTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useToggleTodoCompletedMutation,
} = todosApiSlice;
```

Эти хуки создаются автоматически на основе ваших endpoint'ов и используются в ваших компонентах React.

Ниже представлен небольшой обзор списка хуков, которые автоматически генерируются для API Slice и его endpoint'ов. 

⬆ [Back to Top](#знакомство-с-rtk-query)

### Добавление API Slice в Redux Store  

Существует два метода добавления API Slice в Redux Store:

1. Добавление API Slice через ApiProvider из RTK Query, этот метод аналогичен подключению Redux Store через `<Provider />`, только вместо `store` используется API Slice:
    ```tsx
    import { ApiProvider } from '@reduxjs/toolkit/query/react';
    import { todosApiSlice } from "./todos-api-slice";
    //..
    <ApiProvider api={todosApiSlice}>
      <App />
    </ApiProvider>
    ```
2. Добавление в существующий `store` по аналогии со Slice созданным через функцию `createSlice()`:
    ```tsx
    import { combineReducers, configureStore } from '@reduxjs/toolkit';
    import { todosApiSlice } from '@/features/todos';
    
    export const rootReducer = combineReducers({
      [todosApiSlice.reducerPath]: todosApiSlice.reducer,
    });
    
    export const store = configureStore({
      reducer: rootReducer,
      devTools: true, // Defaults to true.
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(todosApiSlice.middleware),
    });
    ```
    Здесь API Slice, созданный функцией `createApi()` подключается в виде редюсера в Root Reducer и в качестве middleware.

Первый способ подключения не требует установки пакета `react-redux`, так RTK Query не использует хуки и компоненты из этого пакета.

В исходном приложении Todo, которое используется в качестве примера будет задействован второй способ подключения в существующий Redux Store. 

⬆ [Back to Top](#знакомство-с-rtk-query)

### Обзор API Slices: React Hooks

RTK Query автоматически генерирует React хуки для каждого вашего endpoint'та.

Для каждого отдельного API Slice, `createApi()` будет генерировать структуру, которая будет содержать основной хук
для запроса (Query) или мутации (Mutation) и который будет доступен через объект endpoint'та как:

- `api.endpoints[endpointName].useQuery` - для endpoint'та Query;
- `api.endpoints[endpointName].useMutation` - для endpoint'та Mutation;

Так же RTK Query генерирует дополнительные хуки для более сложных вариантов использования.  Полный список хуков, сгенерированных в `createApi()`, выглядит следующим образом:

- **useQuery** - Для endpoint'та Query, также генерируется в объекте API (`use[EndpointName]Query`), используется для выполнения запросов к удаленным серверам и управления данными, нормализации данных и кэширования данных, полученными в результате запросов.;
- **useMutation** - Для endpoint'та Mutation, также генерируется в объекте API (`use[EndpointName]Mutation`), используется для управления операциями мутации (изменения данных) в вашем приложении. Он предоставляет удобный способ отправлять запросы на сервер для создания, обновления или удаления данных и обрабатывать результаты этих операций.
- **useQueryState** - Для endpoint'та Query, считывает статус запроса и кэшированные данные из хранилища Redux, при изменении данных вызывает повторный рендеринг компонента. Данный хук не запускает процесс получения данных с сервера;
- **useQuerySubscription** - Для endpoint'та Query, возвращает функцию `refetch`. Автоматически запускает выборку данных и подписывает компонент на кэшированные данные;
- **useLazyQuery** - Для endpoint'та Query, также генерируется в объекте API (`useLazy[EndpointName]Query`), хук аналогичный `useQuery`, но с ручным контролем получения данных, вы можете явно контролировать момент выполнения запроса;
- **useLazyQuerySubscription** - Для endpoint'та Query, хук аналогичный `useQuerySubscription`, но с ручным контролем получения данных, вы можете явно контролировать момент выполнения запроса;
- **usePrefetch** - не зависимо от endpoint (в API Slice), позволяет предварительно загрузить данные для запросов в фоновом режиме, до того, как они будут запрошены явно;

Пример использования хука `usePrefetch()`:

```tsx
const App = (): JSX.Element => {
    //...
    const prefetchQuery = todosApi.usePrefetch('getTodos');

    useEffect(() => {
        prefetchQuery();
    }, []);
    //...
}
```
В этом примере выполняется предварительная загрузка данных после первого ренедеринге компонента.

В большинстве случаев стандартные хуки на основе useQuery, такие как `useGetTodosQuery`, будут основными хуками, используемыми в вашем приложении.

⬆ [Back to Top](#знакомство-с-rtk-query)

### Чтение данных - useGetTodosQuery

RTK Query автоматически создает оптимизированный для рендеринга хук, который позволяет выполнять фоновую выборку данных, а также предоставляет логические значения связанные с обработкой запроса.

Для endpoint'а  `getTodos` будет создан хук `useGetTodosQuery`, этот хук возвращает объект, содержащий такие свойства, как последние данные полученные через запрос, а также логические значения для текущего состояния жизненного цикла запроса:

- `data` - Последний возвращенный результат независимо от аргумента переданного в хук, если он присутствует.
- `currentData` - Последний возвращенный результат для текущего аргумента переданного в хук, если он присутствует.
- `error` - Результат ошибки, если она присутствует.
- `isUninitialized` - Значение `true` указывает, что запрос еще не запущен.
- `isLoading` - Значение `true` указывает, что запрос в данный момент загружается впервые и еще не содержит данных.  Это будет верно для первого запущенного запроса, но не для последующих запросов.
- `isFetching` - Значение `true` указывает, что запрос в данный момент извлекается, но может содержать данные из более раннего запроса.  Это будет верно как для первого запущенного запроса, так и для последующих запросов.
- `isSuccess` - Значение `true` указывает, что запрос содержит данные успешного запроса.
- `isError` - Значение `true` указывает, что запрос находится в состоянии ошибки.
- `refetch` - Функция принудительного обновления запроса.

Первый вызов хука `useGetTodosQuery` автоматически запустит запрос получения данных, все последующие вызовы будут возвращать данные из кэша.
По умолчанию кэш запроса будет храниться 60 секунд после того как последний компонент будет удален из подписчиков на эти данные из Redux Store, это время можно изменить через параметр [keepUnusedDataFor](https://redux-toolkit.js.org/rtk-query/api/createApi#keepunuseddatafor).


Листинг компонента `<TodoList />` с использованием хука `useGetTodosQuery`:

```tsx
export const TodoList = (): JSX.Element => {
  const { data = [], isLoading, isFetching, isError } = useGetTodosQuery();

  if (isError) {
    return <div>An error has occurred!</div>;
  }

  if (isLoading || isFetching) {
    return <div className={styles.loader}>Loading...</div>;
  }

  const todoList = data.length
    ? data.map((todo) => <TodoItem key={todo.id} todo={todo} />)
    : 'No data!';

  return <div className={styles.todoList}>{todoList}</div>;
};
```
В этом примере мы получаем данные и некоторые значения связанные с обработкой запроса для условного рендеринга. 
При первом вызове `useGetTodosQuery()` автоматически будет выполнен запрос для получения данных с сервера и при успешном выполнении, 
данные будут сохранены в кэше.  

Вызов хука `useGetTodosQuery()` идентичен вызову `todosApi.endpoints.getTodos.useQuery()`. 

### Изменение данных useDeleteTodoMutation и useToggleTodoCompletedMutation

Теперь давайте рассмотрим выполнение мутаций на основе двух endpont'тов `deleteTodo` и `toggleTodoCompleted`:

```tsx
// src/features/todos/components/todo-item/todo-item.tsx
//...
export const TodoItem = ({ todo: { id, title, completed, color } }: TodoItemProps): JSX.Element => {
  const [deleteTodo] = useDeleteTodoMutation();
  const [toggleTodoCompleted] = useToggleTodoCompletedMutation();

  const completedClass = completed ? styles.todoTitleThrough : '';

  const handleChange = () => {
    void toggleTodoCompleted({ id, completed: !completed });
  };

  const handleDelete = () => {
    void deleteTodo(id);
  };

  return (
    <div className={styles.todoRow}>
      <div className={styles.todoInputWrapper}>
        <input
          checked={completed}
          onChange={handleChange}
          type="checkbox"
          className={styles.todoInput}
        />
      </div>
      <div className={`${styles.todoTitle} ${completedClass}`} style={{ color }}>
        {title}
      </div>
      <ButtonRemove onCLick={handleDelete} />
    </div>
  );
};
```

Для выполнения мутации вызывается хук связанный с endpoint'ом Mutation, который возвращает массив из двух объектов:

```ts
type UseMutation = (
  options?: UseMutationStateOptions
) => [UseMutationTrigger, UseMutationResult | SelectedUseMutationResult]
```
Первый объект это функция-триггер, которая запускает обновление данных на основе предоставленного аргумента.
Второй объект это состояния запроса, содержащий текущее состояние загрузки и метаданные о запросе или значения, возвращаемые опцией [selectFromResult](https://redux-toolkit.js.org/rtk-query/usage/queries#selecting-data-from-a-query-result), где это применимо.

Для того что запустить мутацию, вы должны вызвать  функцию-триггер и передать в нее аргументы для `build.mutation`.

Например, endpoint `deleteTodo` описывает мутацию, которая принимает один строковой аргумент `id` для идентификации todo, который требуется удалить, этот же аргумент должен передаваться в функцию-триггер
`deleteTodo(id)`, которую возвращает вызов хука `useDeleteTodoMutation()`.

Аналогичным образом работает `useToggleTodoCompletedMutation()`, где функция-триггер принимает объект с указанием `id` и свойства `completed`.

По умолчанию отдельные экземпляры хуков `useMutation` не связаны друг с другом и запуск одного экземпляра не повлияет на результат другого экземпляра.  Это применимо независимо от того, вызываются ли хуки внутри одного и того же компонента или из разных компонентов.

RTK Query предоставляет возможность совместного использования результатов между экземплярами хуков мутаций с помощью параметра [fixCacheKey](https://redux-toolkit.js.org/rtk-query/usage/mutations#shared-mutation-results).  Любые хуки `useMutation` с одной и той же строкой `fixCacheKey` будут обмениваться результатами друг с другом при вызове любой из триггерных функций.

⬆ [Back to Top](#знакомство-с-rtk-query)

### Добавление данных useAddTodoMutation

Добавление нового todo с использованием хука `useAddTodoMutation` аналогичен использованию `useDeleteTodoMutation` и `useToggleTodoCompletedMutation`

```tsx
//...
const [addTodo] = useAddTodoMutation();
//..
const handleClick = (): void => {
  const trimmedValue = title.trim();

  if (trimmedValue) {
    void addTodo({ title: trimmedValue });

    setTitle('');
  }
};
```

В обработчике события вы должны вызвать функцию-триггер и передать в нее строковой аргумент `title`. 

После того, как запрос на добавление нового todo будет выполнен, тег связанный с `getTodos` будет инвалидирован, что приведет к повторному запуску запроса на обновление данных кэша через запрос `getTodos`,
аналогично, тег будет инвалидирован в случае запуска мутации `deleteTodo`.

⬆ [Back to Top](#знакомство-с-rtk-query)

Готовый пример с приложением находится в директории `./src` текущей ветки _rtk-query_.

Клонируйте репозиторий и установите зависимости:

```shell
git clone https://github.com/shopot/react-101.git

git checkout rtk-query

npm install
````

Для запуска JSON Server в отдельном окне консоли выполните команды:

```shell
npm run backend:install

npm run backend:start
```

Для запуска приложения  Todo выполните команды:

```shell
npm run dev
```

📘 Документация по теме 

Ссылки на официальные страницы документации:

- 🔗 [RTK Query Overview](https://redux-toolkit.js.org/rtk-query/overview)
- 🔗 [createApi](https://redux-toolkit.js.org/rtk-query/api/createApi)
- 🔗 [Queries](https://redux-toolkit.js.org/rtk-query/usage/queries)
- 🔗 [Mutations](https://redux-toolkit.js.org/rtk-query/usage/mutations)
- 🔗 [Prefetching](https://redux-toolkit.js.org/rtk-query/usage/prefetching)
- 🔗 [Usage With TypeScript](https://redux-toolkit.js.org/rtk-query/usage-with-typescript)

⬆ [Back to Top](#знакомство-с-rtk-query)
