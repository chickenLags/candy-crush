// Preparing the canvas, context, inputhandler, entitymanager and gameloop.
const InputHandler = require("../engine/classes/InputHandler.js");
const entityManager = require("../engine/classes/EntityManager");

const SplashScreen = require("./scenes/SplashScreen");
const Game = require("./scenes/Game.js");

let canvas = document.querySelector('canvas');
let padding = 0;

canvas.width = window.innerWidth - padding;
canvas.height = window.innerHeight - padding;

let ctx = canvas.getContext('2d');

// let entityManager = new EntityManager();
let inputHandler = new InputHandler(canvas, entityManager);

let endTime = startTime = elapsedTime = Date.now();

/**
 * This is the game loop.
 */
// let intervalHandle = setInterval(
function gameLoop () { 
    // takes time into account
    startTime = Date.now();
    elapsedTime = (startTime - endTime) / 1000;
    endTime = startTime;

    

    // clears screen
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0, canvas.width, canvas.height);

    // updates and render the screen and objects
    entityManager.input(inputHandler.poll());
    entityManager.update(elapsedTime);
    entityManager.render(ctx);

    window.requestAnimationFrame(gameLoop);

} //, 1000/30);

gameLoop();



// Starting the game by assigning the current screen to The opening scene (SplashScreen())
window.currentScreen = new SplashScreen(canvas);

