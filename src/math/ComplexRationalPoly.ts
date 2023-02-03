import { ComplexRational } from "./ComplexRational";

export class ComplexRationalPoly {
  private _coefficients: Array<ComplexRational>;
  constructor(coefficients: Array<ComplexRational>) {
    this._coefficients = coefficients.map((c) => c.clone());
    this.reduce();
  }

  reduce(): void {
    while (
      this._coefficients.length > 1 &&
      this._coefficients[this._coefficients.length - 1].isZero()
    ) {
      this._coefficients.pop();
    }
  }

  get coefficients(): Array<ComplexRational> {
    return this._coefficients;
  }

  degree(): number {
    if (this._coefficients.length == 0) {
      return -Infinity;
    }
    return this._coefficients.length - 1;
  }
}
