import { Rational } from "./Rational";

export class RationalPoly {
  private _coefficients: Array<Rational>;

  constructor(coefficients: Array<Rational>) {
    this._coefficients = coefficients.map((coefficient) => coefficient.clone());
    this.reduce();
  }

  reduce(): void {
    while (
      this._coefficients.length > 0 &&
      this._coefficients[this._coefficients.length - 1].equals(Rational.zero())
    ) {
      this._coefficients.pop();
    }
  }

  clone(): RationalPoly {
    return new RationalPoly(
      this._coefficients.map((coefficient) => coefficient.clone())
    );
  }

  static zero(): RationalPoly {
    return new RationalPoly([]);
  }

  static one(): RationalPoly {
    return new RationalPoly([Rational.one()]);
  }

  static from_roots(roots: Array<Rational>): RationalPoly {
    const poly = RationalPoly.one();
    for (let i = 0; i < roots.length; i++) {
      poly.mulEq(new RationalPoly([Rational.neg(roots[i]), Rational.one()]));
    }
    return poly;
  }

  degree(): number {
    if (this._coefficients.length == 0) {
      return -Infinity;
    }
    return this._coefficients.length - 1;
  }

  negEq(): RationalPoly {
    this._coefficients = this._coefficients.map((coefficient) =>
      Rational.neg(coefficient)
    );
    return this;
  }

  static neg(p: RationalPoly): RationalPoly {
    const res = p.clone();
    return res.negEq();
  }

  addEq(p: RationalPoly): RationalPoly {
    const max_degree = Math.max(this.degree(), p.degree());
    for (let i = 0; i <= max_degree; i++) {
      const this_coefficient =
        i <= this.degree() ? this._coefficients[i] : Rational.zero();
      const p_coefficient =
        i <= p.degree() ? p._coefficients[i] : Rational.zero();
      this._coefficients[i] = Rational.add(this_coefficient, p_coefficient);
    }
    this.reduce();
    return this;
  }

  static add(p: RationalPoly, q: RationalPoly): RationalPoly {
    const res = p.clone();
    return res.addEq(q);
  }

  subEq(p: RationalPoly): RationalPoly {
    return this.addEq(RationalPoly.neg(p));
  }

  static sub(p: RationalPoly, q: RationalPoly): RationalPoly {
    const res = p.clone();
    return res.subEq(q);
  }

  mulEq(p: RationalPoly): RationalPoly {
    if (this.degree() == -Infinity || p.degree() == -Infinity) {
      this._coefficients = [];
      return this;
    }
    const new_coefficients = new Array(this.degree() + p.degree() + 1).fill(
      Rational.zero()
    );
    for (let i = 0; i <= this.degree(); i++) {
      for (let j = 0; j <= p.degree(); j++) {
        new_coefficients[i + j] = Rational.add(
          new_coefficients[i + j],
          Rational.mul(this._coefficients[i], p._coefficients[j])
        );
      }
    }
    this._coefficients = new_coefficients;
    this.reduce();
    return this;
  }

  static mul(p: RationalPoly, q: RationalPoly): RationalPoly {
    const res = p.clone();
    return res.mulEq(q);
  }

  isZero(): boolean {
    return this.degree() == -Infinity;
  }
}
