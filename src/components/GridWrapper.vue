<template>
  <div class="grid-wrapper">
    <div v-for="cell in cells" :key="cell.field_number" class="cell" :class="cell.status">
      {{ cell.field_number }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cells: {
      type: Array,
      required: true
    }
  }
};
</script>

<style scoped>
.grid-wrapper {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}

.cell {
  padding: 20px;
  background-color: lightgray;
}

.CLOSE {
  background-color: seagreen;
}
</style>