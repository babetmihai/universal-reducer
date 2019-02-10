Reducer and store wrapper that uses paths to update nested values. The path syntax is the same as  _.set and _get form lodash

Since all reducers and custom implementations on get and set, why not actually use a universal <b>get</b> and <b>set</b>?

### Instalation
```
npm instal save universal-reducer
```
### Setup

This is a simplified store configuration script:
```
import { createStore } from 'redux'
import { createReducer, createStoreApi } from 'universal-reducer'

const actionType = 'UNIVERSAL_REDUCER'
const store = createStore(createReducer(actionType))

export const storeApi = createStoreApi({ store, actionType })
export default store
```

### Usage
```
import store, { storeApi } from 'store'

console.log(store.getState()) // {}
```
###### Set

```
storeApi.set('parent.child1.child2', '123')
```
```
console.log(store.getState())
/*
{
  parent: {
    child1: {
      child2: '123'
    }
  }
}
*/
```
###### Update
```
storeApi.update('parent.child1.child3', '234')
```
```
console.log(store.getState())
/*
{
  parent: {
    child1: {
      child2: '123',
      child3: '234
    }
  }
}
*/
```
###### Delete
```
storeApi.delete('parent.child1.child2')
```
```
console.log(store.getState())
/*
{
  parent: {
    child1: {
      child3: '234
    }
  }
}
*/
```
###### Get
```
const child = storeApi.get('parent.child1.child3')
console.log(child)  // 234
```
```
const child = storeApi.get('parent.child4', 'defaultValue')
console.log(child)  // defaultValue
```
###### Select
```
const selector = (state) => state.parent
const child = storeApi.select(selector)
```
```
console.log(child)
/*
{
  child1: {
    child3: '234'
  }
}
*/
```
