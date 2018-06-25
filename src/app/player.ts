import {Move} from './board/move.model';

export interface Player {
  playerNumber:number;
  color: string;
  type: string;
  doMove() : Move;
}
