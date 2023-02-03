import { ComplexRational } from "../../src/math/ComplexRational";
import { ComplexRationalPoly } from "../../src/math/ComplexRationalPoly";

describe("Complex rational polynomial module tests", () => {
  it("Complex rational polynomial addition", () => {
    const a = new ComplexRationalPoly([
      ComplexRational.fromInt(1),
      ComplexRational.fromInt(2),
      ComplexRational.fromInt(3),
    ]);
    const b = new ComplexRationalPoly([
      ComplexRational.fromInt(4),
      ComplexRational.fromInt(5),
      ComplexRational.fromInt(6),
    ]);
    const c = ComplexRationalPoly.add(a, b);
    expect(c).toStrictEqual(
      new ComplexRationalPoly([
        ComplexRational.fromInt(5),
        ComplexRational.fromInt(7),
        ComplexRational.fromInt(9),
      ])
    );
  });
});
