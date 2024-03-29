Reducer and actions that set and get the value at path of the state object using lodash.

## Installation

```
npm install -S universal-reducer
```

## Setup

```
import { reducer, createStore, createActions } from 'universal-reducer'

const store = createStore(reducer)
export const actions = createActions(store)

export default store
```

## Set

Sets the value at path of the state object. If a portion of path doesn't exist, it's created.
https://lodash.com/docs/4.17.21#set

`Initial state:`

```
{}
```

`Action I:`

```
actions.set('parent.child.grandchild', 'Mike')
```

`State after action I:`

```
{
  parent: {
    child: {
      grandchild: 'Mike'
    }
  }
}
```

`Action II:`

```
actions.set('parent.brother', { nephew: 'John' })
```

`State after actions I and II:`

```
{
  parent: {
    brother: {
        nephew: 'John'
    },
    child: {
      grandchild: 'Mike'
    }
  }
}
```

## Update

This method is like set except that accepts updater to produce the value to set.
https://lodash.com/docs/4.17.21#update

`Initial state:`

```
{
  parent: {
    child: {
      grandchild: 'Mike'
    }
  }
}
```

`Action:`

```
actions.update('parent.child.grandchild', (value) => value + ' Junior')
```

`State after action:`

```
{
  parent: {
    child: {
      grandchild: 'Mike Junior'
    }
  }
}
```

## Unset

Removes the property at path of the state object.
https://lodash.com/docs/4.17.21#unset

`Initial state:`

```
{
  parent: {
    brother: 'John',
    child: {
      grandchild: 'Mike',
    }
  }
}
```

`Action:`

```
actions.unset('parent.child')
```

`State after action:`

```
{
  parent: {
    brother: 'John'
  }
}
```

## Get

Gets the value at path of the state object. If the resolved value is undefined, the defaultValue is returned in its place.
https://lodash.com/docs/4.17.21#get

`State:`

```
{
  pages: {
    subPages: {
      homepage: {
        name: 'Home'
      }
    }
  }
}
```

`Get nested value:`

```
const value = actions.get('pages.subPages.homepage.name')

console.log(value) // 'Home'
```

`Get default value:`

```
const value = actions.get('pages.missingkey', 'Jane')

console.log(value) // `Jane`
```

## Create
Creates a new actions module localized at the path of the state object. 

`Initial state:`

```
{}
```

`Action:`

```
const layoutActions = actions.create('layout')

layoutActions.set('collapsed', true)
```

`State after action:`

```
{
  layout: {
    collapsed: true
  }
}
```

`Get module values:`

```
const layout = layoutActions.get()

console.log(layout) // { collapsed: true }
```

`Get module value at path:`

```
const collapsed = layoutActions.get('collapsed')

console.log(collapsed) // true
```


## React Usage

This implementation uses `react-redux` under the hood. https://react-redux.js.org/introduction/getting-started

`store.js`

```
import { reducer, createActions, createStore } from 'universal-reducer'

const store = createStore(reducer)
export const actions = createActions(store)
export default store
```

`index.js`

```
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'universal-reducer'
import App from './App'
import store from './store'


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
document.getElementById("root"));
```

`App.js`

```
import React from "react"
import { useSelector } from "universal-reducer"
import { actions } from "./store"


export default function App() {
  const { value } = useSelector(() => actions.get("counters.app", {}))
  return (
    <div>
      <span>
        <button
          onClick={() => actions.set("counters.app.value", 100)}
        >
          SET to 100
        </button>
        <button
          onClick={() => actions.update("counters.app.value", (b = 0) => b + 1)}
        >
          INCREMENT
        </button>
        <button
          onClick={() => actions.update("counters.app.value", (b = 0) => b - 1)}
        >
          DECREMENT
        </button>
        <button onClick={() => actions.unset("counters")}>
          DELETE
        </button>
      </span>
      <span>{value}</span>
    </div>
  )
}
```
