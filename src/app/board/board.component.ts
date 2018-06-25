import { Component, OnInit } from '@angular/core';
import {Column} from './column.model';
import {Player} from '../player';
import {HumanPlayer} from './human-player.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
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
        this.validateGameStatus();
        this.currentPlayer = this.currentPlayer === this.players[0] ? this.players[1] : this.players[0];
      }
    }
  }

  public validateGameStatus() {
     if(this.hasFourConnected()) {
        this.status = `Player#${this.currentPlayer.playerNumber} has won`;
        this.finish = true;
     }
     if(!this.hasOpenMoves()) {
        this.status = 'Game is DRAW!';
        this.finish = true;
     }
  }

  public hasFourConnected() : boolean {
    //TODO check four connections
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

}
