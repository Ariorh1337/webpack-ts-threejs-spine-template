import * as THREE from "three";
window.THREE = THREE;

import * as SPINE from "./libs/spine-threejs.js";
window.SPINE = SPINE.default as any;

import Game from "./app/Game";
import Boot from "./app/scenes/Boot";

new Game({
    width: innerWidth,
    height: innerHeight,
    canvas: document.getElementById("main-canvas") as HTMLCanvasElement,
    antialias: true,
    backgroundColor: new THREE.Color("rgb(100,100,100)"),
    backgroundAlpha: 1,
    scenes: [Boot],
    camera: new THREE.PerspectiveCamera(
        50,
        innerWidth / innerHeight,
        0.1,
        10000
    ),
});
