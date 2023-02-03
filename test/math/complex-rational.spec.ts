import { ComplexRational } from "../../src/math/ComplexRational";
import { Rational } from "../../src/math/Rational";

describe("Complex rational module tests", () => {
  it("Complex rational addition", () => {
    const a = new ComplexRational(new Rational(1, 2), new Rational(1, 3));
    const b = new ComplexRational(new Rational(1, 4), new Rational(1, 5));
    const c = ComplexRational.add(a, b);
    expect(c).toStrictEqual(
      new ComplexRational(new Rational(3, 4), new Rational(8, 15))
    );
  });

  it("Complex rational subtraction", () => {
    const a = new ComplexRational(new Rational(1, 2), new Rational(1, 3));
    const b = new ComplexRational(new Rational(1, 4), new Rational(1, 5));
    const c = ComplexRational.sub(a, b);
    expect(c).toStrictEqual(
      new ComplexRational(new Rational(1, 4), new Rational(2, 15))
    );
  });

  it("Complex rational multiplication", () => {
    const a = new ComplexRational(new Rational(1, 2), new Rational(1, 3));
    const b = new ComplexRational(new Rational(1, 4), new Rational(1, 5));
    const c = ComplexRational.mul(a, b);
    expect(c).toStrictEqual(
      new ComplexRational(new Rational(7, 120), new Rational(11, 60))
    );
  });

  it("Complex rational division", () => {
    const a = new ComplexRational(new Rational(1, 2), new Rational(1, 3));
    const b = new ComplexRational(new Rational(1, 4), new Rational(1, 5));
    const c = ComplexRational.div(a, b);
    expect(c).toStrictEqual(
      new ComplexRational(new Rational(230, 123), new Rational(-20, 123))
    );
  });
});
