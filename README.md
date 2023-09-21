# Работа с формами - обзор библиотеки React Hook Form

📚 Содержание:

- [Особенности библиотеки React Hook Form](#особенности-библиотеки-react-hook-form)
- [Установка React Hook Form](#установка-react-hook-form)
- [Знакомство с хуком useForm - `register()`, `handleSubmit()`](#знакомство-с-хуком-useform---register-handlesubmit)
- [Использование браузерной HTML валидации](#использование-браузерной-html-валидации)
- [Сообщения об ошибках](#сообщения-об-ошибках)
- [Валидация на основе схем](#валидация-на-основе-схем)
- [Как выполнить reset формы](#как-выполнить-reset-формы)
- [Как инициализировать значения формы](#как-инициализировать-значения-формы)
- [Интеграция с UI библиотеками](#интеграция-с-ui-библиотеками)
- [Использование React Context API с React Hook Form](#использование-react-context-api-с-react-hook-form)
- [Дизайн и философия](#дизайн-и-философия)

### Особенности библиотеки React Hook Form

**React Hook Form** - это библиотека для управления формами в React, которая позволяет легко управлять состоянием формы
и работать с данными формы. Она предоставляет простой, быстрый и мощный способ создания форм, облегчая процесс валидации
полей, обработки ошибок и отправки данных на сервер.

Ниже приведены основные особенности **React Hook Form**:

- Создана с учетом производительности, UX и DX;
- Поддержка нативной браузерной HTML валидации;
- Поддержка интеграции с библиотеками пользовательского интерфейса (UI libraries) "из коробки";
- Маленький размер библиотеки и отсутствие зависимостей;
- Поддержка валидации с помощью Yup, Zod, AJV, Superstruct, Joi и прочих реализаций;

[⬆ Back to Top](#работа-с-формами---обзор-библиотеки-react-hook-form)

### Установка React Hook Form

Для установки React Hook Form (далее просто `react-hook-form`) требуется всего одна команда, и все готово:

```shell
npm install react-hook-form
```

[⬆ Back to Top](#работа-с-формами---обзор-библиотеки-react-hook-form)

### Знакомство с хуком useForm - `register()`, `handleSubmit()`

Для того что бы начать работу с `react-hook-form`, нужно вызвать хук `useForm()`, который используется для создания
формы и её связывания с пользовательскими элементами управления, например `<input>`, `<select>`, `<textarea>`.

Хук `useForm()` возвращает объект, содержащий свойства и методы, ниже приведен список некоторых из них:

- `register()` - функция для регистрации полей формы, на которые ссылаются ссылки (`ref`).
- `handleSubmit()` - функция, которая обрабатывает отправку формы и вызывает функцию, переданную в качестве аргумента, с
  данными формы.
- `setValue()` - функция, которая позволяет устанавливать значения для полей формы.
- `setError()` - функция, которая позволяет устанавливать сообщения об ошибках для определенных полей формы.
- `clearErrors()` - функция, удаляющая сообщения об ошибках для определенных полей или всех полей формы.
- `watch()` - функция, которая позволяет отслеживать изменения значений указанных полей или всех полей формы.
- `getValues()` - функция для получения значений полей формы.
- `trigger()` - функция для проверки и вызова валидации полей формы.
- `reset()` - функция для сброса полей формы к их начальному состоянию.
- `formState` - объект, содержащий информацию о состоянии формы, такую как `isDirty`, `isSubmitSuccessful`, `errors` и
  так
  далее.

Одной из ключевых концепций `react-hook-form` является регистрация вашего компонента в хуке. Это сделает его значение
доступным как для проверки формы, так и для отправки.

Следующий фрагмент кода демонстрирует базовый пример использования хука `useForm()` с регистрацией компонентов:

```jsx
import { useForm } from 'react-hook-form';

const MyForm = () => {
  const {register, handleSubmit} = useForm();

  const handleSubmitMyForm = (data) => {
    console.log(data);
  };

  const handleSubmitError = (errors) => {
    console.log(errors);
  }

  return (
    /* "handleSubmit" will validate your inputs before invoking "handleSubmitMyForm" */
    <form onSubmit={handleSubmit(handleSubmitMyForm, handleSubmitError)}>
      {/* register your input into the hook by invoking the "register" function */}
      <input {...register('username')} />
      {/* register your input into the hook by invoking the "register" function */}
      <input {...register('email')} />

      <button type="submit">Submit</button>
    </form>
  );
};
```

Для регистрации компонента формы используется функция `register()`, которая принимает имя поля в качестве аргумента, при
отправке формы это имя будет использоваться как наименование свойства объекта данных формы:

| Регистрация имени            | Результат при отправке формы         |
|------------------------------|--------------------------------------|
| register("firstName")        | { firstName: 'value' }               |
| register("name.firstName")   | { name: { firstName: 'value' } }     |
| register("name.firstName.0") | { name: { firstName: [ 'value' ] } } |

Функция `refister()` возвращает объект, который содержит `onChange()`, `onBlur()`, `ref`, `name`, которые в свою очередь
позволяют хуку `useForm()` связывать значение компонента с состоянием формы и в дальнейшем выполнять валидацию этого
значения.

```jsx
const {onChange, onBlur, name, ref} = register('firstName');
// include type check against field path with the name you have supplied.

<input
  onChange={onChange} // assign onChange event 
  onBlur={onBlur} // assign onBlur event
  name={name} // assign name prop
  ref={ref} // assign ref prop
/>

// same as above
<input {...register('firstName')} />
```

`handleSubmit()` - это метод, который выполняет валидацию всех данных связанных с полями ввода. При успешной валидации,
метод `handleSubmit()` вызывает функцию `handleSubmitMyForm()` переданную в качестве аргумента и вся информация из формы
станет доступной в параметре `data`. Если валидация не проходит, то будет вызвана функция обработчик ошибок, которую
можно передать в качестве второго аргумента (необязательный аргумент) для метода `handleSubmit()`.

[⬆ Back to Top](#работа-с-формами---обзор-библиотеки-react-hook-form)

### Использование браузерной HTML валидации

`react-hook-form` упрощает проверку формы за счет соответствия
существующему [стандарту HTML для проверки формы](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation).

Функция `register()` может принимать объект в качестве второго аргумента, включающего ряд правил в виде свойств, которые
сообщают `register()`, как проверить предоставленные на вводе данные.

Список поддерживаемых правил (свойств) проверки:

- `required` - Логическое значение, которое, если оно истинно, указывает, что входные данные должны иметь значение,
  прежде чем форма может быть отправлена;
- `min` - Указывает минимальные для значения числовых типов ввода;
- `max` - Указывает максимальные для значения числовых типов ввода;
- `minLength` - Максимальная длина значения текстовых данных (строк);
- `maxLength` - Минимальная длина значения текстовых данных (строк);
- `pattern` - Шаблон регулярного выражения для ввода;
- `validate` - Принимает функцию обратного вызова в качестве аргумента для проверки или объект состоящий из функций
  обратного вызова для проверки всех из них. Эта функция будет выполняться сама по себе, независимо от других правил
  проверки, включенных в обязательный атрибут;

Следующий фрагмент кода демонстрирует параметры валидации с помощью функции `register()`:

```jsx
import { useForm } from 'react-hook-form';

const MyForm = () => {
  const {register, handleSubmit} = useForm();

  const submit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(submit)}>
      <input
        {...register('username', {
          required: true,
          minLength: 4,
          maxLength: 20,
        })}
      />
      <input
        {...register('email', {
          pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$',
        })}
      />
      <input
        type="number"
        {...register('age', {
          min: 18,
          max: 129,
        })}
      />
      {/* Callback function */}
      <input
        {...register('test', {
          validate: (value, formValues) => value === '1',
        })}
      />
      {/* Object of callback functions */}
      <input
        {...register('test1', {
          validate: {
            positive: v => parseInt(v) > 0,
            lessThanTen: v => parseInt(v) < 10,
            validateNumber: (_, values) =>
              !!(values.number1 + values.number2),
            checkUrl: async () => await fetch(),
          },
        })}
      />
    </form>
  );
};
```

[⬆ Back to Top](#работа-с-формами---обзор-библиотеки-react-hook-form)

### Сообщения об ошибках

Сообщения об ошибках - это визуальная обратная связь для наших пользователей, когда возникают проблемы с их вводом.
`react-hook-form` предоставляет объект ошибок, позволяющий легко извлекать ошибки.

Когда содержимое какого-то из полей ввода недействительно, функция `handleSubmit()` не вызывается и данные формы не
передаются, вместо этого объект ошибок `formState.errors` сохраняет информацию в каком из полей ввода была допущена
ошибка, это позволяет вывести текст сообщения об ошибке если проверка поля не удалась:

```jsx
import { useForm } from 'react-hook-form';

const MyForm = () => {
  const {register, handleSubmit, formState: {errors}} = useForm();

  const submit = (data) => console.log(data);

  return (
    /* "handleSubmit" will validate your inputs before invoking "submit" */
    <form onSubmit={handleSubmit(submit)}>
      {/* include validation with required or other standard HTML validation rules */}
      <input
        {...register('firstName', {required: true})}
      />
      {/* errors will return when field validation fails  */}
      {errors?.firstName && <span>This field is required</span>}
    </form>
  );
};
```

Вы можете просто передать сообщение об ошибке для `register()` через атрибут `message` объекта для правил валидации, а
затем вывести его в случае ошибки:

```jsx
const MyForm = () => {
  // ...

  return (
    <form onSubmit={handleSubmit(submit)}>
      <input {...register('firstName', {
        maxLength: {value: 2, message: 'error message'},
      })}
             aria-invalid={errors.firstName ? 'true' : 'false'}
      />;
      {errors?.firstName && <p>{errors.firstName.message}</p>}
    </form>
  );
};
```

Такой подход позволяет извлечь объект валидации в отдельный модуль (файл), то что так же, как и в случае
использования `validate` с объектом или функцией обратного вызова.

Еще один альтернативный вариант отображения ошибки пользовательского ввода это использование
компонента `<ErrorMessage />`, который устанавливается в виде отдельного пакета:

```shell
npm install @hookform/error-message
```

Это простой компонент для отображения сообщения об ошибке на основе состояния формы:

```jsx
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';

const MyForm = () => {
  const {register, formState: {errors}, handleSubmit} = useForm();

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register('singleErrorInput', {
          required: 'This is required.'
        })}
      />
      <ErrorMessage errors={errors} name="singleErrorInput" />

      <ErrorMessage
        errors={errors}
        name="singleErrorInput"
        render={({message}) => <p>{message}</p>}
      />
    </form>
  );
}
```

Этот компонент так же поддерживает режим `Multiple Error Messages`, подробнее о компоненте вы можете узнать на странице
официальной документации [Component ErrorMessage](https://react-hook-form.com/docs/useformstate/errormessage).

[⬆ Back to Top](#работа-с-формами---обзор-библиотеки-react-hook-form)

### Валидация на основе схем

`react-hook-form` также поддерживает проверку формы на основе схемы с
помощью библиотек
валидации [Yup](https://github.com/jquense/yup), [Zod](https://github.com/vriad/zod), [Superstruct](https://github.com/ianstormtaylor/superstruct)
и [Joi](https://github.com/hapijs/joi), где вы можете передать свою схему в `useForm` в качестве дополнительной
конфигурации. Библиотека валидации проверит ваши входные данные на соответствие схеме и вернет либо ошибки, либо
действительный результат.

Пример с использованием **Yup**:

```shell
npm install @hookform/resolvers yup
```

```jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup
  .object({
    firstName: yup.string().required(),
    age: yup.number().positive().integer().required(),
  }).required();

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm({resolver: yupResolver(schema)});

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('firstName')} />
      <p>{errors.firstName?.message}</p>

      <input {...register('age')} />
      <p>{errors.age?.message}</p>

      <input type="submit" />
    </form>
  );
};
```

`@hookform/resolvers` это "плагин" для `react-hook-form`, который позволяет легко интегрировать валидацию формы с
помощью внешних пакетов валидации данных, таких как Yup или Joi.

Для интеграции с внешней библиотекой используется функция resolver, которая принимает схему, описанную согласно правилам
использования библиотеки, и выполняет валидацию с использованием внешней библиотеки для входных данных формы.

Полный список поддерживаемых библиотек, список resolver-функций и примеры использования смотрите
на [официальной странице](https://github.com/react-hook-form/resolvers) `@hookform/resolvers`.

### Как выполнить reset формы

Очистить форму можно двумя способами:

- `HTMLFormElement.reset()` - этот метод выполняет то же самое, что и нажатие кнопки сброса формы. Он очищает только
  значения `input/select/checkbox`.
- React Hook Form API: `reset()` - метод `reset()` сбросит все значения полей формы, а также очистит все ошибки в форме,
  то есть приведет состояние формы к начальному значению.

[⬆ Back to Top](#работа-с-формами---обзор-библиотеки-react-hook-form)

### Как инициализировать значения формы

Поскольку `react-hook-form` использует неконтролируемы компоненты формы, вы можете указать `defaultValue`
или `defaultChecked` для отдельного компонента. Однако более распространено и рекомендовано инициализировать форму,
передавая `defaultValues` в хук `useForm()`.

```jsx
const MyForm = () => {
  const {register, handleSubmit} = useForm({
    defaultValues: {
      firstName: 'bill',
      lastName: 'luo',
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('firstName')} />
      <input {...register('lastName')} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

Для асинхронных значений по умолчанию вы можете использовать следующие методы:

- **Async defaultValues**
  ```jsx
  const MyForm = () => {
    const {register, handleSubmit} = useForm({
      defaultValues: async () => {
        const response = await fetch('/api');
  
        // return { firstName: '', lastName: '' }
        return await response.json();
      },
    });
  
    // ...
  };
  ```
- **Reactive values**
  ```jsx
  const MyForm = () => {
    // data returns { firstName: '', lastName: '' }
    const { data } = useQuery();
    
    const { register, handleSubmit } = useForm({
      values: data,
      resetOptions: {
        // keep dirty fields unchanged, but update defaultValues
        keepDirtyValues: true, 
      },
    });
  
    // ...
  };
  ```

[⬆ Back to Top](#работа-с-формами---обзор-библиотеки-react-hook-form)

### Интеграция с UI библиотеками

`react-hook-form` упростила интеграцию с внешними UI библиотеками. Если компонент формы не предоставляет `ref`, вам
следует использовать компонент `<Controller>`, который позаботится о процессе регистрации:

```jsx
import Select from "react-select"
import { useForm, Controller } from "react-hook-form"
import Input from "@material-ui/core/Input"

const App = () => {
  const {control, handleSubmit} = useForm({
    defaultValues: {
      firstName: "",
      select: {},
    },
  })
  const onSubmit = (data) => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="firstName"
        control={control}
        render={({field}) => <Input {...field} />}
      />
      <Controller
        name="select"
        control={control}
        render={({field}) => (
          <Select
            {...field}
            options={[
              {value: "chocolate", label: "Chocolate"},
              {value: "strawberry", label: "Strawberry"},
              {value: "vanilla", label: "Vanilla"},
            ]}
          />
        )}
      />
      <input type="submit" />
    </form>
  )
}
```

[Ссылка на документацию Component Controller](https://react-hook-form.com/docs/usecontroller/controller)

[⬆ Back to Top](#работа-с-формами---обзор-библиотеки-react-hook-form)

### Использование React Context API с React Hook Form

Хук `useFormContext()` позволяет вам получить доступ к контексту формы. Этот хук предназначен для использования в
глубоко вложенных структурах, где было бы неудобно передавать контекст в качестве пропса.

В качестве провайдера используется компонент `<FormProvider>`, который принимает в качестве пропсов методы и объекты,
возвращаемые хуком `useForm()`.

Использование `useFormContext()` аналогично использованию `useContext()`, без указания конкретного контекста,
предполагается, что контекст будет подставляться автоматически, из чего следует что вложенные конструкции
с `<FormProvider>` работать не будет.

Пример с использованием `useFormContext()`:

```jsx
import { useForm, FormProvider, useFormContext } from 'react-hook-form';

const NestedInput = () => {
  // retrieve all hook methods
  const {register} = useFormContext();

  return <input {...register('test')} />;
}


export const MyForm = () => {
  const methods = useForm();

  const handleOnSubmit = (data) => console.log(data);

  return (
    <FormProvider {...methods}> // Pass all methods into the context
      <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <NestedInput />
        <input type="submit" />
      </form>
    </FormProvider>
  );
};
```

[⬆ Back to Top](#работа-с-формами---обзор-библиотеки-react-hook-form)

### Дизайн и философия

Дизайн и философия React Hook Form ориентированы на опыт пользователей и разработчиков. Цель библиотеки - предоставить
пользователям более плавное взаимодействие за счет оптимизации производительности и улучшения доступности.

Некоторые из улучшений производительности включают в себя:

- Реализацию модели подписки на состояние через прокси (Proxy);
- Предотвращение ненужных вычислений;
- Изоляция повторного рендеринга компонентов при необходимости;

Все это улучшает пользовательское взаимодействие при работе с приложением.
Что касается разработчиков, React Hook Form предоставляет встроенную нативную HTML валидацию и тесно следует стандартам
HTML, позволяя дальнейшее расширение с помощью мощных методов валидации и интеграции в виде нативных схем. Кроме того,
наличие формы со строгой проверкой типов с помощью TypeScript обеспечивает раннюю обратную связь во время сборки,
которая помогает разработчику создать надежное решение.

[⬆ Back to Top](#работа-с-формами---обзор-библиотеки-react-hook-form)

Документация по теме:

- 🔗 [React Hook Form: Get Started](https://react-hook-form.com/get-started)
- 🔗 [React Hook Form: useForm](https://react-hook-form.com/docs/useform)
- 🔗 [React Context API for hook form](https://react-hook-form.com/docs/useformcontext)
- 🔗 [Form Builder](https://react-hook-form.com/form-builder)
- 🔗 [DevTools](https://react-hook-form.com/dev-tools)
- 🔗 [Typescript Support](https://react-hook-form.com/ts)

[⬆ Back to Top](#работа-с-формами---обзор-библиотеки-react-hook-form)
