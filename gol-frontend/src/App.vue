<script setup>
  import * as _ from 'lodash'
  window._ = _
  import { computed, ref } from 'vue'

  import GameCell from './components/GameCell.vue'
  import {getInitState, updateState} from './game/state'


  // If you want to use Phoenix channels, run `mix help phx.gen.channel`
  // to get started and then uncomment the line below.
  import { channel } from "./phoenix/user_socket"

  const DEFAULT_ROWS = 20
  const DEFAULT_COLS = 20
  const MAX_ROWS = 80
  const MAX_COLS = 80
  const INTERVAL_MILLIS = 500

  const DEFAULT_CELLS_SIZE = 20
  const MAX_CELLS_SIZE = 80



  const iterateGame = (rows, cols, state) => {
    state.value = updateState(rows, cols, state.value)
  }


  const startGame = (state, intervalMillis) => {
    const rows = _.size(state.value)
    const cols = _.size(_.first(state.value))
    return setInterval(() => iterateGame(rows, cols, state), intervalMillis)
  }


  const numRows = ref(DEFAULT_ROWS)
  const numCols = ref(DEFAULT_COLS)
  const cellSize = ref(DEFAULT_CELLS_SIZE)

  const initialState = getInitState(numRows.value, numCols.value)
  const gameState = ref(initialState)
  const timer = ref(null)
  timer.value = startGame(gameState, INTERVAL_MILLIS)


  const cellStyle = computed(() => {
    return `
      width: ${cellSize.value}px;
      height: ${cellSize.value}px;
    `
  })


  const toggleCell = (rowIdx, colIdx) => {
    const cell = gameState.value[rowIdx][colIdx]
    gameState.value[rowIdx][colIdx] = !cell
    pushState(gameState.value)
  }


  const togglePlayPause = () => {
    if (timer.value) {
      doPause()
      pushPlayPause(false)
    } else {
      doPlay()
      pushPlayPause(true)
    }
  }


  const doPlay = () => {
    if (timer.value) return
    timer.value = startGame(gameState, INTERVAL_MILLIS)
  }


  const doPause = () => {
    if (!timer.value) return
    clearTimeout(timer.value)
    timer.value = null
  }


  const playPauseText = computed(() => {
    if (timer.value) return 'Pause'
    return 'Play'
  })


  const restartGame = () => {
    clearTimeout(timer.value)
    const initialState = getInitState(numRows.value, numCols.value)
    gameState.value = initialState
    timer.value = startGame(gameState, INTERVAL_MILLIS)
    pushState(initialState)
    pushPlayPause(true)
  }

  // Channels
  const pushState = (state) => {
    channel.push("push_state", {state: state})
  }

  channel.on("push_state", payload => {
    gameState.value = payload.state
  })

  const pushPlayPause = (isPlay) => {
    channel.push("push_play_pause", {is_play: isPlay})
  }

  channel.on("push_play_pause", payload => {
    payload.is_play ? doPlay() : doPause()
  })
</script>

<template>
  <div class="game">
    <div class="controls">
      <button
        @click="togglePlayPause"
        >{{ playPauseText }}</button>
      <button
        @click="restartGame"
        >Restart</button>
      Rows: {{ numRows }}
      <input
        type="range"
        min="2"
        :max="MAX_ROWS"
        v-model="numRows">
      Cols: {{ numCols }}
      <input
        min="2"
        :max="MAX_COLS"
        type="range"
        v-model="numCols">
      Cell Size: {{ cellSize }}
      <input
        min="10"
        :max="MAX_CELLS_SIZE"
        type="range"
        v-model="cellSize">
    </div>
    <div class="grid">
      <div
        v-for="rowIdx in _.range(_.size(gameState))"
        class="row"
        :key="rowIdx"
        :class="'row'-rowIdx"
        >
        <game-cell
          v-for="colIdx in _.range(_.size(_.first(gameState)))"
          :key="colIdx"
          :cell-state="gameState[rowIdx][colIdx]"
          @toggle-cell="toggleCell(rowIdx, colIdx)"
          :style="cellStyle"
          :row-idx="rowIdx"
          :col-idx="colIdx"
          :game-state="gameState"
          ></game-cell>
      </div>
    </div>
  </div>
</template>

<style scoped>

  .game {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  .controls {
    position: fixed;
    top: 10px;
    height: 100px;
  }
  .grid {
    cursor: pointer;
    display: grid;
    justify-content: center;
    align-content: center;
    height: calc(100vh - 100px);
    border-radius: 20px;
  }

  .row {
    display: flex;
    flex-direction: row;
  }
</style>