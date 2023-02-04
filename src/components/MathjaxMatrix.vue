<template>
  <div>
    <vue-mathjax :formula="'$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$'" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MathjaxMatrix",
});
</script>

<style scoped></style>
