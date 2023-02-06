import { RatioRoots } from "./RatioRoots";

export class RatioRootsSquareMatrix {
  private _entries: Array<Array<RatioRoots>>;

  constructor(entries: Array<Array<RatioRoots>>) {
    this._entries = entries.map((row) => row.map((entry) => entry.clone()));
  }

  clone(): RatioRootsSquareMatrix {
    return new RatioRootsSquareMatrix(
      this._entries.map((row) => row.map((entry) => entry.clone()))
    );
  }

  static zero(n: number): RatioRootsSquareMatrix {
    const entries: Array<Array<RatioRoots>> = [];
    for (let i = 0; i < n; i++) {
      entries.push([]);
      for (let j = 0; j < n; j++) {
        entries[i].push(RatioRoots.zero());
      }
    }
    return new RatioRootsSquareMatrix(entries);
  }

  static identity(n: number): RatioRootsSquareMatrix {
    const entries: Array<Array<RatioRoots>> = [];
    for (let i = 0; i < n; i++) {
      entries.push([]);
      for (let j = 0; j < n; j++) {
        if (i == j) {
          entries[i].push(RatioRoots.one());
        } else {
          entries[i].push(RatioRoots.zero());
        }
      }
    }
    return new RatioRootsSquareMatrix(entries);
  }

  negEq(): RatioRootsSquareMatrix {
    for (let i = 0; i < this._entries.length; i++) {
      for (let j = 0; j < this._entries.length; j++) {
        this._entries[i][j].negEq();
      }
    }
    return this;
  }

  static neg(matrix: RatioRootsSquareMatrix): RatioRootsSquareMatrix {
    return matrix.clone().negEq();
  }

  addEq(matrix: RatioRootsSquareMatrix): RatioRootsSquareMatrix {
    for (let i = 0; i < this._entries.length; i++) {
      for (let j = 0; j < this._entries.length; j++) {
        this._entries[i][j].addEq(matrix._entries[i][j]);
      }
    }
    return this;
  }

  static add(
    matrix1: RatioRootsSquareMatrix,
    matrix2: RatioRootsSquareMatrix
  ): RatioRootsSquareMatrix {
    return matrix1.clone().addEq(matrix2);
  }

  subEq(matrix: RatioRootsSquareMatrix): RatioRootsSquareMatrix {
    return this.addEq(RatioRootsSquareMatrix.neg(matrix));
  }

  static sub(
    matrix1: RatioRootsSquareMatrix,
    matrix2: RatioRootsSquareMatrix
  ): RatioRootsSquareMatrix {
    return matrix1.clone().subEq(matrix2);
  }

  mulEq(matrix: RatioRootsSquareMatrix): RatioRootsSquareMatrix {
    const entries: Array<Array<RatioRoots>> = [];
    for (let i = 0; i < this._entries.length; i++) {
      entries.push([]);
      for (let j = 0; j < this._entries.length; j++) {
        entries[i].push(RatioRoots.zero());
        for (let k = 0; k < this._entries.length; k++) {
          entries[i][j].addEq(
            this._entries[i][k].clone().mulEq(matrix._entries[k][j])
          );
        }
      }
    }
    this._entries = entries;
    return this;
  }

  static mul(
    matrix1: RatioRootsSquareMatrix,
    matrix2: RatioRootsSquareMatrix
  ): RatioRootsSquareMatrix {
    return matrix1.clone().mulEq(matrix2);
  }

  powEq(n: number): RatioRootsSquareMatrix {
    if (n == 0) {
      this._entries = RatioRootsSquareMatrix.identity(
        this._entries.length
      )._entries;
    } else if (n == 1) {
      return this;
    } else if (n % 2 == 0) {
      return this.mulEq(this.clone()).powEq(n / 2);
    }
    return this.mulEq(this.clone().powEq(n - 1));
  }

  static pow(
    matrix: RatioRootsSquareMatrix,
    n: number
  ): RatioRootsSquareMatrix {
    return matrix.clone().powEq(n);
  }

  gaussian_elimination(): [
    RatioRootsSquareMatrix,
    RatioRootsSquareMatrix,
    number
  ] {
    let rank = 0;
    const cloned_matrix = this.clone();
    let active_column = 0;
    const transformation_matrix = RatioRootsSquareMatrix.identity(
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
}
