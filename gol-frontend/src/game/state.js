import * as _ from 'lodash'



const EMPTY = false // empty
const ALIVE = true // alive


export const getInitState = (rows, cols) => {
  const s = []
  _.forEach(_.range(rows), () => {
    s.push(_.fill(Array(cols), EMPTY))
  })
  _.forEach(_.range(rows), r => {
    _.forEach(_.range(cols), c => {
      if (_.random(10) >= 5) {
        s[r][c] = ALIVE
      }
    })
  })
  return s
}


export const updateState = (rows, cols, oldState) => {
  const newState = _.cloneDeep(oldState)
  _.forEach(_.range(rows), r => {
    _.forEach(_.range(cols), c => {
      newState[r][c] = cellState(rows, cols, r, c, oldState)
    })
  })
  return newState
}

const cellState = (rows, cols, rowIdx, colIdx, state) => {
  const cell = state[rowIdx][colIdx]
  const neighbors = neighborsFor(rows, cols, rowIdx, colIdx)
  if (cell) {
    // cell is alive
    let numLiveNeighbors = 0
    _.forEach(neighbors, ([r, c]) => {
      if (state[r][c]) {
        numLiveNeighbors++
      }
      if (numLiveNeighbors > 3) {
        return false // break
      }
    })
    if (numLiveNeighbors === 2 || numLiveNeighbors === 3) {
      return ALIVE
    }

  } else {
    // cell is dead
    let numLiveNeighbors = 0
    _.forEach(neighbors, ([r, c]) => {
      if (state[r][c]) {
        numLiveNeighbors++
      }
      if (numLiveNeighbors > 4) {
        return false // break
      }
    })
    if (numLiveNeighbors === 3) {
      return ALIVE
    }

  }

  return EMPTY
}

const neighborsFor = (rows, cols, rowIdx, colIdx) => {
  const n = []
  for (let r = rowIdx - 1; r <= rowIdx + 1; r++) {
    for (let c = colIdx - 1; c <= colIdx + 1; c++) {
      if (r >= 0 && r < rows && c >= 0 && c <= cols && !_.isEqual([r, c], [rowIdx, colIdx])) {
        n.push([r, c])
      }
    }
  }
  return n
}
