import { ComplexRatioRootsPoly } from "./ComplexRatioRootsPoly";

export class ComplexRatioRootsPolySquareMatrix {
  private _entries: Array<Array<ComplexRatioRootsPoly>>;

  constructor(entries: Array<Array<ComplexRatioRootsPoly>>) {
    this._entries = entries.map((row) => row.map((entry) => entry.clone()));
  }

  clone(): ComplexRatioRootsPolySquareMatrix {
    return new ComplexRatioRootsPolySquareMatrix(
      this._entries.map((row) => row.map((entry) => entry.clone()))
    );
  }

  static zero(size: number): ComplexRatioRootsPolySquareMatrix {
    const entries: Array<Array<ComplexRatioRootsPoly>> = [];
    for (let i = 0; i < size; i++) {
      entries.push([]);
      for (let j = 0; j < size; j++) {
        entries[i].push(ComplexRatioRootsPoly.zero());
      }
    }
    return new ComplexRatioRootsPolySquareMatrix(entries);
  }

  static identity(size: number): ComplexRatioRootsPolySquareMatrix {
    const entries: Array<Array<ComplexRatioRootsPoly>> = [];
    for (let i = 0; i < size; i++) {
      entries.push([]);
      for (let j = 0; j < size; j++) {
        entries[i].push(ComplexRatioRootsPoly.zero());
      }
      entries[i][i] = ComplexRatioRootsPoly.one();
    }
    return new ComplexRatioRootsPolySquareMatrix(entries);
  }

  toMathJax(): string {
    return (
      "$$\\begin{pmatrix}" +
      this._entries
        .map((row) => row.map((entry) => entry.toMathJax()).join(" & "))
        .join("\\\\") +
      "\\end{pmatrix}$$"
    );
  }
}
