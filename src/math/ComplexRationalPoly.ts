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

  clone(): ComplexRationalPoly {
    return new ComplexRationalPoly(this._coefficients.map((c) => c.clone()));
  }

  negEq(): ComplexRationalPoly {
    this._coefficients = this._coefficients.map((c) => c.negEq());
    return this;
  }

  static neg(p: ComplexRationalPoly): ComplexRationalPoly {
    return p.clone().negEq();
  }

  addEq(p: ComplexRationalPoly): ComplexRationalPoly {
    const max_degree = Math.max(this.degree(), p.degree());
    if (max_degree == -Infinity) {
      return this;
    }
    const new_coefficients: Array<ComplexRational> = [];
    for (let i = 0; i <= max_degree; i++) {
      if (i <= this.degree() && i <= p.degree()) {
        new_coefficients.push(
          ComplexRational.add(this._coefficients[i], p._coefficients[i])
        );
      } else if (i <= this.degree()) {
        new_coefficients.push(this._coefficients[i].clone());
      } else {
        new_coefficients.push(p._coefficients[i].clone());
      }
    }
    this._coefficients = new_coefficients;
    this.reduce();
    return this;
  }

  static add(
    p1: ComplexRationalPoly,
    p2: ComplexRationalPoly
  ): ComplexRationalPoly {
    return p1.clone().addEq(p2);
  }

  subEq(p: ComplexRationalPoly): ComplexRationalPoly {
    return this.addEq(ComplexRationalPoly.neg(p));
  }

  static sub(
    p1: ComplexRationalPoly,
    p2: ComplexRationalPoly
  ): ComplexRationalPoly {
    return ComplexRationalPoly.add(p1, ComplexRationalPoly.neg(p2));
  }

  mulEq(p: ComplexRationalPoly): ComplexRationalPoly {
    if (this.degree() === -Infinity || p.degree() === -Infinity) {
      this._coefficients = [];
      return this;
    }
    const new_coefficients: Array<ComplexRational> = [];
    for (let i = 0; i <= this.degree() + p.degree(); i++) {
      new_coefficients.push(ComplexRational.zero());
    }
    for (let i = 0; i <= this.degree(); i++) {
      for (let j = 0; j <= p.degree(); j++) {
        new_coefficients[i + j].addEq(
          ComplexRational.mul(this._coefficients[i], p._coefficients[j])
        );
      }
    }
    this._coefficients = new_coefficients;
    this.reduce();
    return this;
  }

  static mul(
    p1: ComplexRationalPoly,
    p2: ComplexRationalPoly
  ): ComplexRationalPoly {
    return p1.clone().mulEq(p2);
  }

  powEq(n: number): ComplexRationalPoly {
    if (n === 0) {
      this._coefficients = [ComplexRational.one()];
      return this;
    }
    if (n === 1) {
      return this;
    }
    if (n === 2) {
      return this.mulEq(this);
    }
    const p = this.clone();
    for (let i = 1; i < n; i++) {
      this.mulEq(p);
    }
    return this;
  }

  static pow(p: ComplexRationalPoly, n: number): ComplexRationalPoly {
    return p.clone().powEq(n);
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
