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
