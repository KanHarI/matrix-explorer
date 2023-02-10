export interface CommutativeRing<T> {
  zero: CommutativeRing<T>;
  one: CommutativeRing<T>;
  clone(): CommutativeRing<T>;
  isEq(x: CommutativeRing<T>): boolean;
  negEq: () => CommutativeRing<T>;
  addEq: (x: CommutativeRing<T>) => CommutativeRing<T>;
  mulEq: (x: CommutativeRing<T>) => CommutativeRing<T>;
  attemptInvert():
    | { success: false }
    | { success: true; inverse: CommutativeRing<T> };
}

export function neg<T>(a: CommutativeRing<T>): CommutativeRing<T> {
  return a.clone().negEq();
}

export function add<T>(
  a: CommutativeRing<T>,
  b: CommutativeRing<T>
): CommutativeRing<T> {
  return a.clone().addEq(b);
}

export function sub<T>(
  a: CommutativeRing<T>,
  b: CommutativeRing<T>
): CommutativeRing<T> {
  return b.clone().negEq().addEq(a);
}

export function mul<T>(
  a: CommutativeRing<T>,
  b: CommutativeRing<T>
): CommutativeRing<T> {
  return a.clone().mulEq(b);
}

export function _pow<T>(a: CommutativeRing<T>, n: number): CommutativeRing<T> {
  if (n === 0) {
    return a.one;
  } else if (n === 1) {
    return a;
  } else if (n % 2 === 0) {
    return _pow(mul(a, a), n / 2);
  } else {
    return mul(a, _pow(a, n - 1));
  }
}

export function isZero<T>(a: CommutativeRing<T>): boolean {
  return a.isEq(a.zero);
}

export function isOne<T>(a: CommutativeRing<T>): boolean {
  return a.isEq(a.one);
}
