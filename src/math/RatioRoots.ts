import { Rational } from "./Rational";
import { factorize } from "./numberTheory";

export class RatioRoots {
  /**
   * An element of the ratioroots field is represented as
   * q_1 * sqrt(1) + q_2 * sqrt(2) + q_3 * sqrt(3) + q_5 * sqrt(5) + q_6 * sqrt(6) + ... + q_r * sqrt(r)
   * where q_r is a rational number, and r are the natural numbers that do not divide the
   * square of any prime.
   */
  private _coefficients: Record<number, Rational>;

  constructor(coefficients: Record<number, Rational>) {
    this._coefficients = coefficients;
    this.reduce();
  }

  reduce(): void {
    let key = Math.max(
      ...Object.keys(this._coefficients).map((x) => parseInt(x))
    );
    while (key > 1) {
      if (this._coefficients[key] !== undefined) {
        let reducer = 1;
        const factorization = factorize(key);
        for (const prime_str of Object.keys(factorization)) {
          const prime = parseInt(prime_str);
          if (factorization[prime] > 1) {
            reducer *= prime ** Math.floor(factorization[prime] / 2);
          }
        }
        if (reducer > 1) {
          const original_q = this._coefficients[key];
          delete this._coefficients[key];
          if (this._coefficients[key / reducer ** 2] === undefined) {
            this._coefficients[key / reducer ** 2] = new Rational(0, 1);
          }
          this._coefficients[key / reducer ** 2].addEq(
            original_q.mulEq(new Rational(reducer, 1))
          );
        }
      }
      key--;
    }
  }

  get coefficients(): Record<number, Rational> {
    return { ...this._coefficients };
  }
}
