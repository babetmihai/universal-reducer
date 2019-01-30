const { reducer, UNIVERSAL_ACTION_TYPE } = require('./dist')
const assert = require('assert')

describe('test universal reducers', () => {
  it('should create a nested value', () => {
    const state = {}
    const newState = reducer(state, {
      type: UNIVERSAL_ACTION_TYPE,
      path: 'parent.child1.child2',
      payload: '123'
    })
    assert.deepEqual(newState, {
      parent: {
        child1: {
          child2: '123'
        }
      }
    })
  })

  it('should update a nested value', () => {
    const state = {
      parent: {
        child1: {
          child2: [{ value: '123' }]
        }
      }
    }
    const newState = reducer(state, {
      type: UNIVERSAL_ACTION_TYPE,
      path: 'parent.child1.child2.1.value',
      payload: '126'
    })
    assert.deepEqual(newState, {
      parent: {
        child1: {
          child2: [
            { value: '123' },
            { value: '126' }
          ]
        }
      }
    })
  })

  it('should delete delete a nested value', () => {
    const state = {
      parent: {
        child1: {
          child2: '123'
        }
      }
    }
    const newState = reducer(state, {
      type: UNIVERSAL_ACTION_TYPE,
      path: 'parent.child1.child2'
    })
    assert.deepEqual(newState, {
      parent: {
        child1: {}
      }
    })
  })
})

