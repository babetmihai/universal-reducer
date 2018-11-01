Since all reducers and custom implementations on get and set, why not actually <b>get</b> and <b>set</b>?

Reducer and store wrapper that uses paths to update nested values.

The path syntax is the same as  _.set and _get form lodash
and it's the only reducer you will ever need


### Instalation
```
npm instal save universal-reducer
```
### Setup
```
import { createStore } from 'redux'
import { reducer, createStoreApi } from 'universal-reducer'

const store = createStore(reducer)

export const storeApi = createStoreApi(store)
export default store
```
### Usage
```
import store, { storeApi } from 'store'

console.log(store.getState()) // {}

storeApi.set('parent.child1.child2', '123')
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

storeApi.update('parent.child1.child3', '234')
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

storeApi.delete('parent.child1.child2')
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

const child = storeApi.get('parent.child1.child3')
console.log(child)  // 234

const child = storeApi.get('parent.child4', 'defaultValue')
console.log(child)  // defaultValue

const selector = (state) => state.parent
const child = storeApi.select(selector)
console.log(child)
/*
{
  child1: {
    child3: '234'
  }
}
*/
```
