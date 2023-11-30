
# Знакомство с MobX

📚 Содержание


## Философия MobX

> Все, что можно получить из состояния приложения, должно быть получено автоматически.

**MobX** предоставляет простую и эффективную модель управления состоянием, основанную на концепции наблюдаемых объектов (observable objects) и реактивных вычислениях (computed values). Философия MobX строится на нескольких ключевых принципах:

* **Простота (Straightforward)** - MobX предлагает простой и понятный способ управления состоянием в приложении. Он основан на концепции наблюдаемых объектов и реактивных зависимостей. Код, использующий MobX, обычно более читаем и легко поддерживаем, что упрощает разработку и сопровождение приложений.
* **Эффективность оптимизации рендеринга (Effortless Optimal Rendering)** - Одной из ключевых особенностей MobX является эффективная оптимизация рендеринга. Благодаря использованию концепции реактивности, MobX обеспечивает автоматическую оптимизацию процесса обновления пользовательского интерфейса. Компоненты перерисовываются только при необходимости, что повышает производительность и экономит ресурсы.
* **Архитектурная свобода (Architectural Freedom)** - MobX предоставляет свободу в выборе архитектуры приложения. Он может использоваться совместно с различными фреймворками и библиотеками, а также интегрироваться в существующий код без необходимости радикальных изменений. Это позволяет разработчикам выбирать подход, который лучше всего соответствует требованиям и особенностям их проекта.

