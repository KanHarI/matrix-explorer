<template>
  <h1>Main Page</h1>
  <p>Matrix order: <input v-model="order" max="10" type="number" /></p>
  <p>Input matrix of order {{ calculated_order }}:</p>
  <MatrixInput ref="matrix_input" :order="calculated_order" />
  <p>Original matrix:</p>
  <MathjaxMatrix
    v-if="original_matrix_for_display"
    :matrix="original_matrix_for_display"
  />
  <p>Staircase matrix:</p>
  <MathjaxMatrix
    v-if="staircase_matrix_for_display"
    :matrix="staircase_matrix_for_display"
  />
  <p>Inverse matrix:</p>
  <MathjaxMatrix
    v-if="inverse_matrix_for_display"
    :matrix="inverse_matrix_for_display"
  />
</template>

<script lang="ts">
import { defineComponent, nextTick } from "vue";
import MatrixInput from "../components/MatrixInput.vue";
import MathjaxMatrix from "../components/MathjaxMatrix.vue";
import { RationalSquareMatrix } from "../math/RationalSquareMatrix";
import { Rational } from "../math/Rational";
import { ComplexRatioRootsPolySquareMatrix } from "../math/ComplexRatioRootsPolySquareMatrix";

interface DataType {
  order: number;
  init: boolean;
}

export default defineComponent({
  name: "MainPage",
  components: { MathjaxMatrix, MatrixInput },
  data(): DataType {
    return {
      order: 2,
      init: true,
    };
  },
  computed: {
    calculated_order(): number {
      return Math.max(Math.min(Math.floor(this.order), 10), 2);
    },
    original_matrix(): RationalSquareMatrix | undefined {
      if (this.init) {
        return undefined;
      }
      if (this.$refs.matrix_input === undefined) {
        return undefined;
      }
      const entries = (
        this.$refs.matrix_input as { entries?: Array<Array<number>> }
      ).entries;
      if (entries === undefined) {
        return undefined;
      }
      return new RationalSquareMatrix(
        entries.map((row) => row.map((entry) => Rational.fromInt(entry)))
      );
    },
    original_matrix_for_display():
      | ComplexRatioRootsPolySquareMatrix
      | undefined {
      if (this.original_matrix === undefined) {
        return undefined;
      }
      return this.original_matrix.toComplexRatioRootsPolySquareMatrix();
    },
    gaussian_elimination_result():
      | undefined
      | [RationalSquareMatrix, RationalSquareMatrix, number] {
      if (this.original_matrix === undefined) {
        return undefined;
      }
      return this.original_matrix.gaussian_elimination();
    },
    staircase_matrix_for_display():
      | ComplexRatioRootsPolySquareMatrix
      | undefined {
      if (this.gaussian_elimination_result === undefined) {
        return undefined;
      }
      return this.gaussian_elimination_result[0].toComplexRatioRootsPolySquareMatrix();
    },
    inverse_matrix_for_display():
      | ComplexRatioRootsPolySquareMatrix
      | undefined {
      console.log("inverse_matrix_for_display");
      if (this.gaussian_elimination_result === undefined) {
        return undefined;
      }
      return this.gaussian_elimination_result[1].toComplexRatioRootsPolySquareMatrix();
    },
  },
  mounted() {
    nextTick(() => {
      this.init = false;
    });
  },
});
</script>

<style scoped></style>
