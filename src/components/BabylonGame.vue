<template>
  <div>
    <h3>BabylonGame</h3>
    <canvas></canvas>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { CarExplorer } from '../BabylonGame/CarExplorer';

export default defineComponent({
  name: 'BabylonGame',
  mounted() {
    const canvas = document.querySelector("canvas")!;
    new CarExplorer(canvas);
  }
});
</script>

<style scoped>

canvas {
  width: 70%;
  height: 70%;
}

</style>
