import * as THREE from "three";
import every from "lodash/every";
import random from "lodash/random";
import dynamics from "dynamics.js";
import { Game } from "./Game";
import { Coin } from "./entities/Coin";
import {
	getProperty,
	getGroupLayer,
	getTileLayer,
	getObjectGroupLayer
} from "./utils/tiled";
import { KEY_UP, KEY_DOWN, KEY_RIGHT, KEY_LEFT } from "keycode-js";
import { Slot } from "./entities/Slot";

const WALKABLE = [2, 9];

class Stage extends THREE.Object3D {
	game: Game;
	definition: Tiled.Map;
	coins: Coin[];
	slots: Slot[];

	stage: Tiled.GroupLayer;
	ground: Tiled.TileLayer;
	entities: Tiled.ObjectGroupLayer;

	gridPosition: THREE.Vector2;
	stackPosition: THREE.Vector2;

	stages: Tiled.Layer;

	constructor(game: Game, definition: Tiled.Map, name: string) {
		super();

		this.game = game;
		this.definition = definition;
		this.name = name;

		this.stage = getGroupLayer(this.definition, this.name);
		this.ground = getTileLayer(this.stage, "ground");
		this.entities = getObjectGroupLayer(this.stage, "entities");

		this.stackPosition = new THREE.Vector2();

		this.slots = [];
		this.coins = [];
		this.gridPosition = new THREE.Vector2();

		this.create();
	}

	private create() {
		this.createSpawn();
		this.createGround();
		this.createStack();
		this.createSlots();
	}

	private createGround() {
		this.ground.data.forEach((gid, i) => {
			if (gid === 0) {
				return;
			}

			const plane = new THREE.Mesh(
				new THREE.BoxBufferGeometry(1, 0.2, 1),
				new THREE.MeshLambertMaterial({
					color: gid === 1 ? 0x00000 : gid === 9 ? 0xf7e26b : 0xffffff
				})
			);

			plane.position.x = i % this.ground.width;
			plane.position.y = -0.1;
			plane.position.z = Math.floor(i / this.ground.width);

			const shadow = new THREE.Mesh(
				new THREE.BoxGeometry(1.02, 0.22, 1.02),
				new THREE.MeshLambertMaterial({ color: 0x2b31a4 })
			);
			(shadow.material as THREE.Material).side = THREE.BackSide;
			plane.add(shadow);

			this.add(plane);
		});
	}

	private createSpawn() {
		this.entities.objects.forEach(object => {
			if (object.name === "spawn") {
				const x = object.x / this.definition.tilewidth;
				const y = object.y / this.definition.tileheight - 1;
				this.stackPosition.set(x, y);
			}

			if (object.name === "camera") {
				const x = object.x / this.definition.tilewidth;
				const y = object.y / this.definition.tileheight - 1;
				this.game.controls.object.position.set(x + 4, 4, y + 4);
				this.game.controls.target.set(x, 1, y);
				this.game.camera.lookAt(this.game.controls.target);
			}
		});
	}

	private createStack() {
		this.entities.objects.forEach(object => {
			if (object.name.match(/coin/i)) {
				const metal = getProperty<Game.Metal>(object.properties, "metal");
				const coin = new Coin(this.game, metal);

				coin.position.set(
					this.stackPosition.x,
					(object.y / this.definition.tileheight - 0.5) * 0.12,
					this.stackPosition.y
				);
				this.add(coin);
				this.coins.push(coin);

				coin.fall();
			}
		});
	}

	private createSlots() {
		this.entities.objects.forEach(object => {
			if (object.name === "slot") {
				const metal = getProperty<Game.Metal>(object.properties, "metal");
				const slot = new Slot(this.game, metal);
				slot.position.x = object.x / this.definition.tilewidth;
				slot.position.z = object.y / this.definition.tileheight - 1;
				this.add(slot);
				this.slots.push(slot);
			}
		});
	}

	private isWalkable(position: THREE.Vector2): boolean {
		const tile = this.ground.data[position.y * this.ground.width + position.x];
		return WALKABLE.includes(tile);
	}

	private isOccupied(position: THREE.Vector2): boolean {
		for (let coin of this.coins) {
			if (
				Math.round(coin.position.x) === position.x &&
				Math.round(coin.position.z) === position.y
			) {
				return true;
			}
		}

		return false;
	}

	private moveStack(direction: THREE.Vector2) {
		const target = this.stackPosition.clone().add(direction);

		if (this.isWalkable(target)) {
			const isOccupied = this.isOccupied(target);

			this.coins.forEach(coin => {
				if (!coin.isOnTheGround()) {
					// coin.position.x = target.x;
					// coin.position.z = target.y;
					coin.move(direction, !isOccupied);
				}
			});

			this.stackPosition.copy(target);
		}
	}

	private checkObjectives() {
		const completedObjectives = this.slots.map(slot => {
			const coin = this.coins.filter(
				coin =>
					Math.round(coin.position.x) === slot.position.x &&
					Math.round(coin.position.z) === slot.position.z
			)[0];

			return !!coin && coin.isOnTheGround() && coin.metal == slot.metal;
		});

		const completedStage = every(completedObjectives);

		if (completedStage) {
			this.game.startNextStage();
		}
	}

	update() {
		if (this.game.input.isPressed(KEY_UP)) {
			this.moveStack(new THREE.Vector2(0, -1));
		}
		if (this.game.input.isPressed(KEY_DOWN)) {
			this.moveStack(new THREE.Vector2(0, 1));
		}
		if (this.game.input.isPressed(KEY_RIGHT)) {
			this.moveStack(new THREE.Vector2(1, 0));
		}
		if (this.game.input.isPressed(KEY_LEFT)) {
			this.moveStack(new THREE.Vector2(-1, 0));
		}

		this.checkObjectives();
	}
}

export { Stage };
