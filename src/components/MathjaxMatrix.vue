<template>
  <div>
    <vue-mathjax :formula="'$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}$$'" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ComplexRationalSquarePolyMatrix } from "../math/ComplexRationalSquarePolyMatrix";

export default defineComponent({
  name: "MathjaxMatrix",
  props: {
    matrix: {
      type: ComplexRationalSquarePolyMatrix,
      required: true,
    },
  },
});
</script>

<style scoped></style>
