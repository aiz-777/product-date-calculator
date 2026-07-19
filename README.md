# Product Date Calculator

Односторінковий сайт з калькуляторами дат для визначення строків придатності
продуктів.

## Можливості

- розрахунок дати закінчення придатності від дати виробництва;
- перевірка, скільки днів залишилось до кінцевої дати;
- розрахунок простої різниці між початковою та кінцевою датою;
- розрахунок коригування строку придатності в базі, включно з від'ємними залишками для прострочених товарів;
- швидкий список продуктів із кількістю днів придатності та видаленням нотаток.

## Структура

```text
.
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── src
|── |── icon
│   ├── scripts
│   │   └── app.js
│   └── styles
│       ├── base
│       │   └── _reset.scss
│       ├── blocks
│       │   ├── _button.scss
│       │   ├── _container.scss
│       │   ├── _dashboard.scss
│       │   ├── _eyebrow.scss
│       │   ├── _field.scss
│       │   ├── _footer.scss
│       │   ├── _form.scss
│       │   ├── _header.scss
│       │   ├── _page.scss
│       │   ├── _panel.scss
│       │   ├── _product-item.scss
│       │   ├── _product-list.scss
│       │   └── _result.scss
│       ├── utils
│       │   ├── _mixins.scss
│       │   └── _variables.scss
│       └── main.scss
├── .gitignore
└── README.md
```

## Як запустити

Встановіть залежності:

```bash
npm i
```

Запустіть локальний сервер:

```bash
npm start
```

Після цього Vite спробує автоматично відкрити сайт у браузері. Якщо браузер не відкрився, скопіюйте адресу з терміналу, наприклад `http://127.0.0.1:5173/`, і відкрийте її вручну.

## Як викласти на GitHub Pages

1. Створіть репозиторій `product-date-calculator` на GitHub.
2. Додайте remote у локальному проєкті.
3. Запуште гілку `main`.
4. Запустіть деплой:

```bash
npm run deploy
```

5. У GitHub відкрийте `Settings` -> `Pages`.
6. У `Build and deployment` виберіть `Deploy from a branch`.
7. Виберіть гілку `gh-pages` і папку `/root`.
8. Збережіть налаштування.

- [DEMO LINK](https://aiz-777.github.io/product-date-calculator/)
