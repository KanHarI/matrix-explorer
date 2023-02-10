import { UniqueFactorizationDomain } from "./UniqueFactorizationDomain";
import { CommutativeRing } from "./CommutativeRing";
import { factorize as NTFactorize } from "./numberTheory";

export type _Integers = {
  _Integers: never;
};

export class Integer implements UniqueFactorizationDomain<_Integers> {
  private _n: number;

  constructor(n: number) {
    if (!Number.isInteger(n)) {
      throw new Error("Argument must be an integer!");
    }
    this._n = n;
  }

  addEq(x: CommutativeRing<_Integers>): CommutativeRing<_Integers> {
    // @ts-ignore
    this._n += x._n;
    return this;
  }

  mulEq(x: CommutativeRing<_Integers>): CommutativeRing<_Integers> {
    // @ts-ignore
    this._n *= x._n;
    return this;
  }

  negEq(): CommutativeRing<_Integers> {
    this._n = -this._n;
    return this;
  }

  one: CommutativeRing<_Integers> = new Integer(1);
  zero: CommutativeRing<_Integers> = new Integer(0);

  attemptInvert():
    | { success: false }
    | { success: true; inverse: CommutativeRing<_Integers> } {
    if (this._n === 1) {
      return { success: true, inverse: this.clone() };
    }
    if (this._n === -1) {
      return { success: true, inverse: this.clone().negEq() };
    }
    return { success: false };
  }

  clone(): CommutativeRing<_Integers> {
    return new Integer(this._n);
  }

  factorize(): Array<{
    factor: UniqueFactorizationDomain<_Integers>;
    exponent: number;
  }> {
    const result: Array<{
      factor: UniqueFactorizationDomain<_Integers>;
      exponent: number;
    }> = new Array<{
      factor: UniqueFactorizationDomain<_Integers>;
      exponent: number;
    }>();
    if (this._n < 0) {
      result.push({
        factor: new Integer(-1),
        exponent: 1,
      });
    }
    const base_factorization = NTFactorize(Math.abs(this._n));
    for (const [prime_str, exponent] of Object.entries(base_factorization)) {
      result.push({
        factor: new Integer(Number(prime_str)),
        exponent: exponent,
      });
    }
    return result;
  }
}
