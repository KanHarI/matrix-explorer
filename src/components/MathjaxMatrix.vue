<template>
  <div>
    <vue-mathjax :formula="formula" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ComplexRatioRootsPolySquareMatrix } from "../math/ComplexRatioRootsPolySquareMatrix";

export default defineComponent({
  name: "MathjaxMatrix",
  props: {
    matrix: {
      type: ComplexRatioRootsPolySquareMatrix,
      required: true,
    },
  },
  computed: {
    formula(): string {
      return this.matrix.toMathJax();
    },
  },
});
</script>

<style scoped></style>
