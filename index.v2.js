
const state = {}
const listeners = []
const reducer = ({ state, path, payload }) => {
  const keys = path.split('.').filter(Boolean)
  switch (true) {
    case (keys.length === 0): return payload
    case (keys.length === 1): return _.omitBy({
      ...state,
      [keys[0]]: payload
    }, _.isNil)
    default: return {
      ...state,
      [keys[0]]: reducer({
        state: state[keys[0]],
        path: keys.slice(1).join('.'),
        payload
      })
    }
  }
}

export const setState = (path, payload) => new Promise((resolve, reject) => {
  try {
    state = reducer({ state, path, payload })
    listeners.forEach((listener) => listener())
    return resolve(state)
  } catch (error) {
    return reject(error)
  }
})

export const updateState = (path, payload) => {
  const value = _.get(state, path)
   if (_.isObject(value) && _.isObject(payload)) {
    return setState(path, { ...value, ...payload })
  } else {
    return setState(path, payload)
  }
}

export const deleteState = (path) => setState(path)
export const getState = (path, defautValue) => _.get(state, path, defaultValue)
export const selectState = (selector) => selector(state)

export default {
  set: setState, 
  get: getState, 
  delete: deleteState, 
  update: updateState
}

export const connect = (Component) => {
  class Connected extends React.Component {
    
    constructor(props) {
      super(props)
      this.index = listeners.length
      listeners.push(this.forceUpdate)
    }

    componentWillUnmount() {
      listeners.splice(this.index, 1);
    }

    render() {
      return (<Component {...this.props} />)
    }
  }
  return Connected
}
