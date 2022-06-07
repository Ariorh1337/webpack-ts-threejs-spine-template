import { Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Spine from "../../libs/Spine";
import config from "../config";
import GameScene from "./Scene";

export default class Boot extends GameScene {
    static type = "Boot";

    private loader = new window.SPINE.threejs.AssetManager();
    private spines = <Spine[]>[];

    constructor() {
        super();

        this.state.render = false;
        this.state.update = false;

        this.load().then(() => this.init());
    }

    private load() {
        const load = [] as Promise<unknown>[];

        config.forEach((item) => {
            load.push(
                new Promise((resolve, reject) => {
                    this.loader[item.module](item.key, resolve, reject);
                })
            );
        });

        return Promise.allSettled(load);
    }

    private init() {
        this.create();

        this.state.render = true;
        this.state.update = true;

        Boot.game.camera.position.set(0, 0, 400);
        Boot.game.camera.lookAt(new Vector3(0, 0, 0));

        new OrbitControls(Boot.game.camera, Boot.game.canvas);
    }

    private create() {
        const boy = new Spine({
            scene: this,
            loader: this.loader,
            atlas: "assets/raptor.atlas",
            json: "assets/raptor.json",
            x: -20,
            y: -10,
            scale: 0.1,
            animation: [0, "walk", true],
        });

        this.spines.push(boy);
    }

    public update(delta: number) {
        this.spines.forEach((spine: Spine) => {
            spine.update(delta);
        });
    }
}
