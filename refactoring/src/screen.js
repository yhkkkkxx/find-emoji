'use strict'

import * as audio from './audio.js';

const EMOJI_SIZE = 70;

export const Emoji = Object.freeze({
    emoji: 'emoji',
    rainbowman: 'rainbowman'
});

export class Screen {
    constructor(rainbowmanCount, emojiCount) {
        this.rainbowmanCount = rainbowmanCount;
        this.emojiCount = emojiCount;
        this.screen = document.querySelector('.game-screen');
        this.screenRect= this.screen.getBoundingClientRect();
        this.screen.addEventListener('click', this.onClick);
        this.screen.addEventListener('mouseover', this.onMouseOver);
    }

    setClickListener(onItemClick) {
        this.onItemClick = onItemClick;
    }

    setMouseOverListener(onItemMouseOver) {
        this.onItemMouseOver = onItemMouseOver;
    }

    onClick = (event) => {
        const emoji = event.target;
        if(emoji.className == 'emoji') {
            this.onItemClick && this.onItemClick(Emoji.emoji);
        }
        if(emoji.className == 'emoji rainbowman') {
            emoji.parentNode.removeChild(emoji);
            this.onItemClick && this.onItemClick(Emoji.rainbowman);
        }
    }

    onMouseOver(event) {
        if(event.target.className == 'emoji rainbowman') {
            audio.playRainbowman();
        }
    }

    
    startInit() {
        this.loadItems()
        .then(items => {
            this.addEmoji('emoji rainbowman', this.rainbowmanCount, 'img/Ranibow Sunglasses Emoji.png');
            for(let i=0; i<items.length; i++) {
                this.addEmoji('emoji', this.emojiCount, items[i].image);
            }
        });
    }

    gameInit() {
        this.screen.innerHTML = `
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

    removeAllEmojis() {
        while(this.screen.hasChildNodes()) {
            this.screen.removeChild(this.screen.firstChild);
        }
    }

    loadItems() {
        return fetch("data/data.json")
        .then(response => response.json())
        .then(json => json.items);
    }

    addEmoji(className, count, imgPath) {
        const x1 = 10;
        const x2 = this.screenRect.width - EMOJI_SIZE;
        const y1 = 10;
        const y2 = this.screenRect.height - EMOJI_SIZE;

        for(let i=0; i<count; i++) {
            const item = document.createElement('img');
            item.setAttribute('class', className);
            item.setAttribute('src', imgPath);
            item.style.position = 'absolute';
            const x = Math.random() * (x2-x1) + x1;
            const y = Math.random() * (y2-y1) + y1;
            item.style.left = `${x}px`;
            item.style.top = `${y}px`
            this.screen.appendChild(item);
        }
    }
}