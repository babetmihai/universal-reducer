import setWith from 'lodash/fp/setWith'
import unset from 'lodash/fp/unset'
import updateWith from 'lodash/fp/updateWith'
import isPlainObject from 'lodash/isPlainObject'
import get from 'lodash/get'
import isNil from 'lodash/isNil'
import isFunction from 'lodash/isFunction'

export const createReducer = (actionTypes) => {
  const reducer = (state = {}, action = {}) => {
    const { type, path, payload } = action
    if (!path) {
      switch (type) {
        case (actionTypes.set): {
          if (isNil(payload)) return ({})
          return payload
        }
        case (actionTypes.update):
          switch (true) {
            case (isNil(payload)): return state
            case (isFunction(payload)): return payload(state)
            case (isPlainObject(state) && isPlainObject(payload)):
              return { ...state, ...payload }
            default: return payload
          }
        case (actionTypes.delete): return ({})
        default: return state
      }
    } else {
      switch (type) {
        case (actionTypes.set): {
          if (isNil(payload)) return unset(path, state)
          return setWith(Object, path, payload, state)
        }
        case (actionTypes.update):
          switch (true) {
            case (isNil(payload)): return state
            case (isFunction(payload)):
              return updateWith(Object, path, payload, state)
            default: return updateWith(Object, path, (value) => {
              if (isPlainObject(value) && isPlainObject(payload)) {
                return { ...value, ...payload }
              } else {
                return payload
              }
            }, state)
          }
        case (actionTypes.delete): return unset(path, state)
        default: return state
      }
    }
  }
  return reducer
}

export const createStoreApi = ({ store, actionTypes }) => ({
  select: (selector) => selector(store.getState()),
  get: (path, defautValue) => get(store.getState(), path, defautValue),
  set: (path, payload) => store.dispatch({ path, payload, type: actionTypes.set }),
  delete: (path) => store.dispatch({ path, type: actionTypes.delete }),
  update: (path, payload) => store.dispatch({ path, payload, type: actionTypes.update })
})
