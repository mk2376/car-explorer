<template>
  <div>
    <BabylonGame active></BabylonGame>
  </div>
</template>

<script lang="ts">
import BabylonGame from 'components/BabylonGame.vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PageIndex',
  components: { BabylonGame },
});
</script>
