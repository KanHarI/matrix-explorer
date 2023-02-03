<template>
  <div class="matrix-input">
    <div class="matrix-input__row">
      <div class="matrix-input__cell">
        <input type="text" />
      </div>
      <div class="matrix-input__cell">
        <input type="text" />
      </div>
      <div class="matrix-input__cell">
        <input type="text" />
      </div>
    </div>
    <div class="matrix-input__row">
      <div class="matrix-input__cell">
        <input type="text" />
      </div>
      <div class="matrix-input__cell">
        <input type="text" />
      </div>
      <div class="matrix-input__cell">
        <input type="text" />
      </div>
    </div>
    <div class="matrix-input__row">
      <div class="matrix-input__cell">
        <input type="text" />
      </div>
      <div class="matrix-input__cell">
        <input type="text" />
      </div>
      <div class="matrix-input__cell">
        <input type="text" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {ComplexRational} from "../math/ComplexRational";

interface DataType {
  entries: Array<Array<ComplexRational>>;
}

export default defineComponent({
  name: "MatrixInput",
  props: {
    order: {
      type: Number,
      required: true,
    },
  },
  data(): DataType {
    const entries: Array<Array<ComplexRational>> = [];
    for (let i = 0; i < this.order; i++) {
      entries.push([]);
      for (let j = 0; j < this.order; j++) {
        if (i === j) {
          entries[i].push(ComplexRational.one());
        } else {
          entries[i].push(ComplexRational.zero());
        }
      }
    }
    return {
      entries,
    };
  },
});
</script>

<style scoped>
.matrix-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.matrix-input__row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.matrix-input__cell {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0.5rem;
}
.matrix-input__cell input {
  width: 3rem;
  height: 3rem;
  text-align: center;
}
.matrix-input__cell input:focus {
  outline: none;
}
.matrix-input__cell input::placeholder {
  color: #ccc;
}
</style>
