/**
 * @author Trevor McCubbin
 */

"use strict";

let wpm = document.querySelector('#wpm');
let wpmValue = wpm.value;
let started = false;
let beforeFocus = document.querySelector('#before-focus');
let startButton = document.querySelector('#start-button');

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

function startStopButton() {
    if (!started){
        getQuote();
    }
    changeButtonState();
}

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
 * Gets a quote from the ron swanson api and then sends the data to the addQuote method
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
        .then(json => addQuote(json))
        .catch( error => {
            console.error('There was a problem: '  + error);
            addQuoteError();
        });
}

/**
 * Adds a the first quote from all the quotes sent over from the api
 * @param {*} json 
 */
function addQuote(json) {
    removeOldQuote();
    let text = document.createTextNode(json[0]);
    beforeFocus.appendChild(text);
}

/**
 * Removes all the text within the article for quotes
 */
function removeOldQuote() {
    beforeFocus.innerText = '';
}

/**
 * Adds error text instead of a quote if ever there is a problem with the fetch
 */
function addQuoteError() {
    removeOldQuote();
    let text = document.createTextNode("Error retrieving quote, please try again");
    beforeFocus.appendChild(text);
}
