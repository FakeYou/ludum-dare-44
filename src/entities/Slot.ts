import * as THREE from "three";
import { Game } from "../Game";

class Slot extends THREE.Object3D {
	game: Game;
	mesh: THREE.AxesHelper;
	metal: Game.Metal;

	constructor(game: Game, metal: Game.Metal) {
		super();

		this.game = game;
		this.metal = metal;
	}
}

export { Slot };
