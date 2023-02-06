import { Rational } from "./Rational";
import { RationalPoly } from "./RationalPoly";
import { RationalPolySquareMatrix } from "./RationalPolySquareMatrix";
import { ComplexRatioRootsPolySquareMatrix } from "./ComplexRatioRootsPolySquareMatrix";
import { ComplexRatioRoots } from "./ComplexRatioRoots";
import { ComplexRatioRootsPoly } from "./ComplexRatioRootsPoly";

export class RationalSquareMatrix {
  private _entries: Array<Array<Rational>>;

  constructor(entries: Array<Array<Rational>>) {
    this._entries = entries.map((row) => row.map((entry) => entry.clone()));
  }

  clone(): RationalSquareMatrix {
    return new RationalSquareMatrix(
      this._entries.map((row) => row.map((entry) => entry.clone()))
    );
  }

  static zero(n: number): RationalSquareMatrix {
    const entries: Array<Array<Rational>> = [];
    for (let i = 0; i < n; i++) {
      entries.push([]);
      for (let j = 0; j < n; j++) {
        entries[i].push(Rational.zero());
      }
    }
    return new RationalSquareMatrix(entries);
  }

  static identity(n: number): RationalSquareMatrix {
    const entries: Array<Array<Rational>> = [];
    for (let i = 0; i < n; i++) {
      entries.push([]);
      for (let j = 0; j < n; j++) {
        if (i == j) {
          entries[i].push(Rational.one());
        } else {
          entries[i].push(Rational.zero());
        }
      }
    }
    return new RationalSquareMatrix(entries);
  }

  gaussian_elimination(): [RationalSquareMatrix, RationalSquareMatrix, number] {
    let rank = 0;
    const cloned_matrix = this.clone();
    let active_column = 0;
    const transformation_matrix = RationalSquareMatrix.identity(
      this._entries.length
    );
    let start_row = 0;
    while (
      active_column < cloned_matrix._entries.length &&
      start_row < cloned_matrix._entries.length
    ) {
      let pivot_row = start_row;
      for (const row of cloned_matrix._entries.slice(start_row)) {
        if (!row[active_column].isZero()) {
          break;
        }
        pivot_row++;
      }
      // If the column is all zero, skip it
      if (pivot_row == cloned_matrix._entries.length) {
        active_column++;
        continue;
      }
      // Swap the pivot row and the start row
      const temp = cloned_matrix._entries[start_row];
      cloned_matrix._entries[start_row] = cloned_matrix._entries[pivot_row];
      cloned_matrix._entries[pivot_row] = temp;
      const temp2 = transformation_matrix._entries[start_row];
      transformation_matrix._entries[start_row] =
        transformation_matrix._entries[pivot_row];
      transformation_matrix._entries[pivot_row] = temp2;
      // Make the pivot entry 1
      const pivot_entry =
        cloned_matrix._entries[start_row][active_column].clone();
      for (let i = 0; i < cloned_matrix._entries.length; i++) {
        cloned_matrix._entries[start_row][i].divEq(pivot_entry);
        transformation_matrix._entries[start_row][i].divEq(pivot_entry);
      }
      // Make the other entries in the column 0
      for (let i = 0; i < cloned_matrix._entries.length; i++) {
        if (i == start_row) {
          continue;
        }
        const entry = cloned_matrix._entries[i][active_column].clone();
        for (let j = 0; j < cloned_matrix._entries.length; j++) {
          cloned_matrix._entries[i][j].subEq(
            cloned_matrix._entries[start_row][j].clone().mulEq(entry)
          );
          transformation_matrix._entries[i][j].subEq(
            transformation_matrix._entries[start_row][j].clone().mulEq(entry)
          );
        }
      }
      rank++;
      start_row++;
      active_column++;
    }
    return [cloned_matrix, transformation_matrix, rank];
  }

  get entries(): Array<Array<Rational>> {
    return this._entries.map((row) => row.map((entry) => entry.clone()));
  }

  get rank(): number {
    return this.gaussian_elimination()[2];
  }

  minor(i: number, j: number): RationalSquareMatrix {
    const entries = this._entries.map((row) =>
      row.map((entry) => entry.clone())
    );
    entries.splice(i, 1);
    for (let i = 0; i < entries.length; i++) {
      entries[i].splice(j, 1);
    }
    return new RationalSquareMatrix(entries);
  }

  determinant(): Rational {
    if (this._entries.length == 1) {
      return this._entries[0][0];
    }
    const det = Rational.zero();
    for (let i = 0; i < this._entries.length; i++) {
      const sign = i % 2 == 0 ? Rational.one() : Rational.neg(Rational.one());
      det.addEq(
        this._entries[0][i]
          .clone()
          .mulEq(sign)
          .mulEq(this.minor(0, i).determinant())
      );
    }
    return det;
  }

  charPoly(): RationalPoly {
    const poly_entries: Array<Array<RationalPoly>> = new Array<
      Array<RationalPoly>
    >();
    for (let i = 0; i < this._entries.length; i++) {
      poly_entries.push([]);
      for (let j = 0; j < this._entries.length; j++) {
        if (i == j) {
          poly_entries[i].push(
            new RationalPoly([
              this._entries[i][j].clone(),
              Rational.neg(Rational.one()),
            ])
          );
        } else {
          poly_entries[i].push(new RationalPoly([this._entries[i][j].clone()]));
        }
      }
    }
    const poly_matrix = new RationalPolySquareMatrix(poly_entries);
    return poly_matrix.determinant();
  }

  toComplexRatioRootsPolySquareMatrix(): ComplexRatioRootsPolySquareMatrix {
    const entries: Array<Array<ComplexRatioRootsPoly>> = [];
    for (let i = 0; i < this._entries.length; i++) {
      entries.push([]);
      for (let j = 0; j < this._entries.length; j++) {
        entries[i].push(
          new ComplexRatioRootsPoly([
            ComplexRatioRoots.fromRational(this._entries[i][j].clone()),
          ])
        );
      }
    }
    return new ComplexRatioRootsPolySquareMatrix(entries);
  }

  mulEq(other: RationalSquareMatrix): RationalSquareMatrix {
    const entries: Array<Array<Rational>> = [];
    for (let i = 0; i < this._entries.length; i++) {
      entries.push([]);
      for (let j = 0; j < this._entries.length; j++) {
        entries[i].push(Rational.zero());
        for (let k = 0; k < this._entries.length; k++) {
          entries[i][j].addEq(
            this._entries[i][k].clone().mulEq(other._entries[k][j])
          );
        }
      }
    }
    this._entries = entries;
    return this;
  }

  mul(other: RationalSquareMatrix): RationalSquareMatrix {
    return this.clone().mulEq(other);
  }
}
