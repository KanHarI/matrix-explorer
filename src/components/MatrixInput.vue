<template>
  <div class="matrix-input">
    <div v-for="i of range(order)" :key="i" class="matrix-input__row">
      <div v-for="j of range(order)" :key="j" class="matrix-input__cell">
        <input
          type="text"
          :placeholder="entries[i][j]"
          @input="update_entry(i, j, $event.target.value)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ComplexRational } from "../math/ComplexRational";
import { range } from "lodash";

interface DataType {
  entries: Array<Array<number>>;
}

export default defineComponent({
  name: "MatrixInput",
  props: {
    order: {
      type: Number,
      required: true,
    },
  },
  setup() {
    return {
      range,
    };
  },
  data(): DataType {
    const entries: Array<Array<number>> = [];
    for (let i = 0; i < this.order; i++) {
      entries.push([]);
      for (let j = 0; j < this.order; j++) {
        if (i === j) {
          entries[i].push(1);
        } else {
          entries[i].push(0);
        }
      }
    }
    return {
      entries,
    };
  },
  methods: {
    update_entry(i: number, j: number, value: string) {
      if (value === "") {
        this.entries[i][j] = i === j ? 1 : 0;
      } else {
        this.entries[i][j] = Number(value);
        if (isNaN(this.entries[i][j])) {
          this.entries[i][j] = i === j ? 1 : 0;
        }
      }
    },
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
