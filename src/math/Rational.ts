import { gcd } from "./numberTheory";

export class Rational {
  private _numerator: number;
  private _denominator: number;

  constructor(numerator: number, denominator: number) {
    this._numerator = numerator;
    this._denominator = denominator;
    if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
      throw new Error("Numerator and denominator must be integers!");
    }
    if (denominator == 0) {
      throw new Error("Denominator cannot be zero!");
    }
    this.reduce();
  }

  private reduce(): void {
    if (this._denominator < 0) {
      this._numerator *= -1;
      this._denominator *= -1;
    }
    if (this._numerator == 0) {
      this._denominator = 1;
    } else {
      const _gcd = gcd([Math.abs(this._numerator), this._denominator]);
      this._numerator /= _gcd;
      this._denominator /= _gcd;
    }
  }

  clone(): Rational {
    return new Rational(this._numerator, this._denominator);
  }

  neqEq(): Rational {
    this._numerator *= -1;
    return this;
  }

  static neg(r: Rational): Rational {
    const res = r.clone();
    return res.neqEq();
  }

  invEq(): Rational {
    const temp = this._numerator;
    this._numerator = this._denominator;
    this._denominator = temp;
    this.reduce();
    return this;
  }

  static inv(r: Rational): Rational {
    const res = r.clone();
    res.invEq();
    return res;
  }

  addEq(other: Rational): Rational {
    this._numerator =
      this._numerator * other._denominator +
      other._numerator * this._denominator;
    this._denominator *= other._denominator;
    this.reduce();
    return this;
  }

  static add(a: Rational, b: Rational): Rational {
    const result = a.clone();
    return result.addEq(b);
  }

  minusEq(other: Rational): Rational {
    return this.addEq(Rational.neg(other));
  }

  static minus(a: Rational, b: Rational): Rational {
    const result = a.clone();
    return result.minusEq(b);
  }

  mulEq(other: Rational): Rational {
    this._numerator *= other._numerator;
    this._denominator *= other._denominator;
    this.reduce();
    return this;
  }

  static mul(a: Rational, b: Rational): Rational {
    const result = a.clone();
    return result.mulEq(b);
  }

  divEq(other: Rational): Rational {
    return this.mulEq(Rational.inv(other));
  }

  static div(a: Rational, b: Rational): Rational {
    const result = a.clone();
    return result.divEq(b);
  }

  toFP(): number {
    return this._numerator / this._denominator;
  }

  get numerator(): number {
    return this._numerator;
  }

  get denominator(): number {
    return this._denominator;
  }
}
