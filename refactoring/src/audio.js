'use strict'

const bgSound = new Audio('./audio/Erik-satie-gymnopedie-no1-piano.mp3');
const rainbowmanSound = new Audio('./audio/bubble.mp3');
const winSound = new Audio('./audio/success.mp3');
const loseSound = new Audio('./audio/fail.mp3');
    
export function playBg() {
    bgSound.currentTime = 0;
    bgSound.play();
    bgSound.addEventListener('ended', () => {
        bgSound.currentTime = 0;
        bgSound.play();
    })
}

export function playRainbowman() {
    play(rainbowmanSound);
}

export function playWin() {
    play(winSound);
}

export function playLose() {
    play(loseSound);
}

function play(sound) {
    sound.pause();
    sound.currentTime = 0;
    sound.play();
}