import clone from 'lodash/clone'
import isNil from 'lodash/isNil'
import isPlainObject from 'lodash/isPlainObject'
import get from 'lodash/get'

export const createReducer = (actionType) => {
  const reducer = (state = {}, action = {}) => {
    const { type, path = '', payload } = action
    if (type === actionType) {
      const keys = path.split('.').filter(Boolean)
      if (keys.length === 0) return payload
      const key = keys[0]
      const newState = clone(state)
      if (keys.length === 1) {
        if (isNil(payload)) {
          delete newState[key]
        } else {
          newState[key] = payload
        }
      } else {
        newState[key] = reducer(state[key], {
          payload,
          type: actionType,
          path: keys.slice(1).join('.')
        })
      }
      return newState
    } else {
      return state
    }
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
