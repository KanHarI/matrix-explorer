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

  reduce(): void {
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

  neqEq(): void {
    this._numerator *= -1;
  }

  static neg(r: Rational): Rational {
    const res = r.clone();
    res.neqEq();
    return res;
  }

  invEq(): void {
    const temp = this._numerator;
    this._numerator = this._denominator;
    this._denominator = temp;
    this.reduce();
  }

  static inv(r: Rational): Rational {
    const res = r.clone();
    res.invEq();
    return res;
  }

  addEq(other: Rational): void {
    this._numerator =
      this._numerator * other._denominator +
      other._numerator * this._denominator;
    this._denominator *= other._denominator;
    this.reduce();
  }

  static add(a: Rational, b: Rational): Rational {
    const result = a.clone();
    result.addEq(b);
    return result;
  }

  minusEq(other: Rational): void {
    this.addEq(Rational.neg(other));
  }

  static minus(a: Rational, b: Rational): Rational {
    const result = a.clone();
    result.minusEq(b);
    return result;
  }

  mulEq(other: Rational): void {
    this._numerator *= other._numerator;
    this._denominator *= other._denominator;
    this.reduce();
  }

  static mul(a: Rational, b: Rational): Rational {
    const result = a.clone();
    result.mulEq(b);
    return result;
  }

  divEq(other: Rational): void {
    this.mulEq(Rational.inv(other));
  }

  static div(a: Rational, b: Rational): Rational {
    const result = a.clone();
    result.divEq(b);
    return result;
  }

  toFP(): number {
    return this._numerator / this._denominator;
  }
}
