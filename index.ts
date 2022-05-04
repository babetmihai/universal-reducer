/*
  Redux Store and Actions
  This will use the lodash _.get, _.set, _.unset and _.update syntax to interact with the state
  https://lodash.com/docs/4.17.21#set
*/
import setWith from "lodash/fp/setWith";
import unset from "lodash/fp/unset";
import updateWith from "lodash/fp/updateWith";
import get from 'lodash/get'
import isNil from 'lodash/isNil'
import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'
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


type IPath = Array<string | number> | string | number


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




const pathJoin = (...args) => {
  return args.filter(Boolean).flat()
}

export const createActions = (store, basePath?) => ({
  /**
   *  Gets the value at path of the state object. If the resolved value is undefined, the defaultValue is returned in its place. https://lodash.com/docs/4.17.21#get
  */
  get: (...args: [path: IPath, defautValue?: any] | []): any => {
    let state = store.getState()
    if (basePath) state = get(state, basePath, EMPTY_OBJECT)
    if (args.length === 0) return state
    if (args.length > 0) {
      const [path, defaultValue] = args
      return get(state, path, defaultValue)
    }
  },
  /**
   *  Sets the value at path of the state object. If a portion of path doesn't exist, it's created. https://lodash.com/docs/4.17.21#set
  */
  set: (...args: [path: IPath, payload: any] | [payload: any]): void => {
    if (args.length === 1) {
      const [payload] = args
      store.dispatch({
        type: 'Set',
        payload,
        method: SET,
        path: basePath
      })
    }
    if (args.length > 1) {
      const [path, payload] = args
      store.dispatch({
        type: `Set: ${path}`,
        path: pathJoin(basePath, path),
        payload,
        method: SET
      })
    }
  },
  /**
   *  This method is like set except that accepts updater to produce the value to set. https://lodash.com/docs/4.17.21#update
  */
  update: (...args: [path: IPath, payload: Function | object] | [payload: Function | object]): void => {
    if (args.length === 1) {
      const [payload] = args
      store.dispatch({
        type: 'Update',
        payload,
        method: UPDATE,
        path: basePath
      })
    }
    if (args.length > 1) {
      const [path, payload] = args
      store.dispatch({
        type: `Update: ${path}`,
        path: pathJoin(basePath, path),
        payload,
        method: UPDATE
      })
    }
  },
  /**
   *  Removes the property at path of state object. https://lodash.com/docs/4.17.21#unset
  */
  unset: (...args: [path: IPath] | []): void => {
    if (args.length === 0) {
      store.dispatch({
        type: `Unset`,
        method: UNSET,
        path: basePath
      })
    }
    if (args.length > 0) {
      const [path] = args
      store.dispatch({
        type: `Unset: ${path}`,
        path: pathJoin(basePath, path),
        method: UNSET
      })
    }
  },
  /**
   *  Creates a new actions module localized at the path of the state object. 
   */
  create: (modulePath: IPath) => createActions(store, pathJoin(basePath, modulePath))
})