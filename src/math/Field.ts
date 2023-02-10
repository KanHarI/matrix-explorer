import { CommutativeRing } from "./CommutativeRing";

export interface Field<T> extends CommutativeRing<T> {
  inverseEq(): Field<T>;
}
