import { Rational } from "../../src/math/Rational";

describe("Rational module tests", () => {
  it("Check rational to floating point", () => {
    const r1 = new Rational(1, 2);
    expect(r1.toFP()).toBeCloseTo(0.5);
  });

  it("Check rational clone", () => {
    const r1 = new Rational(1, 2);
    const r2 = r1.clone();
    expect(r1).toStrictEqual(r2);
  });

  it("Check rational negation", () => {
    const r1 = new Rational(1, 2);
    const r2 = Rational.neg(r1);
    expect(r2).toStrictEqual(new Rational(-1, 2));
  });

  it("Check rational inversion", () => {
    const r1 = new Rational(1, 2);
    const r2 = Rational.inv(r1);
    expect(r2).toStrictEqual(new Rational(2, 1));
  });

  it("Check rational addition", () => {
    const r1 = new Rational(1, 2);
    const r2 = new Rational(1, 3);
    const r3 = Rational.add(r1, r2);
    expect(r3).toStrictEqual(new Rational(5, 6));
  });
});
