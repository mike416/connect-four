import {Move} from './move.model';
import {Player} from '../player';

export class HumanPlayer implements Player {
  type: string = 'Human';
  constructor(public playerNumber: number, public color: string) { }

  doMove() : Move {
    return <Move>{player: this.playerNumber, color: this.color};
  }
}
