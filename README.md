Reducer and actions that set and get the value at path of the state object using lodash.

## Instalation

```
npm instal -S redux react-redux universal-reducer
```

## Setup

```
import { createStore } from 'redux'
import universalReducer, { createActions } from 'universal-reducer'

const store = createStore(universalReducer)
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
  parent: {
    child: {
      grandchild: 'Mike'
    }
  }
}
```

`Get nested value:`

```
const value = actions.get('parent.child.grandchild')

console.log(value) // `Mike`
```

`Get default value:`

```
const value = actions.get('parent.daughter', 'Jane')

console.log(value) // `Jane`
```

## React Usage

This implementation requires `react-redux` to be set up on your project, using the universal reducer and store.

https://redux.js.org/introduction/getting-started#basic-example

https://react-redux.js.org/introduction/getting-started

`store.js`

```
import { createStore } from 'redux'
import universalReducer, { createActions } from 'universal-reducer'

const store = createStore(universalReducer)
export const actions = createActions(store)
export default store
```

`index.js`

```
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
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
import { useSelector } from 'react-redux'
import { actions } from './store'


export default function App() {
  const { value } = useSelector(() => actions.get('counters.app', {}))
  return (
    <div>
      <span>
        <button
	  onClick={() => actions.set('counters.app.value', 100)
	>
    	  SET to 100
    	</button>
    	<button
    	  onClick={() => actions.update('counters.app.value', (b = 0) => b + 1))
    	>
    	  INCREMENT
    	</button>
    	<button
    	  onClick={() => actions.update('counters.app.value', (b = 0) => b - 1))
    	>
	  DECREMENT
    	</button>
    	<button onClick={() => actions.unset('counters')>
    	  DELETE
    	</button>
      </span>
      <span>{value}</span>
    </div>
  )
}
```
