import { Component, OnInit } from '@angular/core';
import {Column} from './column.model';
import {Player} from '../player';
import {HumanPlayer} from './human-player.model';
import {Move} from './move.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  readonly MIDDLE_COL_NUM: number = 3;
  readonly CLICK_NOT_ALLOWED  : boolean = false;
  finish : boolean = false;
  status: string;
  columns: Column[] = [
    new Column(1),
    new Column(2),
    new Column(3),
    new Column(4),
    new Column(5),
    new Column(6),
    new Column(7),
  ];
  currentPlayer: Player;
  humanPlayer1: Player = new HumanPlayer(1, 'bg-primary');
  humanPlayer2: Player = new HumanPlayer(2, 'bg-danger');
  players : Player[] = [this.humanPlayer1, this.humanPlayer2];

  constructor() { }

  ngOnInit() {
    this.currentPlayer = this.players[0];
  }

  public selectColumn(column: Column) : void {
    if(!this.finish) {

      let moveAllowed: boolean = this.currentPlayer.type === 'Human' ? column.move(this.currentPlayer.doMove()) : this.CLICK_NOT_ALLOWED;

      if(moveAllowed) {
        this.validateGameStatus(column);
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
      }
    }
  }

  public validateGameStatus(selectedColumn: Column) {
     if(this.hasFourConnected(selectedColumn)) {
        this.status = `Player#${this.currentPlayer.playerNumber} has won`;
        this.finish = true;
     }
     if(!this.hasOpenMoves()) {
        this.status = 'Game is DRAW!';
        this.finish = true;
     }
  }

  public hasFourConnected(selectedColumn: Column) : boolean {

    let currentPlayerNumber: number = this.currentPlayer.playerNumber;
    let middleColumn: Column = this.columns[this.MIDDLE_COL_NUM];

    let bottomEmptyCell: number = middleColumn.bottomEmptyCell;

    if(this.hasFourVertical(selectedColumn, currentPlayerNumber)){
      return true;
    }

    for(let row = 1; row < bottomEmptyCell ; row++) {
      let rowMove: Move = middleColumn.moves[row - 1];
      if(rowMove.player !== currentPlayerNumber){
        continue;
      }

      if(this.hasFourHorizontal(row, currentPlayerNumber)) {
        return true;
      }

      if(this.hasFourDiagonal(selectedColumn, currentPlayerNumber)) {
        return true;
      }
    }

    return false;
  }

  public hasFourHorizontal(row: number, currentPlayerNumber: number) : boolean {
     let comboParams = {totalCombo: 1, row: row, currentPlayerNumber: currentPlayerNumber, colIndex: -1};

     for(let colIndex = 2 ; colIndex > -1 ; colIndex --){
        comboParams.colIndex = colIndex;
        if(this.checkNextColumn(comboParams)) {
          if(comboParams.totalCombo === 4) {
            return true;
          }
        } else {
          break;
        }
     }

     for(let colIndex = 4 ; colIndex < 7 ; colIndex ++){
        comboParams.colIndex = colIndex;
        if(this.checkNextColumn(comboParams)) {
          if(comboParams.totalCombo === 4) {
            return true;
          }
        } else {
          break;
        }
     }

     return false;
  }

  public hasFourVertical(selectedColumn: Column, currentPlayerNumber: number) : boolean {
     let comboParams = {totalCombo: 1, row: 0, currentPlayerNumber: currentPlayerNumber, colIndex: (selectedColumn.columnPosition -1)};

     for(let rowIndex = selectedColumn.bottomEmptyCell - 2 ; rowIndex > -1 ; rowIndex --){
        comboParams.row = rowIndex;
        if(this.checkNextColumn(comboParams)) {
          if(comboParams.totalCombo === 4) {
            return true;
          }
        } else {
          break;
        }
     }

     return false;
  }

  public hasFourDiagonal(selectedColumn: Column, currentPlayerNumber: number) : boolean {
     let comboParams = {totalCombo: 1, row: selectedColumn.bottomEmptyCell, currentPlayerNumber: currentPlayerNumber, colIndex: -1};

     //test the diagonal to the left
     //up-left
     for(let colIndex = selectedColumn.columnPosition - 2 ; colIndex > -1 ; colIndex --){
        comboParams.colIndex = colIndex;
        console.log(comboParams);
        if(this.checkNextColumn(comboParams)) {
          if(comboParams.totalCombo === 4) {
            return true;
          }
        } else {
          break;
        }
        comboParams.row++;
     }
     //down-right
     comboParams.row = selectedColumn.bottomEmptyCell - 2;
     for(let colIndex = selectedColumn.columnPosition ; colIndex < 7 ; colIndex ++){
        comboParams.colIndex = colIndex;
        if(this.checkNextColumn(comboParams)) {
          if(comboParams.totalCombo === 4) {
            return true;
          }
        } else {
          break;
        }
        comboParams.row--;
     }

     //reset to test the diagonal to the right
     comboParams.row = selectedColumn.bottomEmptyCell;
     comboParams.totalCombo = 1;
     //up-right
     for(let colIndex = selectedColumn.columnPosition ; colIndex < 7 ; colIndex ++){
        comboParams.colIndex = colIndex;
        if(this.checkNextColumn(comboParams)) {
          if(comboParams.totalCombo === 4) {
            return true;
          }
        } else {
          break;
        }
        comboParams.row++;
     }

     //down-left
     comboParams.row = selectedColumn.bottomEmptyCell - 2;
     for(let colIndex = selectedColumn.columnPosition - 2 ; colIndex > -1 ; colIndex --){
        comboParams.colIndex = colIndex;
        console.log(comboParams);
        if(this.checkNextColumn(comboParams)) {
          if(comboParams.totalCombo === 4) {
            return true;
          }
        } else {
          break;
        }
        comboParams.row--;
     }

     return false;
  }

  public checkNextColumn(comboParams): boolean  {
       let nextColumn: Column = this.columns[comboParams.colIndex];
       let rowMove: Move = nextColumn.getMove(comboParams.row);
       if(rowMove) {
         console.log(`row#${comboParams.row + 1}, column#${nextColumn.columnPosition}- player#${rowMove.player}`);
         if(rowMove.player === comboParams.currentPlayerNumber) {
            comboParams.totalCombo++;
            return true;
         }
       }

       return false;
  }

  public hasOpenMoves() : boolean {
    for(let column of this.columns) {
      if(column.hasOpenMove()) {
        return true;
      }
    }

    return false;
  }

  public newGame() {
   location.reload();
  }

}
