
import * as THREE from 'three';
window.THREE = THREE;

import * as SPINE from './libs/spine-threejs.js';
window.SPINE = SPINE.default as any;

import { App } from './app/app';

new App();
