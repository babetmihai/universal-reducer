import setWith from 'lodash/fp/setWith'
import unset from 'lodash/fp/unset'
import updateWith from 'lodash/fp/updateWith'
import merge from 'lodash/fp/merge'
import get from 'lodash/get'

const SET = '_SET'
const UPDATE = '_UPDATE'
const MERGE = '_MERGE'
const UNSET = '_UNSET'

export const reducer = (state = {}, action = {}) => {
  const { path, type, payload } = action

  switch (type) {
    case (SET): return setWith(Object, path, payload, state)
    case (UPDATE): return updateWith(Object, path, payload, state)
    case (MERGE): return updateWith(Object, path, (value) => merge(value, payload), state)
    case (UNSET): return unset(path, state)
    default: return state
  }
}

export const createActions = (store) => ({
  get: (path, defautValue) => get(store.getState(), path, defautValue),
  set: (path, payload) => store.dispatch({ path, payload, type: SET }),
  unset: (path) => store.dispatch({ path, type: UNSET }),
  merge: (path, payload) => store.dispatch({ path, payload, type: MERGE }),
  update: (path, payload) => store.dispatch({ path, payload, type: UPDATE })
})
