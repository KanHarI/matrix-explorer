import { Rational } from "../../src/math/Rational";
import { RationalSquareMatrix } from "../../src/math/RationalSquareMatrix";
import { ComplexRationalSquareMatrix } from "../../src/math/ComplexRationalSquareMatrix";
import { ComplexRational } from "../../src/math/ComplexRational";

describe("Tests for the RationalMatrix class", () => {
  it("Gaussian elimination", () => {
    const matrix = new RationalSquareMatrix([
      [Rational.fromInt(3), Rational.one()],
      [Rational.zero(), Rational.fromInt(2)],
    ]);
    const [eliminated_matrix, transformation_matrix, rank] =
      matrix.gaussian_elimination();
    expect(eliminated_matrix).toStrictEqual(RationalSquareMatrix.identity(2));
    expect(transformation_matrix).toStrictEqual(
      new RationalSquareMatrix([
        [new Rational(1, 3), new Rational(-1, 6)],
        [new Rational(0, 1), new Rational(1, 2)],
      ])
    );
    expect(rank).toBe(2);
    expect(matrix.mulEq(transformation_matrix)).toStrictEqual(
      RationalSquareMatrix.identity(2)
    );
  });
});
