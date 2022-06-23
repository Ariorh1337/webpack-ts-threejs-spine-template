import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


export default class LoadManager {
    public readonly config: [
        { 
            type: string;
            module: string;
            key: string;
        }
    ];

    public readonly spine = new window.SPINE.threejs.AssetManager();
    public readonly gltf = new GLTFLoader();
    public raw: Map<string, any>;

    constructor(config) {
        this.config = config;
    }

    public async load() {
        const load = [] as Promise<unknown>[];

        this.config.forEach((item) => {
            load.push(
                new Promise((resolve, reject) => {
                    this[item.type][item.module](item.key, (...data) => {
                        resolve([item.key, data]);
                    });
                })
            );
        });

        const raw = await Promise.allSettled(load);
        this.raw = new Map(raw.map((data: any) => data.value));

        return raw;
    }

    public get(key: string) {
        return this.raw.get(key);
    }
}