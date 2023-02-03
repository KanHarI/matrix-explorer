import { RatioRoots } from "../../src/math/RatioRoots";
import { Rational } from "../../src/math/Rational";

describe("Rational square roots field tests", () => {
  it("Check rational roots canonical form", () => {
    const ratioRoot = new RatioRoots({
      1: new Rational(1, 2),
      2: new Rational(1, 3),
      4: new Rational(1, 3),
      12: new Rational(1, 2),
    });
    const coefficients = ratioRoot.coefficients;
    expect(coefficients).toStrictEqual({
      1: new Rational(7, 6),
      2: new Rational(1, 3),
      3: new Rational(1, 1),
    });
  });

  it("Check rational roots addition", () => {
    const r1 = new RatioRoots({
      1: new Rational(1, 2),
      2: new Rational(1, 3),
    });
    const r2 = new RatioRoots({
      1: new Rational(1, 3),
      3: new Rational(1, 2),
    });
    const result = RatioRoots.add(r1, r2);
    expect(result.coefficients).toStrictEqual({
      1: new Rational(5, 6),
      2: new Rational(1, 3),
      3: new Rational(1, 2),
    });
  });

  it("Check rational roots negation", () => {
    const r1 = new RatioRoots({
      1: new Rational(1, 2),
      2: new Rational(1, 3),
    });
    const result = RatioRoots.neg(r1);
    expect(result.coefficients).toStrictEqual({
      1: new Rational(-1, 2),
      2: new Rational(-1, 3),
    });
  });

  it("Check rational roots multiplication", () => {
    const r1 = new RatioRoots({
      1: new Rational(1, 2),
      2: new Rational(1, 3),
    });
    const r2 = new RatioRoots({
      1: new Rational(1, 3),
      3: new Rational(1, 2),
    });
    const result = RatioRoots.mul(r1, r2);
    expect(result.coefficients).toStrictEqual({
      1: new Rational(1, 6),
      2: new Rational(1, 9),
      3: new Rational(1, 4),
      6: new Rational(1, 6),
    });
  });

  it("Check rational roots inversion1", () => {
    const r = new RatioRoots({
      1: new Rational(1, 1),
      2: new Rational(1, 1),
    });
    const result = RatioRoots.inv(r);
    expect(result.coefficients).toStrictEqual({
      1: new Rational(-1, 1),
      2: new Rational(1, 1),
    });
  });

  it("Check rational roots inversion2", () => {
    const r = new RatioRoots({
      1: new Rational(1, 1),
      2: new Rational(1, 3),
      3: new Rational(1, 2),
    });
    const result = RatioRoots.inv(r);
    expect(result.coefficients).toStrictEqual({
      1: new Rational(-36, 863),
      2: new Rational(660, 863),
      3: new Rational(306, 863),
      6: new Rational(-432, 863),
    });
  });
});
