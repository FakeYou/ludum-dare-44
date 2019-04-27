import * as THREE from "three";
import random from "lodash/random";
import almostEqual from "almost-equal";
import dynamics from "dynamics.js";
import { Game } from "../Game";

const COLORS = {
	bronze: {
		rim: 0xf19e4e,
		center: 0xf6cf88
	},
	silver: {
		rim: 0xcae8e9,
		center: 0xecf1f1
	},
	gold: {
		rim: 0xf8d753,
		center: 0xfff160
	}
};

const SIZE = {
	bronze: 0.44,
	silver: 0.42,
	gold: 0.4
};

class Coin extends THREE.Object3D {
	game: Game;
	mesh: THREE.Mesh;
	metal: Game.Metal;
	velocity: THREE.Vector3;

	constructor(game: Game, metal: Game.Metal = "bronze") {
		super();

		this.game = game;
		this.metal = metal;
		this.name = "coin";

		this.mesh = this.createMesh();
		this.add(this.mesh);
	}

	createMesh(): THREE.Mesh {
		const size = SIZE[this.metal];

		const rim = new THREE.Mesh(
			new THREE.CylinderBufferGeometry(size, size, 0.1, 16, 1),
			new THREE.MeshLambertMaterial({ color: COLORS[this.metal].rim })
		);

		const center = new THREE.Mesh(
			new THREE.CylinderBufferGeometry(size * 0.75, size * 0.75, 0.101, 16, 1),
			new THREE.MeshLambertMaterial({ color: COLORS[this.metal].center })
		);

		const shadow = new THREE.Mesh(
			new THREE.CylinderBufferGeometry(size + 0.01, size + 0.01, 0.11, 16, 1),
			new THREE.MeshLambertMaterial({ color: 0x2b31a4 })
		);

		(shadow.material as THREE.Material).side = THREE.BackSide;

		const mesh = new THREE.Mesh();
		mesh.add(rim);
		mesh.add(center);
		mesh.add(shadow);

		mesh.position.set(random(-0.05, 0.05), 0, random(-0.05, 0.05));

		return mesh;
	}

	isOnTheGround(): boolean {
		return almostEqual(this.position.y, 0.1, 0.05);
	}

	fall() {
		const delay = this.position.y * 100;
		const duration = 800;

		this.mesh.position.y = 2 + this.position.y * 3;

		dynamics.animate(
			{ y: 2 + this.position.y * 3 },
			{ y: 0 },
			{
				change: ({ y }) => {
					this.mesh.position.y = y;
				},
				type: dynamics.gravity,
				bounciness: 600,
				elasticity: 100,
				duration,
				delay
			}
		);

		dynamics.animate(
			this.mesh.rotation,
			{
				x: random(-0.4, 0.4),
				y: random(-0.4, 0.4),
				z: random(-0.4, 0.4)
			},
			{
				type: dynamics.forceWithGravity,
				duration: 400,
				delay
			}
		);
	}

	move(direction: THREE.Vector2 = new THREE.Vector2(), lower: boolean = false) {
		const delay = this.position.y * 50;
		const duration = 600 - delay;
		const coinY = this.position.y;

		dynamics.animate(
			this.position.clone(),
			{
				x: Math.round(this.position.x) + direction.x + random(-0.05, 0.05),
				z: Math.round(this.position.z) + direction.y + random(-0.05, 0.05)
			},
			{
				change: ({ x, z }) => {
					this.position.x = x;
					this.position.z = z;
				},
				type: dynamics.easeOut,
				duration,
				delay
			}
		);
		dynamics.animate(
			this.mesh.rotation,
			{
				x: random(-0.25, 0.25),
				y: random(-0.25, 0.25),
				z: random(-0.25, 0.25)
			},
			{
				type: dynamics.forceWithGravity,
				bounciness: 200,
				elasticity: 500,
				duration,
				delay
			}
		);
		dynamics.animate(
			{ y: 0 },
			{ y: 0.5 + this.position.y * 1 },
			{
				change: ({ y }, progress) => {
					this.mesh.position.y = y;

					if (lower) {
						this.position.y = coinY - progress * 0.12;
					}
				},
				type: dynamics.forceWithGravity,
				bounciness: 400,
				elasticity: 50,
				duration,
				delay
			}
		);
	}

	update() {}
}

export { Coin };
