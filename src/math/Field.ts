import { CommutativeRing } from "./CommutativeRing";

export interface Field<T> extends CommutativeRing<T> {
  inverse(): Field<T>;
}
