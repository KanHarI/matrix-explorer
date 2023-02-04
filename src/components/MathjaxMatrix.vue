<template>
  <div>
    <vue-mathjax :formula="formula" />
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
  computed: {
    formula(): string {
      return this.matrix.toMathJax();
    },
  },
});
</script>

<style scoped></style>
