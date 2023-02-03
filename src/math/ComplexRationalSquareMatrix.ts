import { ComplexRational } from "./ComplexRational";
import { Rational } from "./Rational";

export class ComplexRationalSquareMatrix {
  private _entries: Array<Array<ComplexRational>>;

  constructor(entries: Array<Array<ComplexRational>>) {
    this._entries = entries.map((row) => row.map((entry) => entry.clone()));
  }

  clone(): ComplexRationalSquareMatrix {
    return new ComplexRationalSquareMatrix(
      this._entries.map((row) => row.map((entry) => entry.clone()))
    );
  }

  static zero(n: number): ComplexRationalSquareMatrix {
    const entries: Array<Array<ComplexRational>> = [];
    for (let i = 0; i < n; i++) {
      entries.push([]);
      for (let j = 0; j < n; j++) {
        entries[i].push(
          ComplexRational.zero()
        );
      }
    }
    return new ComplexRationalSquareMatrix(entries);
  }

  static identity(n: number): ComplexRationalSquareMatrix {
    const entries: Array<Array<ComplexRational>> = [];
    for (let i = 0; i < n; i++) {
      entries.push([]);
      for (let j = 0; j < n; j++) {
        if (i == j) {
          entries[i].push(
            ComplexRational.one()
          );
        } else {
          entries[i].push(
            ComplexRational.zero()
          );
        }
      }
    }
    return new ComplexRationalSquareMatrix(entries);
  }

  /**
   * Returns the matrix after gaussian elimination, and the transformation matrix
   */
  gaussian_elimination(): [
    ComplexRationalSquareMatrix,
    ComplexRationalSquareMatrix,
    number
  ] {
    let rank = 0;
    const cloned_matrix = this.clone();
    let active_column = 0;
    const transformation_matrix = ComplexRationalSquareMatrix.identity(
      this._entries.length
    );
    let start_row = 0;
    while (
      active_column < this._entries.length &&
      start_row < this._entries.length
    ) {
      let pivot_row = start_row;
      for (const row of this._entries.slice(start_row)) {
        if (!row[active_column].normSquared().isZero()) {
          break;
        }
        pivot_row++;
      }
      // If the column is all zero, skip it
      if (pivot_row == this._entries.length) {
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
      }
      for (let i = 0; i < transformation_matrix._entries.length; i++) {
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
        }
        for (let j = 0; j < transformation_matrix._entries.length; j++) {
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
}
