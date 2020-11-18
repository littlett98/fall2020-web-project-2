/**
 * @author Trevor McCubbin
 */

"use strict";

let wpm = document.querySelector('#wpm');
let wpmValue = wpm.value;

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
    let startButton = document.querySelector('#start-button');
    startButton.addEventListener("click", startSpeedReader);
}

function startSpeedReader() {

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
