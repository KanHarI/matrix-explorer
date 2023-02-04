import { ComplexRatioRoots } from "./ComplexRatioRoots";
import { ComplexRational } from "./ComplexRational";
import { ComplexRationalPoly } from "./ComplexRationalPoly";

export class ComplexRatioRootsPoly {
  private _coefficients: Array<ComplexRatioRoots>;

  constructor(coefficients: Array<ComplexRatioRoots>) {
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

  clone(): ComplexRatioRootsPoly {
    return new ComplexRatioRootsPoly(this._coefficients.map((c) => c.clone()));
  }

  negEq(): ComplexRatioRootsPoly {
    this._coefficients = this._coefficients.map((c) => c.negEq());
    return this;
  }

  static neg(p: ComplexRatioRootsPoly): ComplexRatioRootsPoly {
    return p.clone().negEq();
  }

  addEq(p: ComplexRatioRootsPoly): ComplexRatioRootsPoly {
    const max_degree = Math.max(this.degree(), p.degree());
    if (max_degree == -Infinity) {
      return this;
    }
    const new_coefficients: Array<ComplexRatioRoots> = [];
    for (let i = 0; i <= max_degree; i++) {
      if (i <= this.degree() && i <= p.degree()) {
        new_coefficients.push(
          ComplexRatioRoots.add(this._coefficients[i], p._coefficients[i])
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
    p1: ComplexRatioRootsPoly,
    p2: ComplexRatioRootsPoly
  ): ComplexRatioRootsPoly {
    return p1.clone().addEq(p2);
  }

  mulEq(p: ComplexRatioRootsPoly): ComplexRatioRootsPoly {
    const new_coefficients: Array<ComplexRatioRoots> = [];
    for (let i = 0; i <= this.degree() + p.degree(); i++) {
      new_coefficients.push(ComplexRatioRoots.zero());
    }
    for (let i = 0; i <= this.degree(); i++) {
      for (let j = 0; j <= p.degree(); j++) {
        new_coefficients[i + j] = ComplexRatioRoots.add(
          new_coefficients[i + j],
          ComplexRatioRoots.mul(this._coefficients[i], p._coefficients[j])
        );
      }
    }
    this._coefficients = new_coefficients;
    this.reduce();
    return this;
  }

  static mul(
    p1: ComplexRatioRootsPoly,
    p2: ComplexRatioRootsPoly
  ): ComplexRatioRootsPoly {
    return p1.clone().mulEq(p2);
  }

  degree(): number {
    return this._coefficients.length - 1;
  }

  static zero(): ComplexRatioRootsPoly {
    return new ComplexRatioRootsPoly([]);
  }

  static one(): ComplexRatioRootsPoly {
    return new ComplexRatioRootsPoly([ComplexRatioRoots.one()]);
  }

  static fromComplexRational(r: ComplexRational): ComplexRatioRootsPoly {
    return new ComplexRatioRootsPoly([
      ComplexRatioRoots.fromComplexRational(r),
    ]);
  }
}
