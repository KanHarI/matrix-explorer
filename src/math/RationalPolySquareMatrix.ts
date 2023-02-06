import { RationalPoly } from "./RationalPoly";

export class RationalPolySquareMatrix {
  private _coefficients: Array<Array<RationalPoly>>;

  constructor(coefficients: Array<Array<RationalPoly>>) {
    this._coefficients = coefficients.map((row) =>
      row.map((coefficient) => coefficient.clone())
    );
  }

  clone(): RationalPolySquareMatrix {
    return new RationalPolySquareMatrix(
      this._coefficients.map((row) =>
        row.map((coefficient) => coefficient.clone())
      )
    );
  }

  static zero(n: number): RationalPolySquareMatrix {
    const coefficients: Array<Array<RationalPoly>> = [];
    for (let i = 0; i < n; i++) {
      coefficients.push([]);
      for (let j = 0; j < n; j++) {
        coefficients[i].push(RationalPoly.zero());
      }
    }
    return new RationalPolySquareMatrix(coefficients);
  }

  static identity(n: number): RationalPolySquareMatrix {
    const coefficients: Array<Array<RationalPoly>> = [];
    for (let i = 0; i < n; i++) {
      coefficients.push([]);
      for (let j = 0; j < n; j++) {
        if (i == j) {
          coefficients[i].push(RationalPoly.one());
        } else {
          coefficients[i].push(RationalPoly.zero());
        }
      }
    }
    return new RationalPolySquareMatrix(coefficients);
  }

  negEq(): RationalPolySquareMatrix {
    for (let i = 0; i < this._coefficients.length; i++) {
      for (let j = 0; j < this._coefficients.length; j++) {
        this._coefficients[i][j].negEq();
      }
    }
    return this;
  }

  static neg(matrix: RationalPolySquareMatrix): RationalPolySquareMatrix {
    return matrix.clone().negEq();
  }

  addEq(matrix: RationalPolySquareMatrix): RationalPolySquareMatrix {
    for (let i = 0; i < this._coefficients.length; i++) {
      for (let j = 0; j < this._coefficients.length; j++) {
        this._coefficients[i][j].addEq(matrix._coefficients[i][j]);
      }
    }
    return this;
  }

  static add(
    matrix1: RationalPolySquareMatrix,
    matrix2: RationalPolySquareMatrix
  ): RationalPolySquareMatrix {
    return matrix1.clone().addEq(matrix2);
  }

  subEq(matrix: RationalPolySquareMatrix): RationalPolySquareMatrix {
    for (let i = 0; i < this._coefficients.length; i++) {
      for (let j = 0; j < this._coefficients.length; j++) {
        this._coefficients[i][j].subEq(matrix._coefficients[i][j]);
      }
    }
    return this;
  }

  static sub(
    matrix1: RationalPolySquareMatrix,
    matrix2: RationalPolySquareMatrix
  ): RationalPolySquareMatrix {
    return matrix1.clone().subEq(matrix2);
  }

  mulEq(matrix: RationalPolySquareMatrix): RationalPolySquareMatrix {
    const new_coefficients: Array<Array<RationalPoly>> = [];
    for (let i = 0; i < this._coefficients.length; i++) {
      new_coefficients.push([]);
      for (let j = 0; j < this._coefficients.length; j++) {
        new_coefficients[i].push(RationalPoly.zero());
        for (let k = 0; k < this._coefficients.length; k++) {
          new_coefficients[i][j].addEq(
            this._coefficients[i][k].clone().mulEq(matrix._coefficients[k][j])
          );
        }
      }
    }
    this._coefficients = new_coefficients;
    return this;
  }

  static mul(
    matrix1: RationalPolySquareMatrix,
    matrix2: RationalPolySquareMatrix
  ): RationalPolySquareMatrix {
    return matrix1.clone().mulEq(matrix2);
  }

  minor(i: number, j: number): RationalPolySquareMatrix {
    const new_coefficients: Array<Array<RationalPoly>> = [];
    for (let k = 0; k < this._coefficients.length; k++) {
      if (k == i) {
        continue;
      }
      new_coefficients.push([]);
      for (let l = 0; l < this._coefficients.length; l++) {
        if (l == j) {
          continue;
        }
        new_coefficients[new_coefficients.length - 1].push(
          this._coefficients[k][l]
        );
      }
    }
    return new RationalPolySquareMatrix(new_coefficients);
  }

  determinant(): RationalPoly {
    if (this._coefficients.length == 1) {
      return this._coefficients[0][0];
    }
    const det = RationalPoly.zero();
    for (let i = 0; i < this._coefficients.length; i++) {
      const sign =
        i % 2 == 0 ? RationalPoly.one() : RationalPoly.neg(RationalPoly.one());
      det.addEq(
        this._coefficients[0][i]
          .clone()
          .mulEq(sign)
          .mulEq(this.minor(0, i).determinant())
      );
    }
    return det;
  }
}
