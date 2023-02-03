import { ComplexRationalPoly } from "./ComplexRationalPoly";

export class ComplexRationalSquarePolyMatrix {
  private _entries: Array<Array<ComplexRationalPoly>>;

  constructor(entries: Array<Array<ComplexRationalPoly>>) {
    this._entries = entries.map((row) => row.map((entry) => entry.clone()));
  }

  clone(): ComplexRationalSquarePolyMatrix {
    return new ComplexRationalSquarePolyMatrix(
      this._entries.map((row) => row.map((entry) => entry.clone()))
    );
  }

  minor(row: number, column: number): ComplexRationalSquarePolyMatrix {
    const entries: Array<Array<ComplexRationalPoly>> = [];
    for (let i = 0; i < this._entries.length; i++) {
      if (i == row) {
        continue;
      }
      entries.push([]);
      for (let j = 0; j < this._entries.length; j++) {
        if (j == column) {
          continue;
        }
        entries[entries.length - 1].push(this._entries[i][j].clone());
      }
    }
    return new ComplexRationalSquarePolyMatrix(entries);
  }

  determinant(): ComplexRationalPoly {
    if (this._entries.length == 1) {
      return this._entries[0][0].clone();
    }
    let det = ComplexRationalPoly.zero();
    for (let i = 0; i < this._entries.length; i++) {
      const minor = this.minor(0, i);
      const entry = this._entries[0][i].clone();
      if (i % 2 == 1) {
        entry.mulEq(ComplexRationalPoly.one().negEq());
      }
      det.addEq(entry.mulEq(minor.determinant()));
    }
    return det;
  }
}
