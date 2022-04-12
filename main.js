'use strict'

const RAINBOWMAN_COUNT = 5;
const EMOJI_COUNT = 2;
const EMOJI_SIZE = 70;

const screen = document.querySelector('.screen');
const getScreen = screen.getBoundingClientRect();
const timer = document.querySelector('.timer');
const leftRainbowMan = document.querySelector('.left-num');
const rainbowManNum = document.querySelector('.num');
const button = document.querySelector('.btn');
const startBtn = document.querySelector('.start-btn');
const stopBtn = document.querySelector('.stop-btn');
const startScreen = document.querySelector('.start-screen');
const infoText = document.querySelector('.info-text');
const counter = document.querySelector('.counter');
const gameScreen = document.querySelector('.game-screen');
const resultScreen = document.querySelector('.result-screen');
const successText = document.querySelector('.success');
const failText = document.querySelector('.fail');
const stopText = document.querySelector('.stop');
const replayBtn = document.querySelector('.replay-btn');

const backgroundSound = document.querySelector('.background-sound');
const hoverSound = document.querySelector('.hover-sound');
const successSound = document.querySelector('.success-sound');
const failSound = document.querySelector('.fail-sound');
const clickSound = document.querySelector('.click-sound');

let interval;



function startGame() {
    timer.textContent = '00 : 30';
    setTimer();
    loadItems()
    .then(items => {
        addItem('emoji rainbowman', RAINBOWMAN_COUNT, 'img/Ranibow Sunglasses Emoji.png');
        for(let i=0; i<items.length; i++) {
            addItem('emoji', EMOJI_COUNT, items[i].image);
        }
    })
    .then(() => {
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        startScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        resultScreen.style.display = 'none';
        timer.style.color = 'white';
        stopText.style.display = 'none';
        successText.style.display = 'none';
        failText.style.display = 'none';
        infoText.style.display = 'none';

        countRemainedRainbowMan();
    });
}

function stopGame() {
    stopBtn.style.display = 'none';
    startBtn.style.display = 'block';
    gameScreen.style.display = 'none';
    startScreen.style.display = 'block';
    timer.style.color = 'white';
    timer.textContent = '00 : 00';
    leftRainbowMan.style.display = 'none';
    infoText.style.display = 'block';
    resultScreen.style.display = 'none';
    successText.style.display = 'none';
    failText.style.display = 'none';

    clearInterval(interval);

    while(gameScreen.hasChildNodes()) {
        gameScreen.removeChild(gameScreen.firstChild);
    }
}

function successGame() {
    resultScreen.style.display = 'flex';
    successText.style.display = 'block';
    stopText.style.display = 'none';
    failText.style.display = 'none';
    clearInterval(interval);
    successSound.currentTime = 0;
    successSound.play();
}

function failGame() {
    resultScreen.style.display = 'flex';
    failText.style.display = 'block';
    stopText.style.display = 'none';
    successText.style.display = 'none';
    clearInterval(interval);
    failSound.currentTime = 0;
    failSound.play();
}

function loadItems() {
    return fetch("data/data.json")
    .then(response => response.json())
    .then(json => json.items);
}

function addItem(className, count, imgPath) {
    const x1 = 10;
    const x2 = getScreen.width - EMOJI_SIZE;
    const y1 = 10;
    const y2 = getScreen.height - EMOJI_SIZE;

    for(let i=0; i<count; i++) {
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath);
        item.style.position = 'absoulte';
        const x = Math.random() * (x2 - x1) + x1;
        const y = Math.random() * (y2 - y1) + y1;
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;

        if(className === 'emoji') {
            const z = Math.random() * 10;
            item.style.zIndex = `${z}px`;
        } else {
            const z = Math.random() * 2 +7;
            item.style.zIndex = `${z}px`;
        }

        gameScreen.appendChild(item);
    }
}

function countRemainedRainbowMan() {
    const RainbowMan = document.querySelectorAll('.rainbowman');
    rainbowManNum.textContent = `${RainbowMan.length}`;
    leftRainbowMan.style.display = 'block';
}

function setTimer() {
    let time = 30;
    let min;
    let sec;

    interval = setInterval(() => {
        if(time < 0) {
            failGame();
            return;
        }
        min = parseInt(time/60);
        sec = time%60;
        timer.textContent = `${min.toString().padStart(2, '0')} : ${sec.toString().padStart(2, '0')}`
        if(min==0 && sec<=10){
            timer.style.color = 'red';
        }
        time--;
    }, 1000);
}

function playAudio() {
    backgroundSound.pause();
    backgroundSound.currentTime = 0;
    backgroundSound.play();
    
    backgroundSound.addEventListener('ended', () => {
        backgroundSound.currentTime = 0;
        backgroundSound.play(); 
    });
}



button.addEventListener('click', event => {
    if(event.target.className == 'start-btn' || event.target.className == 'fa-solid fa-play') {
        startGame();
    }
    if(event.target.className == 'stop-btn' || event.target.className == 'fa-solid fa-stop') {
        stopGame();
    }
})

replayBtn.addEventListener('click', () => {
    stopGame();
    startGame();
});


gameScreen.addEventListener('mouseover', event => {
    if(event.target.className == 'emoji rainbowman'){
        hoverSound.pause();
        hoverSound.currentTime = 0;
        hoverSound.play();
    }
});

gameScreen.addEventListener('click', event => {
    if(event.target.className == 'emoji rainbowman') {
        event.target.remove();
        countRemainedRainbowMan();
        const RainbowMan = document.querySelectorAll('.rainbowman');
        if(RainbowMan.length == 0) {
            successGame();
        }
    }
    else if(event.target.className != 'screen game-screen'){
        failGame();

    }
});

resultScreen.addEventListener('mouseover', event => {
    if(event.target.className == 'replay-btn' || event.target.className == 'fa-solid fa-arrow-rotate-left') {
        clickSound.currentTime = 0;
        clickSound.play();
    }
});

playAudio();