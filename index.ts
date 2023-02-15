/*
  Redux Store and Actions
  This will use the lodash _.get, _.set, _.unset and _.update syntax to interact with the state
  https://lodash.com/docs/4.17.21#set
*/
import setWith from "lodash/fp/setWith";
import defaultTo from 'lodash/defaultTo'
import unset from "lodash/fp/unset";
import updateWith from "lodash/fp/updateWith";
import get from 'lodash/get'
import isNil from 'lodash/isNil'
import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'
import isEmpty from 'lodash/isEmpty'
import { legacy_createStore } from 'redux'
import { useSelector as useLegacySelector } from 'react-redux'
export * from 'redux'
export * from 'react-redux'


const EMPTY_OBJECT = {}

const SET = "@@SET";
const UPDATE = "@@UPDATE";
const UNSET = "@@UNSET";


type IAction = {
  type: any;
  method: string;
  path: IPath;
  payload: any;
}

type IPath = any


export const reducer = (
  state: any = EMPTY_OBJECT,
  action: IAction
) => {
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

const join = (first: IPath, second: IPath) => {
  const _path =  [first, second].filter(Boolean).flat()
  if (!isEmpty(_path)) return _path
  return undefined
}


export const useSelector = (selector, defaultValue?) => {
  let value
  if (isFunction(selector)) {
    value = useLegacySelector(selector)
  } else {
    value = useLegacySelector((state) => get(state, selector))
  }
  return defaultTo(value, defaultValue)
}

export const createStore = legacy_createStore

export const createActions = (store) => {
  const actions = {
    basePath: '',
    /**
     *  Gets the value at path of the state object. If the resolved value is undefined, the defaultValue is returned in its place. https://lodash.com/docs/4.17.21#get
    */
    get: (...args: [path: IPath, defautValue?: any] | []): any => {
      if (args.length === 0) return store.getState()
      if (args.length > 0) {
        const [_path, defaultValue] = args
        const path = join(store.basePath, _path)
        return get(store.getState(), path, defaultValue)
      }
    },
    /**
     *  Sets the value at path of the state object. If a portion of path doesn't exist, it's created. https://lodash.com/docs/4.17.21#set
    */
    set: (...args: [path: IPath, payload: any] | [payload: any]): void => {
      let _path = ''
      let [payload] = args
      if (args.length > 1) [_path, payload] = args

      const path = join(store.basePath, _path)
      store.dispatch({
        type: `Set ${path}`,
        payload,
        path,
        method: SET
      })
    },
    /**
     *  This method is like set except that accepts updater to produce the value to set. https://lodash.com/docs/4.17.21#update
    */
    update: (...args: [path: IPath, payload: Function | object] | [payload: Function | object]): void => {
      let _path = ''
      let [payload] = args
      if (args.length > 1) [_path, payload] = args
      const path = join(store.basePath, _path)
      store.dispatch({
        type: `Update ${path}`,
        path,
        payload,
        method: UPDATE
      })
    },
    /**
     *  Removes the property at path of state object. https://lodash.com/docs/4.17.21#unset
    */
    unset: (...args: [path: IPath] | []): void => {
      const [_path] = args
      const path = join(store.basePath, _path)
      store.dispatch({ type: `Unset ${path}`, path, method: UNSET })
    },
    /**
     *  Removes the property at path of state object. https://lodash.com/docs/4.17.21#unset
    */
    create: (path) => {
      return {
        ...actions,
        basePath: join(actions.basePath, path)
      }
    }
  }

  return actions
}




