# React Router demo

A demo to elaborate around features, concepts and conventions in https://reactrouter.com/.

-   Client side routing
-   Loaders
-   Actions
-   Error handling
-   Optimistic UI strategy
-   Outlet

## Project setup

Bootstrapped with https://github.com/facebook/create-react-app, see [React README](REACT_README.md)

```
$ npx create-react-app react-router-demo
```

Install React Router and some initial dependencies

```
$ npm install react-router-dom localforage match-sorter sort-by
```

Prettier

https://prettier.io/docs/en/install.html

https://github.com/prettier/prettier-vscode

```
$ npm install --save-dev --save-exact prettier
```

```
$ npx prettier . --write
```

Linters against staged git files, using git hooks (Husky)

https://github.com/typicode/husky

https://github.com/okonet/lint-staged

```
$ npm install --save-dev husky lint-staged
```

## Visual Studio Code (VS Code)

https://create-react-app.dev/docs/setting-up-your-editor/

https://github.com/microsoft/vscode-js-debug

## Run demo

```
$ npm start
```

```
http://localhost:3000/
```
