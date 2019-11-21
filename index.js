import setWith from 'lodash/fp/setWith'
import unset from 'lodash/fp/unset'
import updateWith from 'lodash/fp/updateWith'
import isPlainObject from 'lodash/isPlainObject'
import get from 'lodash/get'
import isNil from 'lodash/isNil'
import isFunction from 'lodash/isFunction'

const ACTION_TYPES = {
  set: '@@SET',
  update: '@@UPDATE',
  delete: '@@DELETE'
}

export const createReducer = (actionTypes = ACTION_TYPES) => (state = {}, action = {}) => {
  const { type, path, payload } = action
  if (!path) {
    switch (type) {
      case (actionTypes.set): {
        if (isNil(payload)) return {}
        return payload
      }
      case (actionTypes.update): {
        if (isNil(payload)) return state
        if (isFunction(payload)) return payload(state)
        if (isPlainObject(state) && isPlainObject(payload)) return { ...state, ...payload }
        return payload
      }
      case (actionTypes.delete): return {}
      default: return state
    }
  } else {
    switch (type) {
      case (actionTypes.set): {
        if (isNil(payload)) return unset(path, state)
        return setWith(Object, path, payload, state)
      }
      case (actionTypes.update): {
        if (isNil(payload)) return state
        if (isFunction(payload)) return updateWith(Object, path, payload, state)
        return updateWith(Object, path, (value) => {
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

export const createActions = ({ store, actionTypes = ACTION_TYPES }) => ({
  get: (path, defautValue) => get(store.getState(), path, defautValue),
  set: (path, payload) => store.dispatch({ path, payload, type: actionTypes.set }),
  delete: (path) => store.dispatch({ path, type: actionTypes.delete }),
  update: (path, payload) => store.dispatch({ path, payload, type: actionTypes.update })
})
