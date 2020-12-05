const entityManager = require("../../engine/classes/EntityManager");
const Background = require("../../engine/classes/Background");
const Button = require("../../engine/classes/Buttons/Button");
const Game = require("./Game");

class SplashScreen {
    constructor(canvas) {
        this.canvas = canvas;
        entityManager.clear();
        this.background = new Background('img/background.jpg', this.canvas);
        // this.highScores = new HighScores();

        this.startButton = new Button(70, this.canvas.height - 300, 150, 50, "Start Button");
        this.startButton.onMouseDown = () => window.currentScreen = new Game(this.canvas);

        entityManager.add(this.background);
        entityManager.add(this.startButton);
    }
}

module.exports = SplashScreen;
