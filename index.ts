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


const SET = "@@SET";
const UPDATE = "@@UPDATE";
const UNSET = "@@UNSET";


type IAction = {
  type: any;
  method: string;
  payload: any;
}

type IPath = Array<string | number> | string | number

const reducer = (
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


export const createActions = (store, options: any = {}) => {
  const {
    idGenerator = () => shortid.generate()
  } = options

  const actions = {
    /**
     *  Gets the value at path of the state object. If the resolved value is undefined, the defaultValue is returned in its place. https://lodash.com/docs/4.17.21#get
    */
    get: (path: IPath, defautValue?: any): any => get(store.getState(), path, defautValue),
    /**
     *  Sets the value at path of the state object. If a portion of path doesn't exist, it's created. https://lodash.com/docs/4.17.21#set
    */
    set: (path: IPath, payload: any): void => store.dispatch({ type: path, payload, method: SET }),
    /**
     *  This method is like set except that accepts updater to produce the value to set. https://lodash.com/docs/4.17.21#update
    */
    update: (path: IPath, payload: Function): void => store.dispatch({ type: path, payload, method: UPDATE }),
    /**
     *  Removes the property at path of state object. https://lodash.com/docs/4.17.21#unset
    */
    unset: (path: IPath): void => store.dispatch({ type: path, method: UNSET }),
    push: (path, payload) => {
      const id = idGenerator()
      if (payload === undefined) {
        return {
          id,
          set: (item: any) => store.dispatch({
            type: `${path}.${id}`,
            payload: item,
            method: SET
          })
        }
      } else {
        store.dispatch({
          type: `${path}.${id}`,
          payload,
          method: SET
        })
      }
    },
    ref: (path) => {
      return Object.keys(actions).reduce((acc, method) => {
        acc[method] = (_path, ...args) => actions[method](`${path}.${_path}`, ...args)
        return acc
      }, {})
    }
  }

  return actions
}


export default reducer



