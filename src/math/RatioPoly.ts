import { Rational } from "./Rational";
import { RatioRoots } from "./RatioRoots";

export class RatioPoly {
  private _coefficients: Array<Rational>;

  constructor(coefficients: Array<Rational>) {
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

  clone(): RatioPoly {
    return new RatioPoly(this._coefficients.map((c) => c.clone()));
  }

  negEq(): RatioPoly {
    this._coefficients = this._coefficients.map((c) => c.negEq());
    return this;
  }

  static neg(p: RatioPoly): RatioPoly {
    return p.clone().negEq();
  }

  addEq(p: RatioPoly): RatioPoly {
    const max_degree = Math.max(this.degree(), p.degree());
    if (max_degree == -Infinity) {
      return this;
    }
    const new_coefficients: Array<Rational> = [];
    for (let i = 0; i <= max_degree; i++) {
      if (i <= this.degree() && i <= p.degree()) {
        new_coefficients.push(
          Rational.add(this._coefficients[i], p._coefficients[i])
        );
      } else if (i <= this.degree()) {
        new_coefficients.push(this._coefficients[i].clone());
      } else {
        new_coefficients.push(p._coefficients[i].clone());
      }
    }
    this._coefficients = new_coefficients;
    return this;
  }

  static add(p1: RatioPoly, p2: RatioPoly): RatioPoly {
    return p1.clone().addEq(p2);
  }

  mulEq(p: RatioPoly): RatioPoly {
    const new_coefficients: Array<Rational> = [];
    for (let i = 0; i <= this.degree() + p.degree(); i++) {
      new_coefficients.push(new Rational(0, 1));
    }
    for (let i = 0; i <= this.degree(); i++) {
      for (let j = 0; j <= p.degree(); j++) {
        new_coefficients[i + j] = Rational.add(
          new_coefficients[i + j],
          Rational.mul(this._coefficients[i], p._coefficients[j])
        );
      }
    }
    this._coefficients = new_coefficients;
    return this;
  }

  static mul(p1: RatioPoly, p2: RatioPoly): RatioPoly {
    return p1.clone().mulEq(p2);
  }

  degree(): number {
    if (this._coefficients.length == 0) {
      return -Infinity;
    }
    return this._coefficients.length - 1;
  }

  isZero(): boolean {
    return this.degree() == -Infinity;
  }

  static zero(): RatioPoly {
    return new RatioPoly([]);
  }

  static one(): RatioPoly {
    return new RatioPoly([new Rational(1, 1)]);
  }

  static x(): RatioPoly {
    return new RatioPoly([new Rational(0, 1), new Rational(1, 1)]);
  }

  static xPow(n: number): RatioPoly {
    return new RatioPoly([new Rational(0, 1).powEq(n)]);
  }

  static fromRoots(roots: Array<Rational>): RatioPoly {
    const result = RatioPoly.one();
    for (const root of roots) {
      result.mulEq(new RatioPoly([Rational.neg(root), new Rational(1, 1)]));
    }
    return result;
  }

  solve(): Array<RatioRoots> {
    switch (this.degree()) {
      case -Infinity:
        throw new Error(
          "Cannot solve zero polynomial - solution space is infinite"
        );
      case 0:
        return [];
      case 1:
        return [
          RatioRoots.fromRational(
            Rational.neg(this._coefficients[0]).divEq(this._coefficients[1])
          ),
        ];
      case 2:
        const a = this._coefficients[2];
        const b = this._coefficients[1];
        const c = this._coefficients[0];
        const discriminant = Rational.sub(
          Rational.mul(b, b),
          Rational.mul(a, c).mulEq(new Rational(4, 1))
        );
        const discriminant_sqrt = discriminant.sqrt();
        const two_a = a.mulEq(new Rational(2, 1));
        return discriminant_sqrt.map((d) => {
          return RatioRoots.add(
            RatioRoots.fromRational(Rational.neg(b))
              .addEq(d)
              .divEq(RatioRoots.fromRational(two_a)),
            RatioRoots.fromRational(Rational.neg(b))
              .subEq(d)
              .divEq(RatioRoots.fromRational(two_a))
          );
        });
      default:
        throw new Error("Cannot solve polynomial of degree > 2");
    }
  }
}
