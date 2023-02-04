<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <MatrixInput :order="2" />
  <MathjaxMatrix :matrix="matrix" />

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MatrixInput from "./MatrixInput.vue";
import MathjaxMatrix from "./MathjaxMatrix.vue";
import { ComplexRationalSquarePolyMatrix } from "../math/ComplexRationalSquarePolyMatrix";

interface DataType {
  count: number;
}

export default defineComponent({
  name: "HelloWorld",
  components: {
    MathjaxMatrix,
    MatrixInput,
  },
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  data(): DataType {
    return {
      count: 0,
    };
  },
  computed: {
    matrix(): ComplexRationalSquarePolyMatrix {
      return ComplexRationalSquarePolyMatrix.identity(3);
    },
  },
});
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
