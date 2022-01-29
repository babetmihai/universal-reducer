/*
  Redux Store and Actions
  This will use the lodash _.get, _.set, _.unset and _.update syntax to interact with the state
  https://lodash.com/docs/4.17.21#set
*/
import setWith from "lodash/fp/setWith";
import unset from "lodash/fp/unset";
import updateWith from "lodash/fp/updateWith";
import _ from "lodash";


const EMPTY_OBJECT = {};



const SET = "@SET";
const UPDATE = "@UPDATE";
const UNSET = "@UNSET";


export const reducer = (state: any = EMPTY_OBJECT, action: any = EMPTY_OBJECT) => {
  const { type, method, payload } = action;

  switch (method) {
    case SET: {
      if (_.isNil(payload)) return unset(type, state);
      return setWith(Object, type, payload, state);
    }
    case UPDATE: {
      if (_.isNil(payload)) return state;
      if (_.isFunction(payload)) return updateWith(Object, type, payload, state);
      return updateWith(
        Object,
        type,
        (value) => {
          if (_.isPlainObject(value) && _.isPlainObject(payload)) {
            return { ...value, ...payload };
          } else {
            return payload;
          }
        },
        state
      );
    }
    case UNSET: return unset(type, state);
    default: return state;
  }
};





export const createActions = (store) => ({
  get: (path: string, defautValue?: any): any => _.get(store.getState(), path, defautValue),
  set: (path: string, payload: any) => store.dispatch({ type: path, payload, method: SET }),
  unset: (path: string) => store.dispatch({ type: path, method: UNSET }),
  update: (path: string, payload: Function | Object) => store.dispatch({ type: path, payload, method: UPDATE })
})
