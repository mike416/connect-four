import {Move} from './move.model';
export class Column {
  readonly LAST_ROW: number = 6;
  bottomEmptyCell: number = 1;
  moves: Move[] = [];

  constructor(public readonly columnPosition:number) {
  }

  public hasOpenMove() : boolean {
    return this.bottomEmptyCell <= this.LAST_ROW;
  }

  public getMove(row:number) : Move{
    if(this.bottomEmptyCell > row){
      return this.moves[row - 1];
    }
    return undefined;
  }

  public move(move: Move): boolean {
    if(this.hasOpenMove()) {
      console.log(move);
      this.moves.push(move);
      this.bottomEmptyCell++;
      return true;
    } else {
      console.log(`No more open moves for this column ${this.columnPosition}`);
      return false;
    }
  }

}
