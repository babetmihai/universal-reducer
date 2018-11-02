
const state = {}
const listeners = []
const reducer = ({ state, path, payload }) => {
  const keys = path.split('.').filter(Boolean)
  switch (true) {
    case (keys.length === 0): return payload
    case (keys.length === 1): return omitBy({
      ...state,
      [keys[0]]: payload
    }, isNil)
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

export const set = (path, payload) => {
  state = reducer({ state, path, payload })
  listeners.forEach((listener) => listener(state))
  return state
}

export const update = (path, payload) => {
  const value = _.get(state, path)
   if (isObject(value) && isObject(payload)) {
    return set(path, { ...value, ...payload })
  } else {
    return set(path, payload)
  }
}

export const delete = (path) => set(path)

export const get = (path, defautValue) => _.get(state, path, defaultValue)
export const select = (selector) => selector(state)

const connect = (props) => (Component) => {
  class Connected extends React.Component {
    
    constructor(props) {
      super(props)
      this.state= state
      this.index = listeners.length
      listeners.push(this.setState)
    }

    componentWillUnmount() {
      listeners.splice(this.index, 1);
    }

    render() {
      return (<Connected {...props} {...this.props} />)
    }
  }
}
