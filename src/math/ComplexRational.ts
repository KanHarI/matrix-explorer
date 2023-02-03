import { Rational } from "./Rational";
import { RatioRoots } from "./RatioRoots";

export class ComplexRational {
  private _real: Rational;
  private _imag: Rational;

  constructor(real: Rational, imag: Rational) {
    this._real = real.clone();
    this._imag = imag.clone();
  }

  clone(): ComplexRational {
    return new ComplexRational(this._real, this._imag);
  }

  conjugateEq(): ComplexRational {
    this._imag.negEq();
    return this;
  }

  static conjuate(z: ComplexRational): ComplexRational {
    return z.clone().conjugateEq();
  }

  normSquared(): Rational {
    return Rational.add(
      Rational.mul(this._real, this._real),
      Rational.mul(this._imag, this._imag)
    );
  }

  norm(): RatioRoots {
    const coefficients: Record<string, Rational> = {};
    const norm_squared = this.normSquared();
    coefficients[norm_squared.denominator * norm_squared.numerator] =
      new Rational(norm_squared.denominator, 1);
    return new RatioRoots(coefficients);
  }

  negEq(): ComplexRational {
    this._real.negEq();
    this._imag.negEq();
    return this;
  }

  static neg(z: ComplexRational): ComplexRational {
    return z.clone().negEq();
  }

  addEq(z: ComplexRational): ComplexRational {
    this._real.addEq(z._real);
    this._imag.addEq(z._imag);
    return this;
  }

  static add(z1: ComplexRational, z2: ComplexRational): ComplexRational {
    return z1.clone().addEq(z2);
  }

  subEq(z: ComplexRational): ComplexRational {
    return this.addEq(ComplexRational.neg(z));
  }

  static sub(z1: ComplexRational, z2: ComplexRational): ComplexRational {
    return z1.clone().subEq(z2);
  }

  mulEq(z: ComplexRational): ComplexRational {
    const real = Rational.sub(
      Rational.mul(this._real, z._real),
      Rational.mul(this._imag, z._imag)
    );
    const imag = Rational.add(
      Rational.mul(this._real, z._imag),
      Rational.mul(this._imag, z._real)
    );
    this._real = real;
    this._imag = imag;
    return this;
  }

  static mul(z1: ComplexRational, z2: ComplexRational): ComplexRational {
    return z1.clone().mulEq(z2);
  }

  invEq(): ComplexRational {
    const norm_squared = this.normSquared();
    this._real.divEq(norm_squared);
    this._imag.negEq().divEq(norm_squared);
    return this;
  }

  static inv(z: ComplexRational): ComplexRational {
    return z.clone().invEq();
  }

  divEq(z: ComplexRational): ComplexRational {
    return this.mulEq(ComplexRational.inv(z));
  }

  static div(z1: ComplexRational, z2: ComplexRational): ComplexRational {
    return z1.clone().divEq(z2);
  }

  get real(): Rational {
    return this._real.clone();
  }

  get imag(): Rational {
    return this._imag.clone();
  }
}
