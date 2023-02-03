export const MAX_NUMBER_THEORETIC_INPUT = 1_000_000_000_000_000;
let GLOBAL_PRIMES: Set<number> = new Set<number>([2]);
let PRIMES_CHECKED_UP_TO = 2;

/**
 * Exported for performance testing
 */
export function reset_primes_population() {
  GLOBAL_PRIMES = new Set<number>([2]);
  PRIMES_CHECKED_UP_TO = 2;
}

export function verify_number_theoretic_input(n: number) {
  if (
    !Number.isInteger(n) ||
    !Number.isFinite(n) ||
    n < 0 ||
    n > MAX_NUMBER_THEORETIC_INPUT
  ) {
    throw new Error(
      `Expected a positive integer under 1 billion for number theoretic functions! Got ${n}`
    );
  }
}

/**
 * Exported to allow for higher performance where large inputs are expected
 * @param n
 */
export function populate_primes_up_to(n: number) {
  while (PRIMES_CHECKED_UP_TO < n) {
    PRIMES_CHECKED_UP_TO++;
    const candidate_prime = PRIMES_CHECKED_UP_TO;
    // I a number is not prime, it must have a prime divisor smaller than its
    // square or equal to it
    const inner_max_to_check = Math.ceil(Math.sqrt(candidate_prime));
    let is_prime = true;
    // Iteration order over sets equals insertion order
    for (const prime of GLOBAL_PRIMES) {
      if (candidate_prime % prime === 0) {
        is_prime = false;
        break;
      }
      if (prime > inner_max_to_check) {
        break;
      }
    }
    if (is_prime) {
      GLOBAL_PRIMES.add(candidate_prime);
    }
  }
}

function _is_prime(n: number): boolean {
  if (GLOBAL_PRIMES.has(n)) {
    return true;
  }
  if (n <= PRIMES_CHECKED_UP_TO) {
    return false;
  }
  // I a number is not prime, it must have a prime divisor smaller than its
  // square or equal to it
  const max_to_check = Math.ceil(Math.sqrt(n));
  populate_primes_up_to(max_to_check);

  // Now primes are checked up to sqrt n
  // Iteration order over sets equals insertion order
  for (const prime of GLOBAL_PRIMES) {
    if (n % prime === 0) {
      return false;
    }
    if (prime > max_to_check) {
      break;
    }
  }
  return true;
}

/**
 * Check if a number is prime
 * @param n
 */
export function is_prime(n: number): boolean {
  verify_number_theoretic_input(n);
  return _is_prime(n);
}

function _factorize(n: number): Record<number, number> {
  // All prime divisors but one are smaller than the square root
  let max_relevant = Math.ceil(Math.sqrt(n));
  populate_primes_up_to(max_relevant);
  const result: Record<number, number> = {};
  // Iteration order over sets equals insertion order
  for (const prime of GLOBAL_PRIMES) {
    if (prime > max_relevant) {
      break;
    }
    if (n % prime === 0) {
      result[prime] = 1;
      n /= prime;
    }
    while (n % prime === 0) {
      result[prime]++;
      n /= prime;
    }
    max_relevant = Math.ceil(Math.sqrt(n));
  }
  if (n > 1) {
    // We are left with a divisor that we did not have to check through the loop
    // - it is necessarily prime, and unique from all factors we have found
    result[n] = 1;
  }
  return result;
}

/**
 * Factorize a number.
 * e.g. `expect(factorize(98)).toStrictEqual({ "2": 1, "7": 2 });`
 * @param n
 */
export function factorize(n: number): Record<number, number> {
  verify_number_theoretic_input(n);
  return _factorize(n);
}

export function _defactorize(factors: Record<number, number>): number {
  let result = 1;
  for (const prime_str of Object.keys(factors)) {
    const prime = Number(prime_str);
    if (!Number.isInteger(prime) || prime < 2) {
      throw new Error(
        `Expected a positive integer greater than 1 for prime factors! Got ${prime}`
      );
    }
    const power = factors[prime];
    result *= prime ** power;
  }
  return result;
}

function _sigma(n: number): number {
  // If n = p^a*q^b for primes p, q, the sum of its divisors can be written as
  // (1+p+p^2+...+p^a)(1+q+q^2+...+q^b) as can be easily demonstrated by
  // expanding this product. As this is the sum of a geometric series, it
  // becomes (p^(a+1)-1)/p^a * (q^(b+1)-1)/q^b
  let result = 1;
  const factorized = factorize(n);
  for (const prime_str of Object.keys(factorized)) {
    const prime = Number(prime_str);
    const denominator = prime - 1;
    const power = factorized[prime];
    if (power == 1) {
      result *= (prime ** 2 - 1) / denominator;
      continue;
    }
    const nuerator = prime ** (power + 1) - 1;
    result *= nuerator / denominator;
  }
  return result;
}

/**
 * Find the sum of divisors of a number
 * @param n
 */
export function sigma(n: number): number {
  verify_number_theoretic_input(n);
  return _sigma(n);
}

/**
 * Sum of proper divisors of a number
 * @param n
 */
export function d(n: number): number {
  return sigma(n) - n;
}

export function gcd(arr: Array<number>): number {
  const minimal_number = Math.min(...arr);
  const gcd_factorization = factorize(minimal_number);
  for (const _number of arr) {
    if (!Number.isInteger(_number) || _number < 1) {
      console.trace("HERE");
      throw new Error(`Expected a positive integer for gcd! Got ${_number}`);
    }
    for (const prime_str of Object.keys(gcd_factorization)) {
      const prime = Number(prime_str);
      let power = gcd_factorization[prime];
      while (_number % prime ** power !== 0 && power > 0) {
        power--;
      }
      if (power === 0) {
        delete gcd_factorization[prime];
      } else {
        gcd_factorization[prime] = power;
      }
    }
  }
  return _defactorize(gcd_factorization);
}

export const PRIMES_UP_TO_100 = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97,
];
