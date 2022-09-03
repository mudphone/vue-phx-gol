<script setup>
  import { computed } from 'vue'



  const emit = defineEmits(['toggleCell'])


  const props = defineProps({
    cellState: Boolean,
    rowIdx: Number,
    colIdx: Number,
    gameState: Array,
  })

  
  const cellClick = () => {
    emit('toggleCell')
  }


  const cellClasses = computed(() => {
    const highestRow = _.size(props.gameState) - 1
    const highestCol = _.size(_.first(props.gameState)) - 1
    return {
      'cell-top-left': props.rowIdx === 0 && props.colIdx === 0,
      'cell-top-right': props.rowIdx === 0 && props.colIdx === highestCol,
      'cell-bottom-right': props.rowIdx === highestRow && props.colIdx === highestCol,
      'cell-bottom-left': props.rowIdx === highestRow && props.colIdx === 0,
      'alive': props.cellState,
      'empty': !props.cellState
    }
  })
</script>

<template>
  <div
    class="cell"
    :class="cellClasses"
    @click="cellClick"
    >
  </div>
</template>

<style scoped>
  .cell {
    border: 0.05px dotted white;
  }

  .alive {
    background-color: #585836;
    border: none;
  }

  .alive:hover {
    background-color: red;
    border: none;
  }

  .empty {
    background-color: #252E21;
    border: 0.01px dotted #293728;
  }

  .empty:hover {
    background-color: green;
    opacity: 1.0;
    border: none;
  }

  .cell-top-left {
    border-top-left-radius: 10px;
  }
  .cell-top-right {
    border-top-right-radius: 10px;
  }
  .cell-bottom-right {
    border-bottom-right-radius: 10px;
  }
  .cell-bottom-left {
    border-bottom-left-radius: 10px;
  }
</style>