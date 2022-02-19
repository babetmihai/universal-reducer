/*
  Redux Store and Actions
  This will use the lodash _.get, _.set, _.unset and _.update syntax to interact with the state
  https://lodash.com/docs/4.17.21#set
*/
import setWith from "lodash/fp/setWith";
import unset from "lodash/fp/unset";
import updateWith from "lodash/fp/updateWith";
import get from 'lodash/get'
import shortid from 'shortid'
export * from 'react-redux'

const SET = "@@SET";
const UPDATE = "@@UPDATE";
const UNSET = "@@UNSET";


type IAction = {
  type: any;
  method: string;
  payload: any;
}

type IPath = Array<string | number> | string | number
type IOptions = {
  /**
   *  Random id generator when using the push action. By defaullt, shortid.generate is usedd.
   */
  keygen?: Function;
}


export const reducer = (
  state: any = {},
  action: IAction
) => {
  const { type: path, method, payload } = action
  switch (method) {
    case SET: return setWith(Object, path, payload, state);
    case UPDATE: return updateWith(Object, path, payload, state);
    case UNSET: return unset(path, state);
    default: return state;
  }
};


export const createActions = (store, options: IOptions = {}) => {
  const {
    keygen = () => shortid.generate()
  } = options

  const actions = {
    /**
     *  Gets the value at path of the state object. If the resolved value is undefined, the defaultValue is returned in its place. https://lodash.com/docs/4.17.21#get
    */
    get: (path: IPath, defautValue?: any): any => get(store.getState(), path, defautValue),
    /**
     *  Sets the value at path of the state object. If a portion of path doesn't exist, it's created. https://lodash.com/docs/4.17.21#set
    */
    set: (path: IPath, payload: any): void => store.dispatch({
      type: path,
      payload,
      method: SET
    }),
    /**
     *  This method is like set except that accepts updater to produce the value to set. https://lodash.com/docs/4.17.21#update
    */
    update: (path: IPath, payload: Function): void => store.dispatch({
      type: path,
      payload,
      method: UPDATE
    }),
    /**
     *  Removes the property at path of state object. https://lodash.com/docs/4.17.21#unset
    */
    unset: (path: IPath): void => store.dispatch({
      type: path,
      method: UNSET
    }),
    /**
     *  Pushes a new value to a key-value object. The key is randomly generated.
     */
    push: (...args: [path: IPath, payload?: any]) => {
      const key: IPath = keygen()

      if (args.length === 1) {
        const [path] = args
        return {
          key,
          set: (value: any): void => store.dispatch({
            type: `${path}.${key}`,
            payload: value,
            method: SET
          })
        }
      }

      if (args.length > 1) {
        const [path, payload] = args
        return store.dispatch({
          type: `${path}.${key}`,
          payload,
          method: SET
        })
      }
    },
    /**
     *  Creates a new actions module localized at the path of the state object. 
     */
    path: (path: IPath) => {
      return Object.keys(actions)
        .reduce((acc, key) => {
          acc[key] = (_path, ...args) => actions[key](`${path}.${_path}`, ...args)
          return acc
        }, {})
    }
  }

  return actions
}




