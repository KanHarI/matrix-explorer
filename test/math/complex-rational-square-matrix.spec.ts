import { ComplexRationalSquareMatrix } from "../../src/math/ComplexRationalSquareMatrix";
import { Rational } from "../../src/math/Rational";
import { ComplexRational } from "../../src/math/ComplexRational";

describe("Complex rational square matrix module tests", () => {
  it("Complex rational square matrix elimination1", () => {
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
  });
});
