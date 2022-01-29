/*
  Redux Store and Actions
  This will use the lodash _.get, _.set, _.unset and _.update syntax to interact with the state
  https://lodash.com/docs/4.17.21#set
*/
import setWith from "lodash/fp/setWith";
import unset from "lodash/fp/unset";
import updateWith from "lodash/fp/updateWith";
import { createStore } from "redux";
import _ from "lodash";


const EMPTY_OBJECT = {};

const STATE_KEY = "simago-state";
const PERSISTENT_PATHS = [
  "user",
  "layout",
  "widgets",
  "widgetData.weather",
  "widgetData.todos",
  "shortcuts"
];

const SET = "@SET";
const UPDATE = "@UPDATE";
const UNSET = "@UNSET";
const CLEAR = "@CLEAR";
const INIT = "@INIT"


export const reducer = (state: any = EMPTY_OBJECT, action: any = EMPTY_OBJECT) => {
  const { type, method, payload } = action;

  switch (method) {
    case INIT: return payload
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
    case CLEAR: return EMPTY_OBJECT;
    default: return state;
  }
};


const store = createStore(
  reducer,
  EMPTY_OBJECT,
  // @ts-ignore
  global.__REDUX_DEVTOOLS_EXTENSION__?.()
);


export const actions = {
  get: (path: string, defautValue?: any): any => _.get(store.getState(), path, defautValue),
  set: (path: string, payload: any) => store.dispatch({ type: path, payload, method: SET }),
  unset: (path: string) => store.dispatch({ type: path, method: UNSET }),
  update: (path: string, payload: Function | Object) => store.dispatch({ type: path, payload, method: UPDATE }),
  clear: () => store.dispatch({ type: CLEAR, method: CLEAR }),
  init: (payload: any) => store.dispatch({
    type: INIT,
    method: INIT,
    payload
  })
};


export const initStore = async () => {
  try {
    const persistentState = localStorage.getItem(STATE_KEY)
    const state = JSON.parse(persistentState) || EMPTY_OBJECT
    actions.init(state)
    store.subscribe(saveState)
  } catch (error) {
    console.error(error)
  }
}

const saveState = _.debounce(async () => {
  try {
    const state = store.getState()
    const persistentState = _.pick(state, PERSISTENT_PATHS)
    localStorage.setItem(STATE_KEY, JSON.stringify(persistentState))
  } catch (error) {
    console.error(error)
  }
}, 250, { leading: false, trailing: true })


export default store;

export type RootState = ReturnType<typeof store.getState>;