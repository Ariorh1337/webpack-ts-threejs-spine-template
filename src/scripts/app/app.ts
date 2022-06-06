import {
    Clock,
    Color,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer,
} from "three";
import Spine from "../libs/Spine";

export class App {
    private readonly timer = new Clock();
    private readonly scene = new Scene();
    private readonly camera = new PerspectiveCamera(
        45,
        innerWidth / innerHeight,
        0.1,
        10000
    );
    private readonly renderer = new WebGLRenderer({
        antialias: true,
        canvas: document.getElementById("main-canvas") as HTMLCanvasElement,
    });
    private loader = new window.SPINE.threejs.AssetManager();

    private spines = <Spine[]>[];

    constructor() {
        this.camera.position.set(0, 0, 400);
        this.camera.lookAt(new Vector3(0, 0, 0));

        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setClearColor(new Color("rgb(0,0,0)"));

        this.load().then(() => this.create());
        this.render();
    }

    private load() {
        const load = [] as any[];

        load.push(
            new Promise((resolve, reject) => {
                this.loader.loadText("assets/raptor.json", resolve, reject);
            })
        );

        load.push(
            new Promise((resolve, reject) => {
                this.loader.loadTextureAtlas(
                    "assets/raptor.atlas",
                    resolve,
                    reject
                );
            })
        );

        return Promise.allSettled(load);
    }

    private create() {
        const boy = new Spine({
            scene: this.scene,
            loader: this.loader,
            atlas: "assets/raptor.atlas",
            json: "assets/raptor.json",
            x: 0,
            y: -10,
            scale: 0.1,
            animation: [0, "walk", true],
        });

        this.spines.push(boy);

        (<any>window).boy = boy;
    }

    private update() {
        const delta = this.timer.getDelta();

        // update the animation
        this.spines.forEach((spine: Spine) => {
            spine.update(delta);
        });
    }

    private adjustCanvasSize() {
        this.renderer.setSize(innerWidth, innerHeight);
        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();
    }

    private render() {
        this.adjustCanvasSize();

        this.renderer.render(this.scene, this.camera);

        requestAnimationFrame(() => {
            if (!this.loader.isLoadingComplete()) return this.render();

            this.update();
            this.render();
        });
    }
}