⬆ [Back to Top](#знакомство-с-mobx)

## Концепции

MobX основан на трех основных концепциях: **State (Состояние)**, **Actions (Действия)** и **Derivations (Производные)**:

1. **State (Состояние)**:
   * Состояние представляет собой данные вашего приложения, которые могут изменяться со временем.
   * В MobX состояние обычно представлено в виде объектов или классов JavaScript.
   * Состояние меняется только при наличии действий, что делает управление изменениями более предсказуемым.
2. **Actions (Действия)**:
   * Действия - это функции, которые изменяют состояние вашего приложения.
   * В MobX действия могут изменять состояние напрямую, что упрощает процесс управления состоянием.
3. **Derivations (Производные)**:
   * Производные представляют собой значения, которые автоматически вычисляются на основе состояния или других производных.
   * MobX обеспечивает автоматическое отслеживание зависимостей, чтобы пересчитывать производные только при необходимости.

Эти три концепции взаимодействуют, обеспечивая эффективное управление состоянием приложения. При изменении состояния MobX автоматически обновляет все производные, которые зависят от этого состояния, что делает код более декларативным и легким для понимания.

⬆ [Back to Top](#знакомство-с-mobx)

## Принципы

MobX использует однонаправленный поток данных, в котором действия изменяют состояние, что, в свою очередь, обновляет все затронутые представления.

![mobx-data-flow](public/action-state-view.png)

1. Все производные обновляются автоматически и атомарно при изменении состояния.  В результате никогда не удается соблюдать промежуточные значения. 
2. По умолчанию все производные обновляются синхронно.  Это означает, что, например, действия могут безопасно проверять вычисленное значение сразу после изменения состояния. 
3. Вычисленные значения обновляются лениво.  Любое вычисленное значение, которое не используется активно, не будет обновляться до тех пор, пока оно не понадобится для побочного эффекта (ввода-вывода).  Если представление больше не используется, оно будет автоматически очищено от мусора. 
4. Все вычисленные значения должны быть чистыми.  Они не должны менять состояние.

Прозрачная реактивность является декларативной, высокоуровневой и лаконичной, это достигается путем добавления следующих ограничений:

* **Для любого заданного набора мутаций любое затронутое вычисление (derivation) будет выполнено ровно один раз.** Это означает, что если у вас есть какие-то вычисления или функции, зависящие от данных, и данные изменяются, то эти вычисления будут запущены только один раз, несмотря на то, сколько раз данные были изменены. Это обеспечивает предсказуемость и эффективность, предотвращая избыточные повторные вычисления. 
* **Вычисления (derivation) никогда не устаревают, и их эффекты сразу видны любому наблюдателю.** Это означает, что как только какие-то данные изменяются, все зависимые от них вычисления и реакции (например, интерфейс пользователя) обновляются мгновенно, без задержек. Это обеспечивает актуальность данных и предоставляет пользовательскому интерфейсу или другим частям программы актуальные результаты.

⬆ [Back to Top](#знакомство-с-mobx)

## Установка Mobx

MobX работает в любой среде ES5, включая браузеры и NodeJS.

Существует два варианта интеграции MobX с React в виде отдельных пакетов: 
* `mobx-react-lite` поддерживает только функциональные компоненты.
* `mobx-react` поддерживает функциональные компоненты и компоненты на основе классов.  

Установка MobX и пакета интеграции с React с помощью npm: 

```shell
npm install mobx mobx-react-lite
```
### TypeScript
При использовании MobX с TypeScript необходимо обновить параметры транспиляции для полей классов. Откройте файл tsconfig.json и посмотрите на значение target в секции compilerOptions. Если значение target указано ESNext или ES2022 (и выше), то ничего менять не нужно. Иначе нужно добавить новый параметр в секцию compilerOptions:

```json
"useDefineForClassFields": true
```

[Источник: https://mobx-cookbook.github.io](https://mobx-cookbook.github.io/installation#typescript)

⬆ [Back to Top](#знакомство-с-mobx)

## Термины и соглашения

![flow2](public/flow2.png)

`См. https://mobx.js.org/assets/flow2.png`

* **События (events)** - Это то что приходит из внешней среды, например клики мыши, пользовательский ввод, тики таймера и т.д.
* **Действия (actions)** - Это функции, которые мутируют (обновляют) наблюдаемые переменные состояния.
* **Наблюдаемое состояние (observable state)** - Это совокупность наблюдаемых полей (свойств), которые были объявлены как "observable". Наблюдаемые данные в MobX предоставляют реактивные возможности, что означает, что любые изменения в этих данных автоматически приводят к обновлению всех зависимых компонентов. Другими словами это состояние (state) приложения.
* **Вычисляемые значения или производные (computed values)** - Это значения, которые автоматически вычисляются на основе состояния или других производных.
* **Побочные эффекты (side-effects)** - Это любые изменения, которые происходят в ответ на изменение состояния (observable state). Side-effects могут включать в себя любые действия, которые необходимо выполнить после изменения данных, такие как обновление пользовательского интерфейса, отправка сетевых запросов, или любые другие операции, которые должны быть выполнены при изменении состояния приложения.
* **Реакции (reactions)** - Это функции, которые выполняются автоматически при изменении определенных наблюдаемых данных, в отличии от производных не возвращают никаких значений, используются для обновления пользовательского интерфейса, отправки сетевых запросов и т. д. Эти функции могут быть запущены при изменениях внутри наблюдаемых данных и предоставляют механизм для реагирования на эти изменения.
* **Аннотации (annotation)** - Используются для создания наблюдаемых (observable) данных, вычисляемых значений (computed values), и действий (actions).
* **Store-объект** - Это экземпляр класса или объект который содержит наблюдаемые данные, другими словами это состояние (state) приложения, то же самое что и **Наблюдаемое состояние (observable state)**

⬆ [Back to Top](#знакомство-с-mobx)

## Создание наблюдаемого состояния

Отдельные свойства, целые объекты, массивы, `Maps` и `Sets` - все это можно сделать наблюдаемым.
Основой создания наблюдаемых объектов является указание аннотации для каждого свойства с помощью функции `makeObservable()`

Наиболее важные и часто используемые аннотации:

* **observable** - Определяет отслеживаемое поле (переменную), в котором хранится значение состояния.
* **action** - Помечает метод как действие, которое будет менять состояние.
* **сomputed** отмечает геттер, который будет возвращать вычисленное значение на основе изменившегося состояния и кэшировать его выходные данные.

MobX предоставляет несколько подходов к определению состояния в приложении: использование классов, обычных объектов или декораторов.

Начиная с версии 6, подход определения состояния с использованием декораторов не является рекомендуемым способом, подробнее тут:  
[Migrating from MobX 4/5](https://mobx.js.org/migrating-from-4-or-5.html)

> Для создания наблюдаемого состояния на основе классов вы должны быть знакомы с классами JavaScript
>
> [см. Классы и this](https://mobx-cookbook.github.io/classes)


⬆ [Back to Top](#знакомство-с-mobx)

### class + makeObservable

**makeObservable** - Это функция, которая используется для объявления объекта наблюдаемым. Наблюдаемые объекты в MobX отслеживают изменения своих свойств, и если какое-то свойство изменяется, MobX автоматически обновляет все зависимости, которые используют это свойство.

Функция `makeObservable()` принимает два аргумента: 

1. **target** - Это объект, который вы хотите сделать наблюдаемым. Обычно это экземпляр класса.
2. **annotations** - Это объект, который содержит аннотации для определения типов наблюдаемых свойств. Каждый ключ в объекте annotations представляет свойство, которое вы хотите сделать наблюдаемым, а соответствующее значение указывает, какой тип наблюдаемого элемента вы хотите использовать (например, observable, computed, action и так далее).

Пример с использованием класса и функции `makeObservable()`: 

```ts
// counter-store.ts
import { makeObservable, observable, action, computed } from 'mobx';

class CounterStore {
  value = 0;

  constructor() {
    makeObservable(this, {
      value: observable,
      increment: action,
      decrement: action.bound,
      double: computed,
    });
  }

  increment() {
    this.value += 1;
  };

  decrement() {
    this.value--;
  };

  get double() {
    return this.value * 2;
  }
}

export const counterStore = new CounterStore();
```

Свойство класса `value`, отмеченное как `observable` это переменная состояния, т.е. наблюдаемое свойство. 

Методы `increment()` и `decrement()`, отмеченные как `action` это действия т.е. функции, которые мутируют состояние, оба эти метода изменяют свойство `value`.

Аннотацию `action.bound` можно использовать для автоматической привязки метода к правильному экземпляру, чтобы он всегда был правильно привязан внутри функции, точно так же как автоматическое связывание с помощи опции `autoBind` см. [This и потеря контекста](#this-и-потеря-контекста).

Геттер `get double` отмеченное как `computed` это вычисляемое значение из состояния, т.е. это чистая функция, которая возвращает производную на основе текущего состояния. Свойство `computed` запоминает вычисленный результат, когда вычисление завершено, MobX сравнивает новый результат с предыдущим, если результат совпадает, то уведомление наблюдателям не будет отправлено.

Для того что бы использовать состояние описанное в классе `CounterStore` необходимо экспортировать экземпляр этого класса (объект). 

⬆ [Back to Top](#знакомство-с-mobx)

### class + makeAutoObservable

**makeAutoObservable** - Эта функция автоматически помечает все свойства класса как наблюдаемые (observable), а все методы класса помечаются как `action`, а все геттеры как вычисляемые значения `computed`.

Функция `makeAutoObservable()` может быть более компактной и простой в обслуживании, чем использование `makeObservable()`, поскольку новые члены не нужно указывать явно.  

⚠️ Однако `makeAutoObservable()` нельзя использовать для классов, которые имеют суперкласс или являются подклассами.

Пример с использованием класса и функции `makeAutoObservable()`:


```ts
// counter-store.ts
import { makeAutoObservable } from 'mobx';

class CounterStore {
  value = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.value += 1;
  };

  decrement() {
    this.value--;
  };

  get double() {
    return this.value * 2;
  }
}

export const counterStore = new CounterStore();
```

⬆ [Back to Top](#знакомство-с-mobx)

### factory function + makeAutoObservable

> Любая функция, которая не является классом или конструктором,и возвращает (предположительно новый) объект называется фабричной.
 
Фабричная функция - это функция, которая используется для создания и инициализации новых объектов. Она возвращает новый объект и может принимать аргументы для установки начальных значений объекта. 

Этот пример демонстрирует создание наблюдаемого состояния без использования классов на основе объектного синтаксиса JavaScript при помощи фабричной функции:

```ts
// counter-store.ts
import { makeAutoObservable } from 'mobx';

const createCounterStore = () => {
  return makeAutoObservable({
    value: 0,
    
    increment() {
      this.value += 1;
    },
    
    decrement() {
      this.value--;
    },
    
    get double() {
      return this.value * 2;
    }
  });
}
 
export const counterStore = createCounterStore();
```

На первый взгляд, данный подход отлично применим в современном мире React, где классы считаются [устаревшим подходом](https://react.dev/reference/react/Component), но если рассматривать написание кода на TypeScript, то при использовании этого подхода возникают сложности с типизацией сторов-объектов.

Подробнее см. [Классы VS Функции для сторов](https://mobx-cookbook.github.io/classess-vs-functions).

То есть по факту, подход на основе классов является более предпочтительным способом описания наблюдаемого состояния в MobX. 

⬆ [Back to Top](#знакомство-с-mobx)

## Доступ к состоянию в компонентах

Функция `observer` является основным инструментом в MobX для реализации отслеживания изменений и автоматической перерисовки компонентов React при изменении данных, она предоставляется отдельным пакетом `mobx-react-lite` или `mobx-react`.

`observer` это Higher-Order Component, которым можно обернуть компонент React, чтобы он мог автоматически отслеживать и реагировать на изменения в наблюдаемых данных MobX.

Когда функция `observer` оборачивает компонент React, она создает реактивные прокси-объекты, которые отслеживают, какие именно данные используются внутри компонента. При каждом изменении этих данных MobX автоматически обновляет компонент и перерисовывает его с новыми значениями.

```tsx
import { observer } from 'mobx-react-lite';

import { counterStore } from '../stores/counter-store';

export const Counter = observer(() => {
  return (
    <div>
      <button onClick={() => counterStore.decrement()}>Decrement</button>
      <span>{counterStore.value}</span>
      <span>{counterStore.double}</span>
      <button onClick={() => counterStore.increment()}>Increment</button>
    </div>
  );
});
```

Чтобы компонент `<Counter />` стал `observer` (наблюдателем), его нужно подписать на изменения наблюдаемых данных (свойств) состояния, для этого компонент `<Counter />` оборачивается  при помощи `observer()`. 

Функция `observer()` автоматически подписывает компонент `<Counter />` на все наблюдаемые поля, которые используются во время рендеринга.

Теперь, при каждом нажатии на кнопку "Increment" или "Decrement", компонент `<Counter />` будет автоматически обновляться, отображая текущие значения счетчика - `value` и `double`.

⬆ [Back to Top](#знакомство-с-mobx)

## This и потеря контекста

В JavaScript, в отличие от многих других языков, значение this зависит от контекста и вычисляется на момент обращения к нему.

Если использовать деструктуризацию для извлечения методов из объекта, то методы, отделенные от объектов, теряют исходный контекст.

Следующий пример работать не будет:

```tsx
import { observer } from 'mobx-react-lite';

import { counterStore } from '../stores/counter-store';

export const Counter = observer(() => {
  const { decrement, increment } = counterStore;
    
  return (
    <div>
      <button onClick={() => decrement()}>Decrement</button>
      <span>{counterStore.value}</span>
      <span>{counterStore.double}</span>
      <button onClick={increment}>Increment</button>
    </div>
  );
});
```

Методы  `decrement` и `increment` отделенные от объекта `counterStore` теряют исходный контекст, результатом нажатия на кнопки будет ошибка в консоле:

```text
Uncaught TypeError: Cannot read properties of undefined (...
```

Для таких случаев MobX предоставляет дополнительную настройку для `makeObservable()` и `makeAutoObservable()`, которая позволяет автоматически связывать методы и геттеры с  исходным объектом:

```ts
// counter-store.ts
import { makeAutoObservable } from 'mobx';

class CounterStore {
  value = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  //...
}
//...
```

**autoBind** - Эта опция используется для автоматической привязки метода к правильному экземпляру (объекту), чтобы он всегда был правильно привязан внутри функции.

Если `autoBind` передан при вызове  `make(Auto)Observable` со значением `true`, то привязка будет сделана автоматически, следующий код будет работать корректно:

```tsx
import { observer } from 'mobx-react-lite';

import { counterStore } from '../stores/counter-store';

export const Counter = observer(() => {
  const { value, double, decrement, increment } = counterStore;
    
  return (
    <div>
      <button onClick={decrement}>Decrement</button>
      <span>{value}</span>
      <span>{double}</span>
      <button onClick={increment}>Increment</button>
    </div>
  );
});
```

Подробнее о потери `this` можно прочитать в разделе [MobX-Cookbook: Все сценарии потери реактивности ](https://mobx-cookbook.github.io/reactivity-loss)

## Использование глобального состояния в компонентах

> Существует большая гибкость в организации состояния, поскольку не имеет значения (технически), какие наблюдаемые (observables) значения мы читаем или откуда они возникли.

В приведенных ниже примерах демонстрируются различные паттерны того, как глобальное и локальное состояние может использоваться в компонентах.

### Передача через реквизиты (props)

Store-объекты можно передавать в компоненты как реквизиты:

```tsx
import { observer } from 'mobx-react-lite';
import { CounterStore } from '../stores/counter-store';

type CounterProps = {
  counter: CounterStore;
}

export const Counter = observer(({ counter }: CounterProps) => {
  const {value, decrement, increment} = counter;
    
  return (
    <div>
      <button onClick={decrement}>Decrement</button>
      <span>{value}</span>
      <button onClick={increment}>Increment</button>
    </div>
  );
});
```

Компонент, который принимает store-объект `counter`, должен быть обернут при помощи функции `observer()`,  чтобы он мог автоматически отслеживать и реагировать на изменения наблюдаемых данных в `counter`.  

###  Использование глобальных переменных

Пример с использованием глобальной переменной `counterStore` (модуля) был описан в разделах:

* Определение наблюдаемого состояния в виде модуля: [class + makeAutoObservable](#class--makeautoobservable)
* Импорт и использование глобальной переменной `counterStore`: [Доступ к состоянию в компонентах ](#доступ-к-состоянию-в-компонентах)

В файле `counter-store.ts` создается объект, который будет существовать в единственном экземпляре на всё приложение.
Этот объект будет доступен из любого места приложения и будет предоставлять общий доступ к состоянию для всех компонентов, которые будут его использовать.

Этот подход использует паттерн Singleton, то есть модуль который имеет состояние (Stateful Module).

💡 Использование этого паттерна может усложнить модульное тестирование, в место этого рекомендуется использовать MobX вместе с React Context.

см. [MobX-Cookbook: Синглтон](https://mobx-cookbook.github.io/react-integration/singleton) 

### React Context API и MobX

React Context это отличный механизм для передачи store-объектов внутрь дерева компонентов.

Здесь React Context в связке с MobX выступает как транспортный уровень, сами store-объекты как ссылочный тип данных остаются не измены, по этому React Context никак не реагирует на изменения внутри самого  store-объекта, всю реактивность обеспечивает сам MobX.

![mobx-context](public/mobx-context.png)

Шаг первый определить класс нашего счетчика (уже было) :
```ts
// counter-store.ts
import { makeAutoObservable } from 'mobx';

export class CounterStore {
  value = 0;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  increment() {
    this.value += 1;
  };

  decrement() {
    this.value--;
  };

  get double() {
    return this.value * 2;
  }
}
```
Далее необходимо создать контекст и провайдер в который будет оборачиваться корневой компонент, для упрощения все это один файл:

```tsx
// counter-context.tsx
import { createContext, PropsWithChildren } from "react";
import { CounterStore } from './counter-store';

const CounterContext = createContext({} as CounterStore);

export const CounterProvider = ({ children }: PropsWithChildren) =>  {
  return <CounterContext.Provider value={new CounterStore()}>{children}</CounterContext.Provider>;
}

export const useCounter = () => useContext(CounterContext);
```

В `CounterProvider` будет оборачиваться компонент или дерево компонентов которым нужен доступ к контексту, содержащему наблюдаемое состояние (store-объект).

```tsx
import { CounterProvider } from '...';

export const App = (): JSX.Element => {
  return (
    <CounterProvider>
      <Counter />
    </CounterProvider>    
  );
}
```

Хук `useCounter` будет возвращать store-объект из контекста, который в дальнейшем можно будет использовать:


```tsx
import { observer } from 'mobx-react-lite';
import { useCounter } from '../counter-context';

export const Counter = observer(() => {
  const { value, double, decrement, increment } = useCounter();
    
  return (
    <div>
      <button onClick={decrement}>Decrement</button>
      <span>{value} - {double}</span>
      <button onClick={increment}>Increment</button>
    </div>
  );
});
```

Для того что бы обеспечить реактивность для значения `value`, компонент нужно обернуть в функцию `observer()`.

Полный пример можно найти тут [mobx-context-example](https://github.com/shopot/mobx-context-example)

⬆ [Back to Top](#знакомство-с-mobx)


## Использование локального состояния в компонентах

### Использование хука useState

Самый простой способ использовать локальное состояние - сохранить ссылку на экземпляр класса (store-объект) с помощью хука `useState()`.

```tsx
import { useState } from 'react'; 
import { observer } from 'mobx-react-lite';
import { CounterStore } from '../counter-store';

export const Counter = observer(() => {
  const [ counter ] = useState(new CounterStore());
    
  return (
    <div>
      <button onClick={counter.decrement}>Decrement</button>
      <span>{counter.value} - {counter.double}</span>
      <button onClick={counter.increment}>Increment</button>
    </div>
  );
});
```

💡 Функция для обновления, возвращаемая `useState()`, не требуется, так менять ссылку  на store-объект не нужно.

⬆ [Back to Top](#знакомство-с-mobx)

### Использование хука useState и observable

**observable()** - Это функция клонирует объект и делает его наблюдаемым.
Источником может быть простой объект, массив, Map или Set. По умолчанию `observable()` применяется рекурсивно. 
Если одно из встреченных значений является объектом или массивом, это значение также будет передано через наблюдаемый объект.

```tsx
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { observable } from "mobx"

export const Counter = observer(() => {
  const [ counter ] = useState(() => observable({
    value: 0,
    increment() {
      this.value += 1;
    },
    decrement() {
      this.value--;
    },
    get double() {
      return this.value * 2;
    },
  }, {}, { autoBind: true }));

  return (
    <div>
      <button onClick={counter.decrement}>Decrement</button>
      <span>{counter.value} - {counter.double}</span>
      <button onClick={counter.increment}>Increment</button>
    </div>
  );
});
```

Здесь в качестве начального значения для `useState()` передается функция обратного вызова, которая возвращает результат вызова `observable()` с простым объектом в качестве аргумента, 
этот объект будет клонирован и сохранен уже в виде наблюдаемого store-объекта в переменную состояния `useState()`.

Как и в случае с использованием `makeAutoObservable()` для автоматической привязки контекста можно использовать опцию `autoBind: true`.   

Это отличная альтернатива если в переменной состояния нужно хранить структуру данных, может выступать в качестве замены сценария с использованием `useReducer()`.

⬆ [Back to Top](#знакомство-с-mobx)

### Использование хука useLocalObservable вместо useState

Это довольно распространенный паттерн (шаблон) с использованием хука `useState()`:  

```js
const [store] = useState(() => observable({ /* Something */}));
```

Чтобы упростить этот шаблон, в пакете `mobx-react-lite` представлен хук `useLocalObservable()`, который является заменой вышеупомянутого шаблона:

```js
const store = useLocalObservable(() => ({/* Something */}));
```

`useLocalObservable()` - Создает новый наблюдаемый объект с помощью `makeObservable` и сохраняет его в компоненте на протяжении всего жизненного цикла компонента.

```tsx
import { useState } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';

export const Counter = observer(() => {
  const { value, double, decrement, increment } = useLocalObservable(() => ({
    value: 0,
    increment() {
      this.value += 1;
    },
    decrement() {
      this.value--;
    },
    get double() {
      return this.value * 2;
    },
  }));

  return (
    <div>
      <button onClick={decrement}>Decrement</button>
      <span>{value} - {double}</span>
      <button onClick={increment}>Increment</button>
    </div>
  );
});
```

Привязка контекста для функций объекта делается автоматически.

Можно безопасно использовать _Деструктурирующее присваивание_.

⬆ [Back to Top](#знакомство-с-mobx)

## Реакции (Reactions)

Реакции это дополнительный функционал и одна из важных концепций MobX.

Реакции похожи на `computed`, за исключением того, что `computed` возвращает новое значение, а реакции создают побочные эффекты в ответ на изменения наблюдаемых полей store-объекта (состояния).

Один из сценариев использования реакций это функция `observer` из пакета `mobx-react-lite`, она  автоматически подписывает React-компонент на любые наблюдаемые поля, которые используются во время рендеринга. 
Если наблюдаемое поле изменится, то это вызовет повторный рендеринг компонента, в данном случае сработает реакция, побочным эффектом которой будет запуск повторного рендеринга компонента.

Помимо автоматического создания реакции при использовании функции `observer`, в MobX есть утилита [autorun](https://mobx.js.org/reactions.html#autorun) и функции [reaction](https://mobx.js.org/reactions.html#reaction) и [when](https://mobx.js.org/reactions.html#when).


Функция `autorun()` принимает одну функцию у качестве аргумента, которая должна запускаться каждый раз, когда она наблюдает какие-либо изменения,
она также запускается один раз при создании и реагирует только на изменения в наблюдаемом состоянии, на поля которые были аннотированы как **observable** или **сomputed** .

```tsx
import { autorun } from 'mobx';

export const counterStore = new Store()

autorun(() => {
  console.log(counterStore.value);
})
```

В этом примере с помощью `autorun()` выводится значение `value` в консоль каждый раз при его изменении. 

Функция `reaction()` аналогична `autorun()`, но дает больший контроль над тем, какие наблюдаемые поля будут отслеживаться.
Она принимает две функции: первая `computed`, возвращающая новое вычисленное состояние, вторая - функция с эффектами, которые должны последовать вслед за изменением состояния

Функция `when()` позволяет дополнительно осуществить проверку значения наблюдаемых данных перед выполнением определённой логики.

`autorun()`, `reaction()` и `when()` возвращают функцию удаления, которую можно использовать для остановки работы реакции и освобождения ресурсов.

Скорое всего вы не будете создавать реакции часто (возможно вообще никогда) и возможно единственный способ создания реакций в вашем приложении будет косвенный, например через функцию `observer()` из `mobx-react-lite`.

Больше информации о реакциях  можно найти в официальной документации в разделе [Reactions](https://mobx.js.org/reactions.html)

⬆ [Back to Top](#знакомство-с-mobx)

## Обновление состояния с помощью действий

Действие - это любой фрагмент кода, который изменяет состояние.  В принципе, действия всегда происходят в ответ на событие.  Например, была нажата кнопка, изменился какой-то ввод, пришло сообщение веб-сокета и т. д.

Действия в MobX - это функция (метод объекта), которая помечена аннотацией `action`, в старых версиях Mobx для этих целей так же использовался декоратор `@action`.

Аннотацию `action` следует использовать только для функций (методов), предназначенных для изменения состояния. Функции, которые извлекают информацию (выполняют поиск или фильтруют данные), не должны быть помечены как `action`.

В примерах выше уже были определение действий `decrement`, `increment` и использование их в обработчиках событий. 

💡 MobX рекомендует всегда использовать действия изменения состояния и никогда не делать никаких мутаций за пределами действия.

### Асинхронные действия

В MobX все действия выполняются внутри транзакций, это гарантирует что промежуточные значения наблюдаемых полей не будут видны остальной части приложения до завершения действия (завершение всех операций внтури действия). 

```ts
// counter-store.ts
import { makeAutoObservable } from 'mobx';

class CounterStore {
  value = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.value += 1;
    this.value += 1;
    this.value += 1;
  };

  //...
}
```

В этом примере, побочный эффект (side-effect) в виде повторного рендеринга компонента, подписанного на изменение `value`, сработает только один раз, 
MobX дождется выполнения всех изменения поля `value` и только потом сработает side-effect.

Асинхронная логика нарушает работу действия, любой запуск асинхронного кода внутри действия приводит к выполнению всех последующих шагов в виде отдельных "тиков", другими словами это будет уже не одна транзакция,
и в результате, side-effect будет срабатывать на каждое изменение любого наблюдаемого поля.

Для того что исправить эту ситуацию можно использовать функцию `runInAction()` из пакета `mobx`:

```ts
// counter-store.ts
import { makeAutoObservable, runInAction } from 'mobx';

class CounterStore {
  value = 0;

  constructor() {
    makeAutoObservable(this);
  }

  async increment() {
    await someAsyncFunction();

    runInAction(() => {
      this.value += 1;
      this.value += 1;
      this.value += 1;
    });
  };

  //...
}
```

`runInAction()` используется для группировки нескольких изменений состояния в одну транзакцию. Это особенно полезно в контексте асинхронных операций, таких как обращение к серверу или выполнение асинхронного кода, когда вы хотите избежать реакций на промежуточные значения состояния до завершения всех операций.


Следующий пример демонстрирует получение данных при помощи `async/await + runInAction`:

```ts
// counter-store.ts
import { makeAutoObservable, runInAction } from 'mobx';

type Post = {
    id: number;
    title: string;
}

class PostStore {
  posts: Post[] = [];
  state: 'pending' | 'done' | 'error' = 'pending';

  constructor() {
    makeAutoObservable(this);
  }

  async fetchPosts() {
    this.posts = [];
    this.state = 'pending';

    try{
      const posts = await getPosts(); // API-layer method

      runInAction(() => {
        this.posts = posts;
        this.state = 'done';    
      });
    } catch{
      this.state = 'error';
    }
  };

  //...
}
```

Любые шаги после `await` не находятся в одном и том же тике, поэтому они требуют оборачивания в `runInAction()`.

Другой способ избежать проблемы - использовать `flow` (замена `async`/`await` в MobX) и [функцию генератор](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator):

```ts
// counter-store.ts
import { flow, makeAutoObservable } from 'mobx';

type Post = {
  id: number;
  title: string;
}

interface ResponseGenerator extends Array<Post> {}

class PostStore {
  posts: Post[] = [];
  state: 'pending' | 'done' | 'error' = 'pending';

  constructor() {
    makeAutoObservable(this, {
      fetchPosts: flow
    });
  }

  // Обратите внимание на звездочку: это функция генератора!
  fetchPosts = flow(function* (this: PostSore) {
    this.posts = [];
    this.state = 'pending';

    try {
      // yield вместо await
      const posts: ResponseGenerator = yield getPosts();
      this.posts = posts;
      this.state = 'done';
    } catch {
      this.state = 'error';
    }
  });

  //...
}
```

Здесь`flow` используется как аннотация для свойства класса для второго аргумента в функции `makeAutoObservable()` и как функция декоратор для метода `fetchPosts()`.

Этот подход упрощает вложенность кода, однако возникают сложности с типизацией для возвращаемых значений из самих действий,
на этот случай в MobX есть функция-утилита [flowResult](https://mobx.js.org/api.html#flowresult)

Так же есть подход с оборачиваем действия при помощи функции декоратора `action`:

```ts
// counter-store.ts
import { action, makeAutoObservable } from 'mobx';

type Post = {
  id: number;
  title: string;
}

export class PostSore {
  posts: Post[] = [];
  state: 'pending' | 'done' | 'error' = 'pending';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  fetchPosts() {
    this.posts = [];
    this.state = 'pending';

    getPosts().then(
      action('fetchSuccess', (posts) => {
        this.posts = posts;
        this.state = 'done';
      }),
      action('fetchError', () => {
        this.state = 'error';
      })
    );
  }
}
```

Обработчики разрешения Promise обрабатываются в режиме реального времени, но запускаются после завершения исходного действия, поэтому их необходимо обернуть в `action`:

Следующий подход похож на предидущий, здесь Promise-обработчики являются методами класса, это значит они будут автоматически обернуты в `action` благодарная вызову `makeAutoObservable()`:  

```ts
// counter-store.ts
import { makeAutoObservable } from 'mobx';

type Post = {
  id: number;
  title: string;
}

export class PostSore {
  posts: Post[] = [];
  state: 'pending' | 'done' | 'error' = 'pending';

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  fetchPosts() {
    this.posts = [];
    this.state = 'pending';

    getPosts().then(this.projectsFetchSuccess, this.projectsFetchFailure);
  }

  projectsFetchSuccess(posts: Post[]) {
    this.posts = posts;
    this.state = 'done';
  }

  projectsFetchFailure() {
    this.state = 'error';
  }
}
```

⬆ [Back to Top](#знакомство-с-mobx)

## Отладка MobX и DevTools

Точно так же как и для Redux для MobX есть официальный плагин [mobx-devtools](https://github.com/mobxjs/mobx-devtools) для: 

* Chrome
* Firefox
* Standalone app for Safari, IE etc.

Утилита **[trace](https://mobx.js.org/analyzing-reactivity.html#using-trace-for-debugging)** - предназначена для включения или отключения отслеживания изменений MobX. 
При помощи `trace()`, вы можете записывать в консоль информацию о том, кто реагирует на изменения состояния. 

Пример использования:
```js
import { trace, observable } from 'mobx';

const store = observable({
  value: 42,
  setValue(value) {
    this.value = value;
  }
});

// Включение отслеживания
trace(true);

// Изменение состояния
store.setValue(43);
// В консоли будет выведена информация об изменениях и том, какие обсерверы отреагировали.

// Отключение отслеживания
trace(false);
```

Утилита **[spy](https://mobx.js.org/analyzing-reactivity.html#spy)** - предоставляет возможность отслеживать и логгировать все изменения в состоянии MobX. Она позволяет вам следить за изменениями в observable объектах, реакциях, вычисляемых значениях и других частях вашего приложения, использующего MobX.

Пример использования:

```js
import { spy } form 'mobx';

spy(event => {
  if (event.type === "action") {
    console.log(`${event.name} with args: ${event.arguments}`)
  }
})
```

⬆ [Back to Top](#знакомство-с-mobx)

📘 Документация по теме 

- 🔗 [MobX-Cookbook (Russian)](https://mobx-cookbook.github.io/)
- 🔗 [Официальная документация (English)](https://mobx.js.org/)
- 🔗 [Understanding reactivity](https://mobx.js.org/understanding-reactivity.html)
- 🔗 [Defining data stores: best practices](https://mobx.js.org/defining-data-stores.html)
- 🔗 [Официальная коллекция полезностей](https://github.com/mobxjs/awesome-mobx)
- 🔗 [The fundamental principles behind MobX](https://hackernoon.com/the-fundamental-principles-behind-mobx-7a725f71f3e8)

⬆ [Back to Top](#знакомство-с-rtk-query)
