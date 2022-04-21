'use strict'

const EMOJI_SIZE = 70;
const RAINBOWMAN_COUNT = 5;
const EMOJI_COUNT = 2;
const GAME_TIME_SEC = 30;

const gameTimer = document.querySelector('.game-timer');
const gameScore = document.querySelector('.game-score');
const gameScoreNum = document.querySelector('.score-num');
const gameBtn = document.querySelector('.game-btn');
const gameScreen = document.querySelector('.game-screen');
const gameScreenRect= gameScreen.getBoundingClientRect();
const popUp = document.querySelector('.pop-up');
const popUpScreen = document.querySelector('.pop-up-screen');
const popUpText = document.querySelector('.pop-up-text');
const popUpRestart = document.querySelector('.pop-up-btn');

const bgSound = new Audio('./audio/Erik-satie-gymnopedie-no1-piano.mp3');
const rainbowmanSound = new Audio('./audio/bubble.mp3');
const winSound = new Audio('./audio/success.mp3');
const loseSound = new Audio('./audio/fail.mp3');
let isPlaying = false;
let timer;
let score;


gameBtn.addEventListener('click', () => {
    const infoText = document.querySelector('.info-text');
    if(isPlaying) {
        isPlaying = false;
        stopGame();
        showStartBtn();
        showInitScreen();
    } else {
        isPlaying = true;
        startGame();
        showStopBtn();
        infoText.parentNode.removeChild(infoText);
    }
});

gameScreen.addEventListener('click', event => {
    const emoji = event.target;
    if(emoji.className == 'emoji') {
        loseGame();
    }
    if(emoji.className == 'emoji rainbowman') {
        emoji.parentNode.removeChild(emoji);
        updateScoreBoard();
    }
});

gameScreen.addEventListener('mouseover', event => {
    if(event.target.className == 'emoji rainbowman') {
        playSound(rainbowmanSound);
    }
});

popUpRestart.addEventListener('click', event => {
    popUp.classList.add('pop-up--hide');
    restartGame();
});





function startGame() {

    loadItems()
    .then(items => {
        addEmoji('emoji rainbowman', RAINBOWMAN_COUNT, 'img/Ranibow Sunglasses Emoji.png');
        for(let i=0; i<items.length; i++) {
            addEmoji('emoji', EMOJI_COUNT, items[i].image);
        }
    });
    score = RAINBOWMAN_COUNT;
    showTimerAndScore();
    startGameTimer();
}

function stopGame() {
    removeAllEmojis();
    showInitScreen();
    clearInterval(timer);
    popUp.classList.add('pop-up--hide');
}

function restartGame() {
    removeAllEmojis();
    clearInterval();
    startGame();
    gameTimer.style.color = 'white';
}

function showPopUpWithText(result) {
    let message;
    switch(result) {
        case 'win':
            message = '⭐Congratulations⭐<br/>You found all rainbow man!';
            break;
        case 'lose':
            message = 'Try again..';
            break;
    }
    popUpText.innerHTML = message;
    popUp.classList.remove('pop-up--hide');
}

function hidePopUp() {
    popUp.classList.add('pop-up--hide');
}

function winGame() {
    clearInterval(timer);
    showPopUpWithText('win');
    playSound(winSound);
    popUp.classList.remove('pop-up--hide');
}

function loseGame() {
    clearInterval(timer);
    showPopUpWithText('lose');
    playSound(loseSound);
    popUp.classList.remove('pop-up--hide');
}

function startGameTimer() {
    let remainingTimeSec = GAME_TIME_SEC;
    gameTimer.textContent = `
        ${fillZero(parseInt(remainingTimeSec/60))} : ${remainingTimeSec%60}`;
    timer = setInterval(() => {
        if(remainingTimeSec == 0) {
            loseGame();
            return;
        }
        updateTimerText(--remainingTimeSec);
    }, 1000);

}

function updateTimerText(time) {
    const min = parseInt(time / 60);
    const sec = time % 60;
    if(min == 0 && sec <= 10) {
        gameTimer.style.color = 'red';
    }
    gameTimer.textContent = `${fillZero(min)} : ${fillZero(sec)}`;
}

function fillZero(num) {
    return num.toString().padStart(2, '0');
}

function updateScoreBoard() {
    gameScoreNum.textContent = `${--score}`
    if(gameScoreNum.textContent == '0') {
        winGame();
    }
}




function addEmoji(className, count, imgPath) {
    const x1 = 10;
    const x2 = gameScreenRect.width - EMOJI_SIZE;
    const y1 = 10;
    const y2 = gameScreenRect.height - EMOJI_SIZE;
    
    for(let i=0; i<count; i++) {
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absolute';
        const x = Math.random() * (x2-x1) + x1;
        const y = Math.random() * (y2-y1) + y1;
        item.style.left = `${x}px`;
        item.style.top = `${y}px`
        gameScreen.appendChild(item);
    }
}

function removeAllEmojis() {
    while(gameScreen.hasChildNodes()) {
        gameScreen.removeChild(gameScreen.firstChild);
    }
}

function showStartBtn() {
    const icon = gameBtn.querySelector('.fa-solid');
    icon.classList.remove('fa-stop');
    icon.classList.add('fa-play');
}

function showStopBtn() {
    const icon = gameBtn.querySelector('.fa-solid');
    icon.classList.add('fa-stop');
    icon.classList.remove('fa-play');
}

function loadItems() {
    return fetch("data/data.json")
    .then(response => response.json())
    .then(json => json.items);
}

function showInitScreen() {
    gameTimer.style.visibility = 'hidden';
    gameTimer.style.color = 'white';
    gameScore.style.visibility = 'hidden';
    gameScreen.innerHTML = `
        <div class="info-text">
            Welcome to "Find Emoji" Game<br/>
            Find five RAINBOW MAN
                <img class="rainbow-emoji" src="img/Ranibow Sunglasses Emoji.png">
            in 30 seconds<br/>
            You can find RAINBOW MAN with sound<br/>
            If time is up or you click other emojis, game will be over
        </div>
    `;
}

function showTimerAndScore() {
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
    gameScoreNum.textContent = `${RAINBOWMAN_COUNT}`;
}

function playSound(sound) {
    sound.pause();
    sound.currentTime = 0;
    sound.play();
}

function playBgSound() {
    bgSound.currentTime = 0;
    bgSound.play();
    bgSound.addEventListener('ended', () => {
        bgSound.currentTime = 0;
        bgSound.play();
    })
}

showInitScreen();
playBgSound();