import { ComplexRationalSquareMatrix } from "../../src/math/ComplexRationalSquareMatrix";
import { Rational } from "../../src/math/Rational";
import { ComplexRational } from "../../src/math/ComplexRational";
import { ComplexRationalPoly } from "../../src/math/ComplexRationalPoly";

describe("Complex rational square matrix module tests", () => {
  it("Complex rational square matrix elimination invertible", () => {
    const matrix = new ComplexRationalSquareMatrix([
      [ComplexRational.fromInt(3), ComplexRational.one()],
      [ComplexRational.zero(), ComplexRational.fromInt(2)],
    ]);
    const [eliminated_matrix, transformation_matrix, rank] =
      matrix.gaussian_elimination();
    expect(eliminated_matrix).toStrictEqual(
      ComplexRationalSquareMatrix.identity(2)
    );
    expect(transformation_matrix).toStrictEqual(
      new ComplexRationalSquareMatrix([
        [
          ComplexRational.fromRational(new Rational(1, 3)),
          ComplexRational.fromRational(new Rational(-1, 6)),
        ],
        [
          ComplexRational.fromRational(new Rational(0, 1)),
          ComplexRational.fromRational(new Rational(1, 2)),
        ],
      ])
    );
    expect(rank).toBe(2);
    expect(
      ComplexRationalSquareMatrix.matMul(matrix, transformation_matrix)
    ).toStrictEqual(ComplexRationalSquareMatrix.identity(2));
  });

  it("Complex rational square matrix elimination non-invertible", () => {
    const matrix = new ComplexRationalSquareMatrix([
      [ComplexRational.fromInt(3), ComplexRational.one()],
      [ComplexRational.fromInt(6), ComplexRational.fromInt(2)],
    ]);
    const [eliminated_matrix, transformation_matrix, rank] =
      matrix.gaussian_elimination();
    expect(eliminated_matrix).toStrictEqual(
      new ComplexRationalSquareMatrix([
        [
          ComplexRational.fromInt(1),
          ComplexRational.fromRational(new Rational(1, 3)),
        ],
        [ComplexRational.zero(), ComplexRational.zero()],
      ])
    );
    expect(transformation_matrix).toStrictEqual(
      new ComplexRationalSquareMatrix([
        [
          ComplexRational.fromRational(new Rational(1, 3)),
          ComplexRational.zero(),
        ],
        [ComplexRational.fromInt(-2), ComplexRational.one()],
      ])
    );
  });

  it("Complex rational square matrix characteristic polynomial", () => {
    const matrix = new ComplexRationalSquareMatrix([
      [ComplexRational.fromInt(3), ComplexRational.zero()],
      [ComplexRational.zero(), ComplexRational.fromInt(2)],
    ]);
    const characteristic_polynomial = matrix.charPoly();
    expect(characteristic_polynomial).toStrictEqual(
      new ComplexRationalPoly([
        ComplexRational.fromInt(6),
        ComplexRational.fromInt(5),
        ComplexRational.fromInt(1),
      ])
    );
    const determinant = matrix.determinant();
    const characteristic_polynomial_evaluated_at_0 =
      characteristic_polynomial.evaluate(ComplexRational.zero());
    expect(characteristic_polynomial_evaluated_at_0).toEqual(determinant);
  });
});
