<template>
  <canvas></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Game } from '../BabylonGame/Game';

export default defineComponent({
  name: 'BabylonGame',
  mounted() {
    const canvas = document.querySelector('canvas')!;
    canvas.classList.add('absolute-full');
    new Game(canvas);
  },
});
</script>

<style scoped>
canvas {
  -moz-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  user-select: none;
  outline: none;
}
</style>
