import { ComplexRational } from "./ComplexRational";
import { ComplexRationalPoly } from "./ComplexRationalPoly";
import { ComplexRationalSquarePolyMatrix } from "./ComplexRationalSquarePolyMatrix";
import { ComplexRatioRootsSquareMatrix } from "./ComplexRatioRootsSquareMatrix";
import { ComplexRatioRoots } from "./ComplexRatioRoots";
import { ComplexRatioRootsPolySquareMatrix } from "./ComplexRatioRootsPolySquareMatrix";
import { ComplexRatioRootsPoly } from "./ComplexRatioRootsPoly";

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
        entries[i].push(ComplexRational.zero());
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
          entries[i].push(ComplexRational.one());
        } else {
          entries[i].push(ComplexRational.zero());
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
      active_column < cloned_matrix._entries.length &&
      start_row < cloned_matrix._entries.length
    ) {
      let pivot_row = start_row;
      for (const row of cloned_matrix._entries.slice(start_row)) {
        if (!row[active_column].normSquared().isZero()) {
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

  matMulEq(other: ComplexRationalSquareMatrix): ComplexRationalSquareMatrix {
    const new_entries: Array<Array<ComplexRational>> = [];
    for (let i = 0; i < this._entries.length; i++) {
      new_entries.push([]);
      for (let j = 0; j < this._entries.length; j++) {
        const sum = ComplexRational.zero();
        for (let k = 0; k < this._entries.length; k++) {
          sum.addEq(this._entries[i][k].clone().mulEq(other._entries[k][j]));
        }
        new_entries[i].push(sum);
      }
    }
    this._entries = new_entries;
    return this;
  }

  static matMul(
    a: ComplexRationalSquareMatrix,
    b: ComplexRationalSquareMatrix
  ): ComplexRationalSquareMatrix {
    return a.clone().matMulEq(b);
  }

  static matMulVec(
    a: ComplexRationalSquareMatrix,
    b: Array<ComplexRational>
  ): Array<ComplexRational> {
    const new_entries: Array<ComplexRational> = [];
    for (let i = 0; i < a._entries.length; i++) {
      const sum = ComplexRational.zero();
      for (let k = 0; k < a._entries.length; k++) {
        sum.addEq(a._entries[i][k].clone().mulEq(b[k]));
      }
      new_entries.push(sum);
    }
    return new_entries;
  }

  trace(): ComplexRational {
    const sum = ComplexRational.zero();
    for (let i = 0; i < this._entries.length; i++) {
      sum.addEq(this._entries[i][i]);
    }
    return sum;
  }

  minor(row: number, column: number): ComplexRationalSquareMatrix {
    const new_entries: Array<Array<ComplexRational>> = [];
    for (let i = 0; i < this._entries.length; i++) {
      if (i == row) {
        continue;
      }
      new_entries.push([]);
      for (let j = 0; j < this._entries.length; j++) {
        if (j == column) {
          continue;
        }
        new_entries[new_entries.length - 1].push(this._entries[i][j]);
      }
    }
    return new ComplexRationalSquareMatrix(new_entries);
  }

  determinant(): ComplexRational {
    if (this._entries.length == 1) {
      return this._entries[0][0];
    }
    const sum = ComplexRational.zero();
    for (let i = 0; i < this._entries.length; i++) {
      const entry = this._entries[0][i].clone();
      if (i % 2 == 1) {
        entry.negEq();
      }
      sum.addEq(entry.mulEq(this.minor(0, i).determinant()));
    }
    return sum;
  }

  charPoly(): ComplexRationalPoly {
    const poly_matrix_entries: Array<Array<ComplexRationalPoly>> = [];
    for (let i = 0; i < this._entries.length; i++) {
      poly_matrix_entries.push([]);
      for (let j = 0; j < this._entries.length; j++) {
        const entry = this._entries[i][j].clone();
        if (i == j) {
          poly_matrix_entries[i].push(
            new ComplexRationalPoly([entry, ComplexRational.one().negEq()])
          );
        } else {
          poly_matrix_entries[i].push(new ComplexRationalPoly([entry]));
        }
      }
    }
    return new ComplexRationalSquarePolyMatrix(
      poly_matrix_entries
    ).determinant();
  }

  toComplexRationalSquarePolyMatrix(): ComplexRationalSquarePolyMatrix {
    const poly_matrix_entries: Array<Array<ComplexRationalPoly>> = [];
    for (let i = 0; i < this._entries.length; i++) {
      poly_matrix_entries.push([]);
      for (let j = 0; j < this._entries.length; j++) {
        poly_matrix_entries[i].push(
          new ComplexRationalPoly([this._entries[i][j]])
        );
      }
    }
    return new ComplexRationalSquarePolyMatrix(poly_matrix_entries);
  }

  toComplexRatioRootSquareMatrix(): ComplexRatioRootsSquareMatrix {
    const root_matrix_entries: Array<Array<ComplexRatioRoots>> = [];
    for (let i = 0; i < this._entries.length; i++) {
      root_matrix_entries.push([]);
      for (let j = 0; j < this._entries.length; j++) {
        root_matrix_entries[i].push(
          ComplexRatioRoots.fromComplexRational(this._entries[i][j])
        );
      }
    }
    return new ComplexRatioRootsSquareMatrix(root_matrix_entries);
  }

  toComplexRatioRootsPolySquareMatrix(): ComplexRatioRootsPolySquareMatrix {
    const root_matrix_entries: Array<Array<ComplexRatioRootsPoly>> = [];
    for (let i = 0; i < this._entries.length; i++) {
      root_matrix_entries.push([]);
      for (let j = 0; j < this._entries.length; j++) {
        root_matrix_entries[i].push(
          ComplexRatioRootsPoly.fromComplexRational(this._entries[i][j])
        );
      }
    }
    return new ComplexRatioRootsPolySquareMatrix(root_matrix_entries);
  }
}
