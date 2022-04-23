'use strict'

import PopUp from './popup.js';
import { GameBuilder, Result } from './game.js';
import * as audio from './audio.js';

const RAINBOWMAN_COUNT = 5;
const EMOJI_COUNT = 2;
const GAME_TIME_SEC = 30;

const gameFinishPopUp = new PopUp();
const game = new GameBuilder()
    .withGameDuration(GAME_TIME_SEC)
    .withRainbowmanCount(RAINBOWMAN_COUNT)
    .withEmojiCount(EMOJI_COUNT)
    .build();

game.setGameStopListener(result => {
    let message;

    switch(result) {
        case Result.win:
            message = '⭐Congratulations⭐<br/>You found all rainbow man!';
            break;
        case Result.lose:
            message = 'Try again..';
            break;
        default:
            throw new Error('not valid reason');
    }
    gameFinishPopUp.showWithText(message);
});

gameFinishPopUp.setClickListener(() => {
    gameFinishPopUp.hide();
    game.restart();
});

audio.playBg();
