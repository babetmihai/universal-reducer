
const state = {}
const listeners = []


export const reducer = (state = {}, action = {}) => {
  const { type, path, payload } = action
  if (type === UNIVERSAL_ACTION_TYPE) {
    const keys = path.split('.').filter(Boolean)
    switch (true) {
      case (keys.length === 0): return payload
      case (keys.length === 1): return omitBy({
        ...state,
        [keys[0]]: payload
      }, isNil)
      default: return {
        ...state,
        [keys[0]]: reducer(state[keys[0]], {
          payload,
          type: UNIVERSAL_ACTION_TYPE,
          path: keys.slice(1).join('.')
        })
      }
    }
  } else {
    return state
  }
}

const set = (state) => {
  const newState = state
  listeners.forEach((listener) => listener(newState))
  return newState
}


const createListener = (updater) => {
  return {}
}

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
      reutrn (<Connected {...props} {...this.props} />)
    }
  }
}
