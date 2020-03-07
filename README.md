Reducer and store wrapper that uses paths to update nested values. The path syntax is the same as  _.set and _.get form lodash

### Instalation
```
npm instal save universal-reducer
```
### Setup
```
import { createStore } from 'redux'
import { reducer, createActions } from 'universal-reducer'

const store = createStore(reducer)

export const actions = createActions(store)
export default store
```
### Usage
```
import store, { actions } from 'store'

console.log(store.getState()) // {}
```
##### Set
Set nested value using the _.set function
https://lodash.com/docs/4.17.15#set
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
Set nested value using the _.update function
https://lodash.com/docs/4.17.15#update
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
##### Unset
Unset a nested value using the _.unset function
https://lodash.com/docs/4.17.15#unset
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

##### Merge
Set nested value using the _.merge function
https://lodash.com/docs/4.17.15#merge
```
actions.merge('parent.child1', { child2: '123' })
```

console.log(store.getState())
```
{
  parent: {
    child1: {
      child3: '234',
      child2: '123'
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