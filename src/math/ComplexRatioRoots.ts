import { RatioRoots } from "./RatioRoots";
import { Rational } from "./Rational";
import { ComplexRational } from "./ComplexRational";

export class ComplexRatioRoots {
  private _real: RatioRoots;
  private _imag: RatioRoots;

  constructor(real: RatioRoots, imag: RatioRoots) {
    this._real = real.clone();
    this._imag = imag.clone();
  }

  clone(): ComplexRatioRoots {
    return new ComplexRatioRoots(this._real, this._imag);
  }

  conjugateEq(): ComplexRatioRoots {
    this._imag.negEq();
    return this;
  }

  static conjuate(z: ComplexRatioRoots): ComplexRatioRoots {
    return z.clone().conjugateEq();
  }

  normSquared(): RatioRoots {
    return RatioRoots.add(
      RatioRoots.mul(this._real, this._real),
      RatioRoots.mul(this._imag, this._imag)
    );
  }

  negEq(): ComplexRatioRoots {
    this._real.negEq();
    this._imag.negEq();
    return this;
  }

  static neg(z: ComplexRatioRoots): ComplexRatioRoots {
    return z.clone().negEq();
  }

  addEq(z: ComplexRatioRoots): ComplexRatioRoots {
    this._real.addEq(z._real);
    this._imag.addEq(z._imag);
    return this;
  }

  static add(z1: ComplexRatioRoots, z2: ComplexRatioRoots): ComplexRatioRoots {
    return z1.clone().addEq(z2);
  }

  subEq(z: ComplexRatioRoots): ComplexRatioRoots {
    return this.addEq(ComplexRatioRoots.neg(z));
  }

  static sub(z1: ComplexRatioRoots, z2: ComplexRatioRoots): ComplexRatioRoots {
    return z1.clone().subEq(z2);
  }

  mulEq(z: ComplexRatioRoots): ComplexRatioRoots {
    const real = RatioRoots.sub(
      RatioRoots.mul(this._real, z._real),
      RatioRoots.mul(this._imag, z._imag)
    );
    const imag = RatioRoots.add(
      RatioRoots.mul(this._real, z._imag),
      RatioRoots.mul(this._imag, z._real)
    );
    this._real = real;
    this._imag = imag;
    return this;
  }

  static mul(z1: ComplexRatioRoots, z2: ComplexRatioRoots): ComplexRatioRoots {
    return z1.clone().mulEq(z2);
  }

  divEq(z: ComplexRatioRoots): ComplexRatioRoots {
    const norm_squared = z.normSquared();
    const real = RatioRoots.div(
      RatioRoots.add(
        RatioRoots.mul(this._real, z._real),
        RatioRoots.mul(this._imag, z._imag)
      ),
      norm_squared
    );
    const imag = RatioRoots.div(
      RatioRoots.sub(
        RatioRoots.mul(this._imag, z._real),
        RatioRoots.mul(this._real, z._imag)
      ),
      norm_squared
    );
    this._real = real;
    this._imag = imag;
    return this;
  }

  static div(z1: ComplexRatioRoots, z2: ComplexRatioRoots): ComplexRatioRoots {
    return z1.clone().divEq(z2);
  }

  get real(): RatioRoots {
    return this._real.clone();
  }

  get imag(): RatioRoots {
    return this._imag.clone();
  }

  static zero(): ComplexRatioRoots {
    return new ComplexRatioRoots(RatioRoots.zero(), RatioRoots.zero());
  }

  static one(): ComplexRatioRoots {
    return new ComplexRatioRoots(RatioRoots.one(), RatioRoots.zero());
  }

  static fromRational(r: Rational) {
    return new ComplexRatioRoots(RatioRoots.fromRational(r), RatioRoots.zero());
  }

  static fromRatioRoots(r: RatioRoots) {
    return new ComplexRatioRoots(r.clone(), RatioRoots.zero());
  }

  static fromComplexRational(r: ComplexRational): ComplexRatioRoots {
    return new ComplexRatioRoots(
      RatioRoots.fromRational(r.real.clone()),
      RatioRoots.fromRational(r.imag.clone())
    );
  }

  isZero(): boolean {
    return this._real.isZero() && this._imag.isZero();
  }
}
