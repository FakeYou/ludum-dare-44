import * as THREE from "three";
import OrbitControls from "orbit-controls-es6";
import Tweakpane from "tweakpane";

import { Input } from "./Input";
import { Stage } from "./Stage";

class Game {
	domElement: HTMLElement;

	camera: THREE.PerspectiveCamera;
	scene: THREE.Scene;
	renderer: THREE.WebGLRenderer;
	controls: OrbitControls;
	input: Input;
	pane: Tweakpane;

	map: Tiled.Map;

	stage: Stage;
	stageNumber: number;

	stages: string[];

	constructor(domElement: HTMLElement) {
		this.domElement = domElement;

		const width = domElement.clientWidth;
		const height = domElement.clientHeight;

		this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
		this.camera.position.set(4, 4, 4);
		this.camera.lookAt(new THREE.Vector3());

		this.scene = new THREE.Scene();

		const light = new THREE.DirectionalLight(0xffffff, 0.3);
		light.position.set(0.2, 2, 0.2);
		light.lookAt(new THREE.Vector3());
		this.scene.add(light);

		this.scene.add(new THREE.AmbientLight(0xffffff, 0.8));

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(width, height);
		this.renderer.setClearColor(0xd4babb);
		this.domElement.append(this.renderer.domElement);

		this.controls = new OrbitControls(this.camera, this.domElement);
		this.controls.enableKeys = false;
		this.pane = new Tweakpane();
		this.input = new Input(this);

		this.update = this.update.bind(this);

		this.map = require("./stages/dev") as Tiled.Map;
		this.stages = this.map.layers.map(layer => layer.name).sort();

		const folder = this.pane.addFolder({ title: "stages" });
		this.stages.forEach(stage =>
			folder
				.addButton({ title: stage })
				.on("click", () => this.startStage(stage))
		);
		folder.addSeparator();
		folder
			.addButton({ title: "next" })
			.on("click", () => this.startNextStage());

		this.startStage(decodeURI(window.location.hash).replace("#", ""));

		this.update();
	}

	public startNextStage(): void {
		if (!this.stage) {
			this.startStage(this.stages[0]);
			return;
		}

		const index = this.stages.indexOf(this.stage.name);
		this.startStage(this.stages[(index + 1) % this.stages.length]);
	}

	public startStage(name: string): void {
		const previousStage = this.stage;

		if (previousStage) {
			this.scene.remove(previousStage);
		}

		window.location.hash = `#${name}`;

		this.stage = new Stage(this, this.map, name);
		this.scene.add(this.stage);
	}

	update() {
		requestAnimationFrame(this.update);

		if (this.stage) {
			this.stage.update();
		}

		this.renderer.render(this.scene, this.camera);

		this.input.update();
	}
}

export { Game };
