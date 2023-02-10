export abstract class CommutativeRing<T> {
  abstract newZero(): CommutativeRing<T>;
  abstract newOne(): CommutativeRing<T>;
  abstract clone(): CommutativeRing<T>;
  abstract set(val: CommutativeRing<T>): CommutativeRing<T>;
  abstract addEq(other: CommutativeRing<T>): CommutativeRing<T>;
  abstract mulEq(other: CommutativeRing<T>): CommutativeRing<T>;
  abstract negEq(): CommutativeRing<T>;
  abstract toString(): string;

  // We assume all elements are decidably invertible (not true in the general case).
  abstract newTryInv():
    | { success: false }
    | { success: true; value: CommutativeRing<T> };

  powEq(n: number): CommutativeRing<T> {
    if (!Number.isInteger(n) || n < 0) {
      throw new Error("n must be a non-negative integer");
    }
    if (n === 0) {
      return this.set(this.newOne());
    }
    const base = this.clone();
    while (n > 1) {
      if (n % 2 === 1) {
        this.mulEq(base);
      }
      base.mulEq(base);
      n = Math.floor(n / 2);
    }
    return this;
  }
}
