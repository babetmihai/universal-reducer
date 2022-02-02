Reducer and store wrapper that uses paths to update nested values. The path syntax is the same as _.set and _.get form lodash

## Instalation

```
npm instal save universal-reducer
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

```
actions.set('parent.child1.child2', '123')
```

```
console.log(store.getState())

{
  parent: {
    child1: {
      child2: '123'
    }
  }
}
```

## Update

This method is like set except that accepts updater to produce the value to set.
https://lodash.com/docs/4.17.21#update

```
actions.update('parent.child1', (value) => ({ ...value, child3: '234' }))
```

```
console.log(store.getState())

{
  parent: {
    child1: {
      child2: '123',
      child3: '234'
    }
  }
}
```

## Unset

Removes the property at path of the state object.
https://lodash.com/docs/4.17.21#unset

```
actions.unset('parent.child1.child2')
```

```
console.log(store.getState())

{
  parent: {
    child1: {
      child3: '234'
    }
  }
}
```

## Get

Gets the value at path of the state object. If the resolved value is undefined, the defaultValue is returned in its place.
https://lodash.com/docs/4.17.21#get

```
const child = actions.get('parent.child1.child3')

console.log(child) // 234
```

```
const child = actions.get('parent.child4', 'defaultValue')

console.log(child) // defaultValue
```

## React Usage

This implementation requires `react-redux` to be set up on your project, using the universal reducer and store.
https://redux.js.org/introduction/getting-started#basic-example
https://react-redux.js.org/introduction/getting-started

```
import { createStore } from 'redux'
import universalReducer, { createActions } from 'universal-reducer'

const store = createStore(universalReducer)
export const actions = createActions(store)
export default store
```

```
import { actions } from './store'

function Test() {
  const { value } = useSelector(() => actions.get('parent1.parent2', {}))
  return (
    <div>
      <span>
        <button 
	  onClick={() => actions.set('parent1.parent2.value', 100)
	>
    	  SET to 100
    	</button>
    	<button
    	  onClick={() => actions.update('parent1.parent2.value', (b = 0) => b + 1))
    	>
    	  INCREMENT
    	</button>
    	<button
    	  onClick={() => actions.update('parent1.parent2.value', (b = 0) => b - 1))
    	> 
	  DECREMENT
    	</button>
    	<button onClick={() => actions.unset('parent1')>
    	  DELETE
    	</button>
      </span>
      <span>{value}</span>
    </div>
  )
}
```
