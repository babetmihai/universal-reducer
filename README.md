Reducer and store wrapper that uses paths to update nested values. The path syntax is the same as  _.set and _.get form lodash

### Instalation
```
npm instal save universal-reducer
```
### Setup

This is a simplified store configuration script:

Using the default action types, ``@@SET``, ``@@GET``, ``@@DELETE``:
```
import { createStore } from 'redux'
import { createReducer, createActions } from 'universal-reducer'

const store = createStore(createReducer())

export const actions = createActions({ store })
export default store
```

For custom action types:
```
import { createStore } from 'redux'
import { createReducer, createActions } from 'universal-reducer'

const actionTypes = {
  set: 'SET',
  delete: 'DELETE',
  update: 'UPDATE'
}
const store = createStore(createReducer(actionTypes))

export const actions = createActions({ store, actionTypes })
export default store
```

### Usage
```
import store, { actions } from 'store'

console.log(store.getState()) // {}
```
##### Set
Is used to set nested value:
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
##### Update
Is used to update a nested value using an object or a function
```
actions.update('parent.child1', { child3: '234' })
```
```
console.log(store.getState())

{
  parent: {
    child1: {
      child2: '123',
      child3: '234
    }
  }
}
```
##### Delete
Is used to delete a nested value and it's coresponding key:
```
actions.delete('parent.child1.child2')
```
```
console.log(store.getState())

{
  parent: {
    child1: {
      child3: '234
    }
  }
}
```
##### Get
Is used to retrieve a value from the store:
```
const child = actions.get('parent.child1.child3')
console.log(child)  // 234
```
```
const child = actions.get('parent.child4', 'defaultValue')
console.log(child)  // defaultValue
```