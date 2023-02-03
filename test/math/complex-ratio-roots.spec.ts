import { ComplexRatioRoots } from "../../src/math/ComplexRatioRoots";
import { RatioRoots } from "../../src/math/RatioRoots";
import { Rational } from "../../src/math/Rational";
describe("Complex ratio roots module tests", () => {
  it("Complex ratio roots addition", () => {
    const a = new ComplexRatioRoots(
      new RatioRoots({ 2: new Rational(1, 1) }),
      new RatioRoots({ 3: new Rational(1, 1) })
    );
    const b = new ComplexRatioRoots(
      new RatioRoots({ 4: new Rational(1, 1) }),
      new RatioRoots({ 5: new Rational(1, 1) })
    );
    const c = ComplexRatioRoots.add(a, b);
    expect(c).toStrictEqual(
      new ComplexRatioRoots(
        new RatioRoots({ 1: new Rational(2, 1), 2: new Rational(1, 1) }),
        new RatioRoots({ 3: new Rational(1, 1), 5: new Rational(1, 1) })
      )
    );
  });

  it("Complex ratio roots multiplication", () => {
    const a = new ComplexRatioRoots(
      new RatioRoots({ 2: new Rational(1, 1) }),
      new RatioRoots({ 3: new Rational(1, 1) })
    );
    const b = new ComplexRatioRoots(
      new RatioRoots({ 4: new Rational(1, 1) }),
      new RatioRoots({ 5: new Rational(1, 1) })
    );
    const c = ComplexRatioRoots.mul(a, b);
    expect(c).toStrictEqual(
      new ComplexRatioRoots(
        new RatioRoots({ 2: new Rational(2, 1), 15: new Rational(-1, 1) }),
        new RatioRoots({ 3: new Rational(2, 1), 10: new Rational(1, 1) })
      )
    );
  });
});
