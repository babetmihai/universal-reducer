import set from 'lodash/fp/set'
import unset from 'lodash/fp/unset'
import isPlainObject from 'lodash/isPlainObject'
import get from 'lodash/get'

export const createReducer = (actionType) => {
  const reducer = (state = {}, action = {}) => {
    const { type, path = '', payload } = action
    if (type === actionType) {
      if (payload) return set(path, payload, state)
      return unset(path, state)
    }
    return state
  }
  return reducer
}

export const createStoreApi = ({ store, actionType }) => ({
  select: (selector) => selector(store.getState()),
  get: (path, defautValue) => get(store.getState(), path, defautValue),
  set: (path, payload) => new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        store.dispatch({
          path,
          payload,
          type: actionType
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
          type: actionType
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
        const value = get(store.getState(), path)
        if (isPlainObject(value) && isPlainObject(payload)) {
          store.dispatch({
            path,
            payload: { ...value, ...payload },
            type: actionType
          })
        } else {
          store.dispatch({
            path, payload,
            type: actionType
          })
        }
        return resolve(payload)
      } catch (error) {
        return reject(error)
      }
    }, 0)
  })
})
