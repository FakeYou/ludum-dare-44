import { Game } from "./Game";

declare global {
	interface Window {
		game: Game;
	}
}

window.game = new Game(document.querySelector(".game"));
