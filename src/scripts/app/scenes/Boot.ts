import { AmbientLight, DirectionalLight, Group, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Spine from "../../libs/Spine";
import config from "../config";
import LoadManager from "../LoadManager";
import GameScene from "./Scene";

export default class Boot extends GameScene {
    static type = "Boot";

    private loader = new LoadManager(config);
    private spines = <Spine[]>[];

    constructor() {
        super();

        this.state.render = false;
        this.state.update = false;

        this.loader.load().then(() => this.init());
    }

    public update(delta: number) {
        this.spines.forEach((spine: Spine) => {
            spine.update(delta);
        });
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
        this.createLight();
        this.createGLB();
        //this.createSpine();
    }

    private createLight() {
        this.add(new AmbientLight(0x00ffff, 0.5));

        const light = new DirectionalLight(0xffffff, 0.5);
        light.position.set(100, 100, 100);

        this.add(light);
    }

    private createGLB() {
        const glb = this.loader.get("assets/cell.glb")[0].scene as Group;

        glb.scale.setScalar(30);

        this.add(glb);
    }

    private createSpine() {
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
}
