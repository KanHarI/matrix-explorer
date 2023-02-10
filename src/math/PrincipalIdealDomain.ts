import { CommutativeRing } from "./CommutativeRing";

export abstract class PrincipalIdealDomain<T> extends CommutativeRing<T> {
  abstract factorize(): Array<{
    factor: PrincipalIdealDomain<T>;
    exponent: number;
  }>;
  defactorize(): PrincipalIdealDomain<T> {
    const result = this.newOne();
    for (const { factor, exponent } of this.factorize()) {
      result.mulEq(factor.powEq(exponent));
    }
    return result as PrincipalIdealDomain<T>;
  }

  gcdEq(other: PrincipalIdealDomain<T>): PrincipalIdealDomain<T> {
    const this_factors = this.factorize();
    const other_factors = other.factorize();
    const result = this.newOne();
    const string_representation_to_this_factors_idx: Record<string, number> =
      {};
    const string_representation_to_other_factors_idx: Record<string, number> =
      {};
    for (const [idx, { factor }] of this_factors.entries()) {
      string_representation_to_this_factors_idx[factor.toString()] = idx;
    }
    for (const [idx, { factor }] of other_factors.entries()) {
      string_representation_to_other_factors_idx[factor.toString()] = idx;
    }
    for (const string_representation of Object.keys(
      string_representation_to_this_factors_idx
    )) {
      if (string_representation in string_representation_to_other_factors_idx) {
        const this_factor =
          this_factors[
            string_representation_to_this_factors_idx[string_representation]
          ];
        const other_factor =
          other_factors[
            string_representation_to_other_factors_idx[string_representation]
          ];
        result.mulEq(
          this_factor.factor
            .clone()
            .powEq(Math.min(this_factor.exponent, other_factor.exponent))
        );
      }
    }
    return result as PrincipalIdealDomain<T>;
  }

  lcmEq(other: PrincipalIdealDomain<T>): PrincipalIdealDomain<T> {
    const this_factors = this.factorize();
    const other_factors = other.factorize();
    const result = this.newOne();
    const string_representation_to_this_factors_idx: Record<string, number> =
      {};
    const string_representation_to_other_factors_idx: Record<string, number> =
      {};
    const factors_set: Set<string> = new Set<string>();
    for (const [idx, { factor }] of this_factors.entries()) {
      string_representation_to_this_factors_idx[factor.toString()] = idx;
      factors_set.add(factor.toString());
    }
    for (const [idx, { factor }] of other_factors.entries()) {
      string_representation_to_other_factors_idx[factor.toString()] = idx;
      factors_set.add(factor.toString());
    }
    for (const string_representation of factors_set) {
      const this_factor =
        string_representation in string_representation_to_this_factors_idx
          ? this_factors[
              string_representation_to_this_factors_idx[string_representation]
            ]
          : { factor: this.newOne(), exponent: 0 };
      const other_factor =
        string_representation in string_representation_to_other_factors_idx
          ? other_factors[
              string_representation_to_other_factors_idx[string_representation]
            ]
          : { factor: this.newOne(), exponent: 0 };
      result.mulEq(
        this_factor.factor
          .clone()
          .powEq(Math.max(this_factor.exponent, other_factor.exponent))
      );
    }
    return result as PrincipalIdealDomain<T>;
  }
}
