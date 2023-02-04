import { ComplexRatioRoots } from "./ComplexRatioRoots";

export class ComplexRatioRootsSquareMatrix {
  private _entries: Array<Array<ComplexRatioRoots>>;

  constructor(entries: Array<Array<ComplexRatioRoots>>) {
    this._entries = entries.map((row) => row.map((entry) => entry.clone()));
  }

  clone(): ComplexRatioRootsSquareMatrix {
    return new ComplexRatioRootsSquareMatrix(
      this._entries.map((row) => row.map((entry) => entry.clone()))
    );
  }

  static zero(size: number): ComplexRatioRootsSquareMatrix {
    const entries: Array<Array<ComplexRatioRoots>> = [];
    for (let i = 0; i < size; i++) {
      entries.push([]);
      for (let j = 0; j < size; j++) {
        entries[i].push(ComplexRatioRoots.zero());
      }
    }
    return new ComplexRatioRootsSquareMatrix(entries);
  }

  static identity(size: number): ComplexRatioRootsSquareMatrix {
    const entries: Array<Array<ComplexRatioRoots>> = [];
    for (let i = 0; i < size; i++) {
      entries.push([]);
      for (let j = 0; j < size; j++) {
        entries[i].push(ComplexRatioRoots.zero());
      }
      entries[i][i] = ComplexRatioRoots.one();
    }
    return new ComplexRatioRootsSquareMatrix(entries);
  }

  gaussianElimination(): [
    ComplexRatioRootsSquareMatrix,
    ComplexRatioRootsSquareMatrix,
    number
  ] {
    let rank = 0;
    const cloned_matrix = this.clone();
    let active_column = 0;
    const transformation_matrix = ComplexRatioRootsSquareMatrix.identity(
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
      const temp = cloned_matrix._entries[pivot_row];
      cloned_matrix._entries[pivot_row] = cloned_matrix._entries[start_row];
      cloned_matrix._entries[start_row] = temp;
      const temp2 = transformation_matrix._entries[pivot_row];
      transformation_matrix._entries[pivot_row] =
        transformation_matrix._entries[start_row];
      transformation_matrix._entries[start_row] = temp2;
      // Make the pivot entry 1
      const pivot_entry = cloned_matrix._entries[start_row][active_column];
      for (let i = 0; i < cloned_matrix._entries.length; i++) {
        cloned_matrix._entries[start_row][i].divEq(pivot_entry);
        transformation_matrix._entries[start_row][i].divEq(pivot_entry);
      }
      // Make the other entries in the column 0
      for (let i = 0; i < cloned_matrix._entries.length; i++) {
        if (i == start_row) {
          continue;
        }
        const entry = cloned_matrix._entries[i][active_column];
        for (let j = 0; j < cloned_matrix._entries.length; j++) {
          cloned_matrix._entries[i][j].subEq(
            entry.mulEq(cloned_matrix._entries[start_row][j])
          );
          transformation_matrix._entries[i][j].subEq(
            entry.mulEq(transformation_matrix._entries[start_row][j])
          );
        }
      }
      rank++;
      start_row++;
      active_column++;
    }
    return [cloned_matrix, transformation_matrix, rank];
  }

  matMulEq(
    matrix: ComplexRatioRootsSquareMatrix
  ): ComplexRatioRootsSquareMatrix {
    const entries: Array<Array<ComplexRatioRoots>> = [];
    for (let i = 0; i < this._entries.length; i++) {
      entries.push([]);
      for (let j = 0; j < this._entries.length; j++) {
        entries[i].push(ComplexRatioRoots.zero());
        for (let k = 0; k < this._entries.length; k++) {
          entries[i][j].addEq(this._entries[i][k].mulEq(matrix._entries[k][j]));
        }
      }
    }
    this._entries = entries;
    return this;
  }

  static matMul(
    a: ComplexRatioRootsSquareMatrix,
    b: ComplexRatioRootsSquareMatrix
  ): ComplexRatioRootsSquareMatrix {
    return a.clone().matMulEq(b);
  }

  static matMulVec(
    a: ComplexRatioRootsSquareMatrix,
    b: Array<ComplexRatioRoots>
  ): Array<ComplexRatioRoots> {
    const entries: Array<ComplexRatioRoots> = [];
    for (let i = 0; i < a._entries.length; i++) {
      entries.push(ComplexRatioRoots.zero());
      for (let j = 0; j < a._entries.length; j++) {
        entries[i].addEq(a._entries[i][j].mulEq(b[j]));
      }
    }
    return entries;
  }

  trace(): ComplexRatioRoots {
    let trace = ComplexRatioRoots.zero();
    for (let i = 0; i < this._entries.length; i++) {
      trace.addEq(this._entries[i][i].clone());
    }
    return trace;
  }

  minor(row: number, column: number): ComplexRatioRootsSquareMatrix {
    const entries: Array<Array<ComplexRatioRoots>> = [];
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
    return new ComplexRatioRootsSquareMatrix(entries);
  }

  determinant(): ComplexRatioRoots {
    if (this._entries.length == 1) {
      return this._entries[0][0].clone();
    }
    let det = ComplexRatioRoots.zero();
    for (let i = 0; i < this._entries.length; i++) {
      const minor = this.minor(0, i);
      const entry = this._entries[0][i].clone();
      if (i % 2 == 1) {
        entry.mulEq(ComplexRatioRoots.one().negEq());
      }
      det.addEq(entry.mulEq(minor.determinant()));
    }
    return det;
  }
}
