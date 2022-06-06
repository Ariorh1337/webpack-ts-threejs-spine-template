import { Scene } from "three";
import Game from "../Game";

export default class GameScene extends Scene {
    static type = "GameScene";
    static game: Game;

    public state = {
        render: true,
        update: true,
    };

    constructor() {
        super();
    }

    public update(delta: number) {}
}
