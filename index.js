/*
  Redux Store and Actions
  This will use the lodash _.get, _.set, _.unset and _.update syntax to interact with the state
  https://lodash.com/docs/4.17.21#set
*/
import isString from "lodash/isString";
import setWith from "lodash/fp/setWith";
import castArray from "lodash/castArray";
import unset from "lodash/fp/unset";
import updateWith from "lodash/fp/updateWith";
import get from 'lodash/get'
import isNil from 'lodash/isNil'
import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'
import isEmpty from 'lodash/isEmpty'
import { legacy_createStore } from 'redux'


export * from 'redux'
export * from 'react-redux'


const EMPTY_OBJECT = {}

const SET = "@@SET";
const UPDATE = "@@UPDATE";
const UNSET = "@@UNSET";



export const createStore = (middleware) => legacy_createStore(reducer, EMPTY_OBJECT, middleware)
export const createActions = (store, basePath) => {
  const _basePath = basePath
  const actions = {
    /**
     *  Gets the value at path of the state object. If the resolved value is undefined, the defaultValue is returned in its place. https://lodash.com/docs/4.17.21#get
    */
    get: (...args) => {
      let _path
      let defaultValue = EMPTY_OBJECT
      if (args.length > 0) [_path, defaultValue] = args
      const path = join(_basePath, _path)
      if (!path) return store.getState()
      return get(store.getState(), path, defaultValue)
    },
    /**
     *  Sets the value at path of the state object. If a portion of path doesn't exist, it's created. https://lodash.com/docs/4.17.21#set
    */
    set: (...args) => {
      let _path
      let [payload] = args
      if (args.length > 1) [_path, payload] = args
      const path = join(_basePath, _path)
      store.dispatch({
        type: `Set ${stringify(path)}`,
        path,
        payload,
        method: SET
      })
    },
    /**
     *  This method is like set except that accepts updater to produce the value to set. https://lodash.com/docs/4.17.21#update
    */
    update: (...args) => {
      let _path
      let [payload] = args
      if (args.length > 1) [_path, payload] = args
      const path = join(_basePath, _path)
      store.dispatch({
        type: `Update ${stringify(path)}`,
        path,
        payload,
        method: UPDATE
      })
    },
    /**
     *  Removes the property at path of state object. https://lodash.com/docs/4.17.21#unset
    */
    unset: (...args) => {
      const [_path] = args
      const path = join(_basePath, _path)
      store.dispatch({ 
        type: `Unset ${stringify(path)}`, 
        path, 
        method: UNSET 
      })
    },
    /**
     *  Creates new actions module with a base path
    */
    create: (basePath) => createActions(store, join(_basePath, basePath))
  }

  return actions
}


const reducer = (state = EMPTY_OBJECT, action) => {
  const { path, method, payload } = action
  switch (method) {
    case SET: {
      if (isNil(path)) return payload
      return setWith(Object, path, payload, state)
    }
    case UPDATE: {
      if (isNil(payload)) return state
      if (isNil(path)) {
        if (isFunction(payload)) return payload(state)
        if (isPlainObject(state) && isPlainObject(payload)) {
          return { ...state, ...payload }
        }
        return payload
      } else {
        if (isFunction(payload)) return updateWith(Object, path, payload, state)
        return updateWith(Object, path, (value) => {
          if (isPlainObject(value) && isPlainObject(payload)) {
            return { ...value, ...payload }
          } else {
            return payload
          }
        }, state)
      }
    }
    case UNSET: {
      if (isNil(path)) return EMPTY_OBJECT
      return unset(path, state);
    }
    default: return state;
  }
};



const join = (...args) => {
  const _path = args
    .filter(Boolean)
    .map((path) => {
      if (isString(path)) return path.split('.')
      return path
    })
    .flat()
    
  if (!isEmpty(_path)) return _path
  return undefined
}


const stringify = (path) => castArray(path).filter(Boolean).join('.')