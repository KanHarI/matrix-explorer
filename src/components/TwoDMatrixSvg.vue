<template>
  <svg></svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RatioRootsSquareMatrix } from "../math/RatioRootsSquareMatrix";

export default defineComponent({
  props: {
    matrix: {
      type: RatioRootsSquareMatrix,
      required: true,
    },
  },
  methods: {},
});
</script>

<style scoped></style>
