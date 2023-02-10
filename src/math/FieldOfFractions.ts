import {
  defactorize,
  UniqueFactorizationDomain,
} from "./UniqueFactorizationDomain";
import { Field } from "./Field";
import { _pow, CommutativeRing, isZero } from "./CommutativeRing";

export function makeFieldOfFractions<
  RingT,
  R extends UniqueFactorizationDomain<RingT>,
  FofT
>(_one: R, _zero: R) {
  class FieldOfFractions implements Field<FofT> {
    private _numerator: R;
    private _denominator: R;

    constructor(numerator: R, denominator: R) {
      this._numerator = numerator;
      this._denominator = denominator;
      this.reduce();
    }

    private reduce(): void {
      const numerator_factors = this._numerator.factorize();
      const denominator_factors = this._denominator.factorize();
      if (denominator_factors.length == 0) {
        return;
      }
      const one = denominator_factors[0].factor
        .one as UniqueFactorizationDomain<RingT>;
      const unit_in_denominator = denominator_factors[0].factor.attemptInvert();
      if (unit_in_denominator.success) {
        const inverse_unit = _pow(
          unit_in_denominator.inverse,
          denominator_factors[0].exponent
        );
        numerator_factors.unshift({
          factor: inverse_unit as UniqueFactorizationDomain<RingT>,
          exponent: 1,
        });
        denominator_factors.shift();
      }
      const numerator_factors_str_to_idx: { [key: string]: number } = {};
      const denominator_factors_str_to_idx: { [key: string]: number } = {};
      for (let i = 0; i < numerator_factors.length; i++) {
        numerator_factors_str_to_idx[numerator_factors[i].factor.toString()] =
          i;
      }
      for (let i = 0; i < denominator_factors.length; i++) {
        denominator_factors_str_to_idx[
          denominator_factors[i].factor.toString()
        ] = i;
      }
      for (let i = 0; i < numerator_factors.length; i++) {
        const denominator_index =
          denominator_factors_str_to_idx[
            numerator_factors[i].factor.toString()
          ];
        if (denominator_index != undefined) {
          const numerator_exponent = numerator_factors[i].exponent;
          const denominator_exponent =
            denominator_factors[denominator_index].exponent;
          const exponent = Math.min(numerator_exponent, denominator_exponent);
          if (exponent == 0) {
            numerator_factors.splice(i, 1);
            denominator_factors.splice(denominator_index, 1);
            i--;
          } else if (exponent == numerator_exponent) {
            denominator_factors.splice(denominator_index, 1);
          } else if (exponent == denominator_exponent) {
            numerator_factors.splice(i, 1);
            i--;
          } else {
            numerator_factors[i].exponent -= exponent;
            denominator_factors[denominator_index].exponent -= exponent;
          }
        }
      }
      this._numerator = defactorize<RingT>(numerator_factors, one) as R;
      this._denominator = defactorize<RingT>(denominator_factors, one) as R;
    }

    addEq(x: CommutativeRing<FofT>): CommutativeRing<FofT> {
      const other = x as FieldOfFractions;
      const new_denominator = this._denominator
        .clone()
        .mulEq(other._denominator);
      const new_numerator = this._numerator
        .clone()
        .mulEq(other._denominator)
        .addEq(other._numerator.clone().mulEq(this._denominator));
      this._numerator = new_numerator as R;
      this._denominator = new_denominator as R;
      this.reduce();
      return this;
    }

    mulEq(x: CommutativeRing<FofT>): CommutativeRing<FofT> {
      const other = x as FieldOfFractions;
      this._numerator.mulEq(other._numerator);
      this._denominator.mulEq(other._denominator);
      this.reduce();
      return this;
    }

    negEq(): CommutativeRing<FofT> {
      this._numerator.negEq();
      return this;
    }

    one: CommutativeRing<FofT> = new FieldOfFractions(_one, _one);
    zero: CommutativeRing<FofT> = new FieldOfFractions(_zero, _one);

    attemptInvert():
      | { success: false }
      | { success: true; inverse: CommutativeRing<FofT> } {
      if (isZero<R>(this._denominator)) {
        return { success: false };
      }
      const new_numerator = this._denominator.clone();
      const new_denominator = this._numerator.clone();
      return {
        success: true,
        inverse: new FieldOfFractions(new_numerator as R, new_denominator as R),
      };
    }

    clone(): CommutativeRing<FofT> {
      return new FieldOfFractions(
        this._numerator.clone() as R,
        this._denominator.clone() as R
      );
    }

    inverseEq(): Field<FofT> {
      if (isZero<R>(this._denominator)) {
        throw new Error("Cannot invert zero");
      }
      const tmp = this._denominator.clone();
      this._denominator = this._numerator.clone() as R;
      this._numerator = tmp as R;
      this.reduce();
      return this;
    }

    isEq(x: CommutativeRing<FofT>): boolean {
      const other = x as FieldOfFractions;
      return (
        this._numerator.isEq(other._numerator) &&
        this._denominator.isEq(other._denominator)
      );
    }
  }
}
