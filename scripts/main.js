/**
 * @author Trevor McCubbin
 */

"use strict";

/* all global variables */
let wpm;
let wpmValue;
let started;
let beforeFocus;
let currentFocus;
let afterFocus;
let startButton;
let index;
let currentQuoteInterval;

// Starting point is the setup when event listeners are attached
document.addEventListener("DOMContentLoaded", setup);

/**
 * Sets up the global variables
 * Loads the the saved wpm value from local storage if it exists
 * Adds an input event listener to the wpm input
 * Adds a click event listener to the start button which starts the rest of the program
 */
function setup() {
    wpm = document.querySelector('#wpm');
    wpmValue = wpm.value;
    started = false;
    beforeFocus = document.querySelector('#before-focus');
    currentFocus = document.querySelector('#focus');
    afterFocus = document.querySelector('#after-focus');
    startButton = document.querySelector('#start-button');
    index = 0;
    currentQuoteInterval = false;
    // If the local storage item called wpmValue exists, load the value from storage
    if (localStorage.getItem('wpmValue')) {
        loadWpmValue();
    }
    //find the WPM input and give it an input listener
    //wpm.addEventListener("input", updateWpmValue);
    wpm.addEventListener("change", updateWpmValue);
    //find the start button and give it a click listener
    startButton.addEventListener("click", startStopButton);
}

/**
 * When the start stop button is clicked, it gets a quote if it was in the stopped state 
 * and then changes the state of the button
 */
function startStopButton() {
    /* if the program isn't in the started state and there is no currentQuoteInterval, start the program
        The currentQuoteInterval is there so that users can't spam the start button if there is already
    */
    if (!started && !currentQuoteInterval){
        getQuote();
    }
    else {
        clearInterval(currentQuoteInterval);
        currentQuoteInterval = false;
        index = 0;
    }
    changeButtonState();
}

/**
 * Changes the text of the button based on it's current state and then changes the state
 */
function changeButtonState() {
    if (!started) {
        startButton.innerText = 'Stop';
    } 
    else {
        startButton.innerText = 'Start';
    }
    started = !started;
}

/**
 * Updates the wpm value in html and saves it to local storage
 * This also verifies the input number for the input
 * If the wpm value isn't within the requirements needed for a valid number
 * try to read a stored value
 * and if that doesn't exist then set the value to 100
 */
function updateWpmValue() {
    if (wpm.value%50 == 0 && wpm.value != 0 && wpm.value <= 1000) {
        wpmValue = wpm.value;
    }
    else if (localStorage.getItem('wpmValue')) {
        loadWpmValue();
        wpm.value = wpmValue;
        return;
    }
    else {
        wpmValue = 100;
    }
    wpm.value = wpmValue;
    wpm.setAttribute("value", wpmValue);
    localStorage.setItem('wpmValue', wpmValue)
}

/**
 * Loads the wpm value from local storage
 */
function loadWpmValue() {
    wpmValue = localStorage.getItem('wpmValue');
    wpm.setAttribute("value", wpmValue);
}

/**
 * Gets a quote from the ron swanson api and then sends the data to the stringSplitter method,
 * followed by the displayQuote method
 * @throws {Error} If the response from the api fails, aka response is not ok, then throws the error
 */
function getQuote() {
    fetch('https://ron-swanson-quotes.herokuapp.com/v2/quotes')
        .then(response => {
            // throws an error if response is bad
            if (!response.ok) {
                throw new Error('Status code: ' + response.status)
            }
            return response.json();
        })
        .then(json => stringSplitter(json))
        .then(words => displayQuote(words))
        .catch( error => {
            console.error('There was a problem: '  + error);
            addQuoteError();
        });
}

/**
 * Takes all the quotes from the fetch request and splits it up by words
 * @param {*} json 
 */
function stringSplitter(json) {
    const words = json[0].split(' ');
    return words;
}

/**
 * Adds a the first quote from all the quotes sent over from the api
 * @param {*} words array of split up words from the fetch request
 */
function displayQuote(words) {
    currentQuoteInterval = setInterval(displayWord, (60000/wpmValue), words);
}

/**
 * Algorithm to center the current word appropriately depending on its length
 * @param {*} words array of split up words from the fetch request
 */
function displayWord(words) {
    let currentWord = words[index];
    if (currentWord.length == 1) {
        beforeFocus.innerText = '    ';
        currentFocus.innerText = currentWord;
        afterFocus.innerText = '';
    }
    else if (currentWord.length >= 2 && currentWord.length <= 5) {
        beforeFocus.innerText = '   ' + currentWord.substring(0, 1);
        currentFocus.innerText = currentWord.substring(1,2);
        afterFocus.innerText = currentWord.substring(2);
    }
    else if (currentWord.length >= 6 && currentWord.length <= 9) {
        beforeFocus.innerText = '  ' + currentWord.substring(0, 2);
        currentFocus.innerText = currentWord.substring(2,3);
        afterFocus.innerText = currentWord.substring(3);
    }
    else if (currentWord.length >= 10 && currentWord.length <= 13) {
        beforeFocus.innerText = ' ' + currentWord.substring(0, 3);
        currentFocus.innerText = currentWord.substring(3,4);
        afterFocus.innerText = currentWord.substring(4);
    }
    else if (currentWord.length > 13) {
        beforeFocus.innerText = currentWord.substring(0, 4);
        currentFocus.innerText = currentWord.substring(4,5);
        afterFocus.innerText = currentWord.substring(5);
    }
    index++;
    if (words.length == index) {
        // clear the interval aka stop the program since the quote is done
        clearInterval(currentQuoteInterval);
        // set the currentQuoteInterval to false so that the method for the start button is allowed to start the speed reader again
        currentQuoteInterval = false;
        index = 0;
        if (started){
            getQuote();
        }
    }
}

/**
 * Adds error text instead of a quote if ever there is a problem with the fetch
 */
function addQuoteError() {
    beforeFocus.innerText = 'Error retrieving quote';
}
