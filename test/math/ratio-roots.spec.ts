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
});
