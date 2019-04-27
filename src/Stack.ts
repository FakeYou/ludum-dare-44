import * as THREE from "three";
import { Coin } from "./Coin";
import { Game } from "./Game";
import { KEY_UP, KEY_DOWN, KEY_RIGHT, KEY_LEFT } from "keycode-js";

class Stack extends THREE.Object3D {
	game: Game;
	mesh: THREE.Mesh;

	constructor(game: Game, amount: number) {
		super();

		this.game = game;
		this.name = "stack";

		for (let i = 0; i < amount; i++) {
			const coin = new Coin(game);
			coin.position.y = i * 0.25;
			coin.position.x = ((Math.random() - 0.5) * 2) / 20;
			coin.position.z = ((Math.random() - 0.5) * 2) / 20;
			this.add(coin);
		}
	}
	update() {
		if (this.game.input.isPressed(KEY_UP)) {
			this.position.z -= 1;
		}
		if (this.game.input.isPressed(KEY_DOWN)) {
			this.position.z += 1;
		}
		if (this.game.input.isPressed(KEY_RIGHT)) {
			this.position.x += 1;
		}
		if (this.game.input.isPressed(KEY_LEFT)) {
			this.position.x -= 1;
		}
	}
}

export { Stack };
