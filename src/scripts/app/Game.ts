import { Clock, Color, PerspectiveCamera, WebGLRenderer } from "three";
import Scene from "./scenes/Scene";

type GameConfig = {
    width: number;
    height: number;
    canvas: HTMLCanvasElement;
    antialias: boolean;
    backgroundColor: Color;
    backgroundAlpha: number;
    scenes: typeof Scene[];
    camera: PerspectiveCamera;
};

export default class Game {
    public readonly config: GameConfig;
    public readonly canvas: HTMLCanvasElement;
    public readonly renderer: WebGLRenderer;
    public readonly camera: PerspectiveCamera;

    public readonly scenes: Scene[] = [];
    public readonly timer = new Clock();

    constructor(config: GameConfig) {
        this.config = config;
        this.canvas = config.canvas;
        this.camera = config.camera;

        this.renderer = new WebGLRenderer({
            antialias: config.antialias,
            canvas: this.canvas,
        });

        this.renderer.setSize(config.width, config.height);
        this.renderer.setClearColor(
            config.backgroundColor,
            config.backgroundAlpha
        );

        Scene.game = this;
        this.scenes = config.scenes.map((scene) => {
            return new scene();
        });

        this.loop();
    }

    private prerender() {
        this.adjustCanvasSize();
    }

    private render() {
        this.scenes.forEach((scene) => {
            if (!scene.state.render) return;

            this.renderer.render(scene, this.camera);
        });
    }

    private loop = () => {
        this.update();
        this.prerender();
        this.render();

        requestAnimationFrame(this.loop);
    };

    private update() {
        const delta = this.timer.getDelta();

        this.scenes.forEach((scene) => {
            if (!scene.state.update) return;

            scene.update(delta);
        });
    }

    private adjustCanvasSize() {
        this.renderer.setSize(this.config.width, this.config.height);
        this.camera.aspect = this.config.width / this.config.height;
        this.camera.updateProjectionMatrix();
    }
}
