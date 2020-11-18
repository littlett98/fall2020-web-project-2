/**
 * @author Trevor McCubbin
 */

"use strict";

let wpm = document.querySelector('#wpm');
let wpmValue = wpm.value;
let started = false;
let beforeFocus = document.querySelector('#before-focus');
let currentFocus = document.querySelector('#focus');
let afterFocus = document.querySelector('#after-focus');
let startButton = document.querySelector('#start-button');
let index = 0;
let currentQuoteInterval;

//Starting point is the setup when event listeners are attached
document.addEventListener("DOMContentLoaded", setup);

/**
 * Loads the the saved wpm value from local storage if it exists
 * Adds an input event listener to the wpm input
 * Adds a click event listener to the start button which starts the rest of the program
 */
function setup() {
    // If the local storage item called wpmValue exists, load the value from storage
    if (localStorage.getItem('wpmValue')) {
        loadWpmValue();
    }
    //find the WPM input and give it an input listener
    wpm.addEventListener("input", updateWpmValue);
    //find the start button and give it a click listener
    startButton.addEventListener("click", startStopButton);
}

/**
 * When the start stop button is clicked, it gets a quote if it was in the stopped state 
 * and then changes the state of the button
 */
function startStopButton() {
    if (!started){
        getQuote();
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
        // reset index to 0 when you're done running the program
        index = 0;
    }
    started = !started;
}

/**
 * Updates the wpm value in html and saves it to local storage
 */
function updateWpmValue() {
    wpmValue = wpm.value;
    wpm.setAttribute("value", wpmValue);
    localStorage.setItem('wpmValue', wpmValue);
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
 * @param {*} words array of words
 */
function displayWord(words) {
    let currentWord = words[index];
    if (currentWord.length == 1) {
        beforeFocus.innerText = '    ';
        currentFocus.innerText = currentWord;
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
        clearInterval(currentQuoteInterval);
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
