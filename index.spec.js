const assert = require('assert')
const get = require('lodash/get')
const { reducer } = require('./dist')

describe('test universal reducers', () => {
  it('should create a nested value', () => {
    const state = {}
    const newState = reducer(state, {
      type: '_SET',
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
          child2: [{ value: '123' }],
          child3: {}
        }
      }
    }
    const newState = reducer(state, {
      type: '_MERGE',
      path: 'parent.child1.child2.0',
      payload: { value: '1234', value2: '234', value3: '345' }
    })

    assert.deepEqual(newState, {
      parent: {
        child1: {
          child2: [
            {
              value: '1234',
              value2: '234',
              value3: '345'
            }
          ],
          child3: {}
        }
      }
    })

    const child3Path = 'parent.child1.child3'
    assert.deepEqual(
      get(state, child3Path) === get(newState, child3Path),
      true
    )

    const child2Path = 'parent.child1.child2'
    assert.deepEqual(
      get(state, child2Path) === get(newState, child2Path),
      false
    )

    const child1Path = 'parent.child1'
    assert.deepEqual(
      get(state, child1Path) === get(newState, child1Path),
      false
    )
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
      type: '_UNSET',
      path: 'parent.child1.child2'
    })
    assert.deepEqual(newState, {
      parent: {
        child1: {}
      }
    })
  })
})

