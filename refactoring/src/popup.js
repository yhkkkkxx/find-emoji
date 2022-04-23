'use strict'

export default class PopUp {
    constructor() {
        this.popUp = document.querySelector('.pop-up');
        this.popUpScreen = document.querySelector('.pop-up-screen');
        this.popUpText = document.querySelector('.pop-up-text');
        this.popUpRestart = document.querySelector('.pop-up-btn');
        this.popUpRestart.addEventListener('click', () => {
            this.onClick && this.onClick();
            this.hide();
        });
    }

    setClickListener(onClick) {
        this.onClick = onClick;
    }

    
    showWithText(message) {
        this.popUpText.innerHTML = message;
        this.popUp.classList.remove('pop-up--hide');
    }

    hide() {
        this.popUp.classList.add('pop-up--hide');
    }
}