import * as KeyCode from "keycode-js";
import { Game } from "./Game";

class Input {
	game: Game;
	keys: {
		[key: number]: {
			isDown: boolean;
			isPressed: boolean;
			isReleased: boolean;
		};
	};

	activeKeys: number[];

	constructor(game: Game) {
		this.game = game;
		this.keys = {};

		this.activeKeys = [
			KeyCode.KEY_UP,
			KeyCode.KEY_DOWN,
			KeyCode.KEY_LEFT,
			KeyCode.KEY_RIGHT
		];

		this.activeKeys.forEach(keyCode => {
			this.keys[keyCode] = {
				isDown: false,
				isPressed: false,
				isReleased: false
			};
		});

		this.startListeners();
	}

	startListeners() {
		window.addEventListener("keydown", ({ keyCode }) => {
			if (!this.activeKeys.includes(keyCode)) {
				return;
			}

			if (this.keys[keyCode].isDown) {
				return;
			}

			this.keys[keyCode].isDown = true;
			this.keys[keyCode].isPressed = true;
			this.keys[keyCode].isReleased = false;
		});

		window.addEventListener("keyup", ({ keyCode }) => {
			if (!this.activeKeys.includes(keyCode)) {
				return;
			}

			this.keys[keyCode].isDown = false;
			this.keys[keyCode].isPressed = false;
			this.keys[keyCode].isReleased = true;
		});
	}

	update() {
		Object.keys(this.keys).forEach(keyCode => {
			if (this.keys[keyCode].isPressed) {
				this.keys[keyCode].isPressed = false;
			}

			if (this.keys[keyCode].isReleased) {
				this.keys[keyCode].isReleased = false;
			}
		});
	}

	isDown(keyCode: number): boolean {
		return !!this.keys[keyCode] ? this.keys[keyCode].isDown : false;
	}

	isPressed(keyCode: number): boolean {
		return !!this.keys[keyCode] ? this.keys[keyCode].isPressed : false;
	}

	isReleased(keyCode: number): boolean {
		return !!this.keys[keyCode] ? this.keys[keyCode].isReleased : false;
	}
}

export { Input };
