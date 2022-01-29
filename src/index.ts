/*
  Redux Store and Actions
  This will use the lodash _.get, _.set, _.unset and _.update syntax to interact with the state
  https://lodash.com/docs/4.17.21#set
*/
import setWith from "lodash/fp/setWith";
import unset from "lodash/fp/unset";
import updateWith from "lodash/fp/updateWith";
import { createStore } from "redux";
import get from 'lodash/get'


const EMPTY_OBJECT = {};

const SET = "@SET";
const UPDATE = "@UPDATE";
const UNSET = "@UNSET";
const INIT = "@INIT"


const reducer = (state: any = EMPTY_OBJECT, action: any = EMPTY_OBJECT) => {
  const { type, method, payload } = action;

  switch (method) {
    case INIT: return payload
    case SET:  return setWith(Object, type, payload, state);
    case UPDATE: return updateWith(Object, type, payload, state);
    case UNSET: return unset(type, state);
    default: return state;
  }
};


export const createUniversalStore = (initialState, ...middleware) => {
  const store:any = createStore(
    reducer,
    initialState,
    ...middleware
  )

  store.get = (path: string, defautValue?: any): any => get(store.getState(), path, defautValue)
  store.set = (path: string, payload: any) => store.dispatch({ type: path, payload, method: SET })
  store.unset = (path: string) => store.dispatch({ type: path, method: UNSET })
  store.update = (path: string, payload: Function) => store.dispatch({ type: path, payload, method: UPDATE })

  return store
}


export default reducer

