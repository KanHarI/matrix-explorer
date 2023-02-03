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

  private reduce(): void {
    let key = Math.max(
      ...Object.keys(this._coefficients).map((x) => parseInt(x))
    );
    while (key > 1) {
      if (this._coefficients[key] !== undefined) {
        // Remove zero coefficients
        if (this._coefficients[key].numerator == 0) {
          delete this._coefficients[key];
          key--;
          continue;
        }

        // Reduce the coefficient and keep only irreducible square roots
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

  clone(): RatioRoots {
    return new RatioRoots(this._coefficients);
  }

  negEq(): RatioRoots {
    for (const key of Object.keys(
      this._coefficients
    ) as unknown as Array<number>) {
      this._coefficients[key].negEq();
    }
    return this;
  }

  static neg(r: RatioRoots): RatioRoots {
    const res = r.clone();
    return res.negEq();
  }

  addEq(other: RatioRoots): RatioRoots {
    for (const key of Object.keys(
      other._coefficients
    ) as unknown as Array<number>) {
      if (this._coefficients[key] === undefined) {
        this._coefficients[key] = new Rational(0, 1);
      }
      this._coefficients[key].addEq(other._coefficients[key]);
    }
    this.reduce();
    return this;
  }

  static add(r1: RatioRoots, r2: RatioRoots): RatioRoots {
    const res = r1.clone();
    return res.addEq(r2);
  }

  subEq(other: RatioRoots): RatioRoots {
    const negOther = RatioRoots.neg(other);
    return this.addEq(negOther);
  }

  static sub(r1: RatioRoots, r2: RatioRoots): RatioRoots {
    const res = r1.clone();
    return res.subEq(r2);
  }

  mulEq(other: RatioRoots): RatioRoots {
    const new_coefficients: Record<number, Rational> = {};
    for (const key1 of Object.keys(this._coefficients).map((x) =>
      parseInt(x)
    )) {
      for (const key2 of Object.keys(other._coefficients).map((x) =>
        parseInt(x)
      )) {
        const key = key1 * key2;
        if (new_coefficients[key] === undefined) {
          new_coefficients[key] = new Rational(0, 1);
        }
        new_coefficients[key].addEq(
          Rational.mul(this._coefficients[key1], other._coefficients[key2])
        );
      }
    }
    this._coefficients = new_coefficients;
    this.reduce();
    return this;
  }

  static mul(r1: RatioRoots, r2: RatioRoots): RatioRoots {
    const res = r1.clone();
    return res.mulEq(r2);
  }

  invEq(): RatioRoots {
    /**
     * Given an element (A + q_r * sqrt(r)) of the ratioroots field, we can find an element
     * of this field that is its inverse:
     * 1 / (A + q_r * sqrt(r)) = (A - q_r * sqrt(r)) / (A^2 - q_r^2 * r)
     */
    if (Object.keys(this._coefficients).length == 0) {
      throw new Error("Division by zero!");
    }
    const factors: Array<RatioRoots> = [];
    while (Object.keys(this._coefficients).length > 1) {
      const r = Math.max(
        ...Object.keys(this._coefficients).map((x) => parseInt(x))
      );
      const new_factor_coefficients: Record<number, Rational> = {};
      new_factor_coefficients[r] = Rational.neg(this._coefficients[r]);
      for (const key of Object.keys(this._coefficients).map((x) =>
        parseInt(x)
      )) {
        if (key != r) {
          new_factor_coefficients[key] = this._coefficients[key].clone();
        }
      }
      const new_factor = new RatioRoots(new_factor_coefficients);
      factors.push(new_factor);
      this.mulEq(new_factor);
    }
    factors.push(this.clone());
    this.powEq(2);
    if (
      this._coefficients[1] === undefined ||
      Object.keys(this._coefficients).length > 1
    ) {
      throw new Error("Unknown inversion error!");
    }
    factors.push(new RatioRoots({ 1: Rational.inv(this._coefficients[1]) }));
    const acc = factors[0];
    for (let i = 1; i < factors.length; i++) {
      acc.mulEq(factors[i]);
    }
    this._coefficients = acc._coefficients;
    return this;
  }

  static inv(r: RatioRoots): RatioRoots {
    const res = r.clone();
    return res.invEq();
  }

  divEq(other: RatioRoots): RatioRoots {
    return this.mulEq(RatioRoots.inv(other));
  }

  static div(r1: RatioRoots, r2: RatioRoots): RatioRoots {
    const res = r1.clone();
    return res.divEq(r2);
  }

  powEq(n: number): RatioRoots {
    if (n < 0) {
      this.invEq();
      n = -n;
    }
    let res = new RatioRoots({ 1: new Rational(1, 1) });
    let base = this.clone();
    while (n > 0) {
      if (n % 2 == 1) {
        res.mulEq(base);
      }
      base.mulEq(base);
      n = Math.floor(n / 2);
    }
    this._coefficients = res._coefficients;
    return this;
  }

  static pow(r: RatioRoots, n: number): RatioRoots {
    const res = r.clone();
    return res.powEq(n);
  }

  get coefficients(): Record<number, Rational> {
    const res: Record<number, Rational> = {};
    for (const key of Object.keys(
      this._coefficients
    ) as unknown as Array<number>) {
      res[key] = this._coefficients[key].clone();
    }
    return res;
  }
}
