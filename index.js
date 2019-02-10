import set from 'lodash/fp/set'
import unset from 'lodash/fp/unset'
import update from 'lodash/fp/update'
import isPlainObject from 'lodash/isPlainObject'
import get from 'lodash/get'

export const createReducer = (actionTypes) => {
  const reducer = (state = {}, action = {}) => {
    const { type, path = '', payload } = action
    if (type === actionTypes.set) return set(path, payload, state)
    if (type === actionTypes.delete) return unset(path, state)
    if (type === actionTypes.update) return update(path, (value) => {
      if (isPlainObject(value) && isPlainObject(payload)) {
        return { ...value, ...payload }
      } else {
        return payload
      }
    }, state)
    return state
  }
  return reducer
}

export const createStoreApi = ({ store, actionTypes }) => ({
  select: (selector) => selector(store.getState()),
  get: (path, defautValue) => get(store.getState(), path, defautValue),
  set: (path, payload) => new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        store.dispatch({
          path,
          payload,
          type: actionTypes.set
        })
        return resolve(payload)
      } catch (error) {
        return reject(error)
      }
    }, 0)
  }),
  delete: (path) => new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        store.dispatch({
          path,
          type: actionTypes.delete
        })
        return resolve()
      } catch (error) {
        return reject(error)
      }
    }, 0)
  }),
  update: (path, payload) => new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        store.dispatch({
          path,
          payload,
          type: actionTypes.update
        })
        return resolve(payload)
      } catch (error) {
        return reject(error)
      }
    }, 0)
  })
})
