import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import isObject from 'lodash/isObject'
import get from 'lodash/get'

export const UNIVERSAL_ACTION_TYPE = '@@universal_reducer'

export const reducer = (state = {}, action = {}) => {
  const { type, path, payload } = action
  if (type === UNIVERSAL_ACTION_TYPE) {
    const keys = path.split('.').filter(Boolean)
    switch (true) {
      case (keys.length === 0): return payload
      case (keys.length === 1): return omitBy({
        ...state,
        [keys[0]]: payload
      }, isNil)
      default: return {
        ...state,
        [keys[0]]: reducer(state[keys[0]], {
          payload,
          type: UNIVERSAL_ACTION_TYPE,
          path: keys.slice(1).join('.')
        })
      }
    }
  } else {
    return state
  }
}

export const createApi = (store) => ({
  select: (selector) => selector(store.getState()),
  get: (path, defautValue) => get(store.getState(), path, defautValue),
  set: (path, payload) => new Promise((resolve, reject) => {
    try {
      store.dispatch({ path, payload, type: UNIVERSAL_ACTION_TYPE })
      return resolve(payload)
    } catch (error) {
      return reject(error)
    }
  }),
  delete: (path) => new Promise((resolve, reject) => {
    try {
      store.dispatch({ path, type: UNIVERSAL_ACTION_TYPE })
      return resolve()
    } catch (error) {
      return reject(error)
    }
  }),
  update: (path, payload) => new Promise((resolve, reject) => {
    try {
      const value = get(store.getState(), path)
      if (isObject(value) && isObject(payload)) {
        store.dispatch({ path, payload: { ...value, ...payload }, type: UNIVERSAL_ACTION_TYPE })
      } else {
        store.dispatch({ path, payload, type: UNIVERSAL_ACTION_TYPE })
      }
      return resolve(payload)
    } catch (error) {
      return reject(error)
    }
  })
})
