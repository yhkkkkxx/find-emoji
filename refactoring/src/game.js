'use strict'

import PopUp from './popup.js';
import { Screen, Emoji } from './screen.js';
import * as audio from './audio.js';

export const Result = Object.freeze({
    win: 'win',
    lose: 'lose'
});

export class GameBuilder {
    withGameDuration(gameDuration, rainbowmanCount, emojiCount) {
        this.gameDuration = gameDuration;
        return this;
    }

    withRainbowmanCount(rainbowmanCount) {
        this.rainbowmanCount =rainbowmanCount;
        return this;
    }   

    withEmojiCount(emojiCount) {
        this.emojiCount = emojiCount;
        return this;
    }

    build() {
        return new Game(
            this.gameDuration,
            this.rainbowmanCount,
            this.emojiCount
        )
    }
}


const gameFinishPopUp = new PopUp();

class Game {
    constructor(gameDuration, rainbowmanCount, emojiCount) {
        this.gameDuration = gameDuration;
        this.rainbowmanCount = rainbowmanCount;
        this.emojiCount = emojiCount;

        this.gameTimer = document.querySelector('.game-timer');
        this.gameScore = document.querySelector('.game-score');
        this.gameScoreNum = document.querySelector('.score-num');
        this.gameBtn = document.querySelector('.game-btn');
        this.gameBtn.addEventListener('click', () => {
            const infoText = document.querySelector('.info-text');
            if(this.isPlaying) {
                this.stop();
                this.showStartBtn();
                this.gameScreen.gameInit();
            } else {
                this.start();
                this.showStopBtn();
                infoText.parentNode.removeChild(infoText);
            }
        });
        this.isPlaying = false;
        this.timer;
        this.score;

        
        this.gameScreen = new Screen(rainbowmanCount, emojiCount);
        this.gameScreen.setClickListener(this.onItemClick);
    }

    setGameStopListener(onGameStop) {
        this.onGameStop = onGameStop;
    }

    onItemClick = (item) => {
        if(item == 'emoji') {
            this.lose();
        } else if(item == 'rainbowman') {
            this.updateScoreBoard();
        }
    }

    
    start() {
        this.isPlaying = true;
        this.gameScreen.startInit();
        this.score = this.rainbowmanCount;
        this.showTimerAndScore();
        this.startTimer();
    }

    stop() {
        this.isPlaying = false;
        this.gameScreen.removeAllEmojis();
        this.hideTimerAndScore();
        this.gameScreen.gameInit();
        clearInterval(this.timer);
        gameFinishPopUp.hide();
    }

    restart() {
        this.gameScreen.removeAllEmojis();
        clearInterval();
        this.start();
        this.gameTimer.style.color = 'white';
    }

    win() {
        clearInterval(this.timer);
        audio.playWin();
        this.onGameStop && this.onGameStop(Result.win);
    }

    lose() {
        clearInterval(this.timer);
        audio.playLose();
        this.onGameStop && this.onGameStop(Result.lose);
    }

    startTimer() {
        let remainingTimeSec = this.gameDuration;
        this.gameTimer.textContent = `
            ${this.fillZero(parseInt(remainingTimeSec/60))} : ${remainingTimeSec%60}`;
        this.timer = setInterval(() => {
            if(remainingTimeSec == 0) {
                this.lose();
                return;
            }
            this.updateTimerText(--remainingTimeSec);
        }, 1000);
    
    }
    
    updateTimerText(time) {
        const min = parseInt(time / 60);
        const sec = time % 60;
        if(min == 0 && sec <= 10) {
            this.gameTimer.style.color = 'red';
        }
        this.gameTimer.textContent = `${this.fillZero(min)} : ${this.fillZero(sec)}`;
    }
    
    fillZero(num) {
        return num.toString().padStart(2, '0');
    }
    
    updateScoreBoard() {
        this.gameScoreNum.textContent = `${--this.score}`
        if(this.gameScoreNum.textContent == '0') {
            this.win();
        }
    }
    
    showStartBtn() {
        const icon = document.querySelector('.fa-solid');
        icon.classList.remove('fa-stop');
        icon.classList.add('fa-play');
    }

    showStopBtn() {
        const icon = document.querySelector('.fa-solid');
        icon.classList.add('fa-stop');
        icon.classList.remove('fa-play');
    }


    showTimerAndScore() {
        this.gameTimer.style.visibility = 'visible';
        this.gameScore.style.visibility = 'visible';
        this.gameScoreNum.textContent = `${this.rainbowmanCount}`;
    }

    hideTimerAndScore() {
        this.gameTimer.style.color = 'white';
        this.gameTimer.style.visibility = 'hidden';
        this.gameScore.style.visibility = 'hidden';
    }
}