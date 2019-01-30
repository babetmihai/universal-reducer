import clone from 'lodash/clone'
import isNil from 'lodash/isNil'
import isPlainObject from 'lodash/isPlainObject'
import get from 'lodash/get'

export const UNIVERSAL_ACTION_TYPE = '@@universal_reducer'

export const reducer = (state = {}, action = {}) => {
  const { type, path = '', payload } = action
  if (type === UNIVERSAL_ACTION_TYPE) {
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
        type: UNIVERSAL_ACTION_TYPE,
        path: keys.slice(1).join('.')
      })
    }
    return newState
  } else {
    return state
  }

}

export const createStoreApi = (store) => ({
  select: (selector) => selector(store.getState()),
  get: (path, defautValue) => get(store.getState(), path, defautValue),
  set: (path, payload) => new Promise((resolve, reject) => {
    try {
      store.dispatch({
        path,
        payload,
        type: UNIVERSAL_ACTION_TYPE
      })
      return resolve(payload)
    } catch (error) {
      return reject(error)
    }
  }),
  delete: (path) => new Promise((resolve, reject) => {
    try {
      store.dispatch({
        path,
        type: UNIVERSAL_ACTION_TYPE
      })
      return resolve()
    } catch (error) {
      return reject(error)
    }
  }),
  update: (path, payload) => new Promise((resolve, reject) => {
    try {
      const value = get(store.getState(), path)
      if (isPlainObject(value) && isPlainObject(payload)) {
        store.dispatch({
          path,
          payload: { ...value, ...payload },
          type: UNIVERSAL_ACTION_TYPE
        })
      } else {
        store.dispatch({
          path, payload,
          type: UNIVERSAL_ACTION_TYPE
        })
      }
      return resolve(payload)
    } catch (error) {
      return reject(error)
    }
  })
})
