import { CommutativeRing, _pow } from "./CommutativeRing";

export interface UniqueFactorizationDomain<T> extends CommutativeRing<T> {
  factorize(): Array<{
    factor: UniqueFactorizationDomain<T>;
    exponent: number;
  }>;
}

export function defactorize<T>(
  factors: Array<{
    factor: UniqueFactorizationDomain<T>;
    exponent: number;
  }>,
  identity: UniqueFactorizationDomain<T>
): UniqueFactorizationDomain<T> {
  const result = identity.clone();
  for (let i = 0; i < factors.length; i++) {
    result.mulEq(_pow(factors[i].factor, factors[i].exponent));
  }
  return result as UniqueFactorizationDomain<T>;
}

export function gcd<T>(
  a: UniqueFactorizationDomain<T>,
  b: UniqueFactorizationDomain<T>
): UniqueFactorizationDomain<T> {
  const a_factors = a.factorize();
  const b_factors = b.factorize();
  const gcd_factors: Array<{
    factor: UniqueFactorizationDomain<T>;
    exponent: number;
  }> = [];
  const a_factor_strings_to_index: { [key: string]: number } = {};
  const b_factor_strings_to_index: { [key: string]: number } = {};
  for (let i = 0; i < a_factors.length; i++) {
    a_factor_strings_to_index[a_factors[i].factor.toString()] = i;
  }
  for (let i = 0; i < b_factors.length; i++) {
    b_factor_strings_to_index[b_factors[i].factor.toString()] = i;
  }
  for (let i = 0; i < a_factors.length; i++) {
    const b_index = b_factor_strings_to_index[a_factors[i].factor.toString()];
    if (b_index != undefined) {
      gcd_factors.push({
        factor: a_factors[i].factor,
        exponent: Math.min(a_factors[i].exponent, b_factors[b_index].exponent),
      });
    }
  }
  return defactorize(gcd_factors, a.one as UniqueFactorizationDomain<T>);
}

export function lcm<T>(
  a: UniqueFactorizationDomain<T>,
  b: UniqueFactorizationDomain<T>
) {
  const a_factors = a.factorize();
  const b_factors = b.factorize();
  const lcm_factors: Array<{
    factor: UniqueFactorizationDomain<T>;
    exponent: number;
  }> = [];
  const a_factor_strings_to_index: { [key: string]: number } = {};
  const b_factor_strings_to_index: { [key: string]: number } = {};
  const factors_set: Set<string> = new Set<string>();
  for (let i = 0; i < a_factors.length; i++) {
    a_factor_strings_to_index[a_factors[i].factor.toString()] = i;
    factors_set.add(a_factors[i].factor.toString());
  }
  for (let i = 0; i < b_factors.length; i++) {
    b_factor_strings_to_index[b_factors[i].factor.toString()] = i;
    factors_set.add(b_factors[i].factor.toString());
  }
  for (const factor_string of factors_set) {
    const a_index = a_factor_strings_to_index[factor_string];
    const b_index = b_factor_strings_to_index[factor_string];
    if (a_index != undefined && b_index != undefined) {
      lcm_factors.push({
        factor: a_factors[a_index].factor,
        exponent: Math.max(
          a_factors[a_index].exponent,
          b_factors[b_index].exponent
        ),
      });
    } else if (a_index != undefined) {
      lcm_factors.push(a_factors[a_index]);
    } else {
      lcm_factors.push(b_factors[b_index]);
    }
  }
  return defactorize(lcm_factors, a.one as UniqueFactorizationDomain<T>);
}
