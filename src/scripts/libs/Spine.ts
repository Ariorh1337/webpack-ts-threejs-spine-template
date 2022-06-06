import { BoxGeometry, Mesh, MeshBasicMaterial, Scene } from "three";

export default class SpineGameObject {
    public scene: Scene;
    public mesh: Mesh;
    public geometry: BoxGeometry;

    public skeletonJson: any;
    public skeletonMesh: any;

    public material = new MeshBasicMaterial({
        color: 0xff000000,
        wireframe: true,
    });

    public _x: number;
    public _y: number;
    public _scale: number;

    constructor(data: {
        scene: Scene;
        loader: any;
        atlas: string;
        json: string;
        x?: number;
        y?: number;
        scale?: number;
        animation?: any[];
    }) {
        this.scene = data.scene;

        const atlas = data.loader.get(data.atlas);
        const atlasLoader = new window.SPINE.AtlasAttachmentLoader(atlas);
        this.skeletonJson = new window.SPINE.SkeletonJson(atlasLoader);

        const skeleton = data.loader.get(data.json);
        const skeletonData = this.skeletonJson.readSkeletonData(skeleton);
        this.skeletonMesh = new window.SPINE.threejs.SkeletonMesh(skeletonData);

        const width = skeletonData.width;
        const height = skeletonData.height;

        this.skeletonMesh.position.y = -(height / 2);

        if (data.animation?.length) {
            this.skeletonMesh.state.setAnimation(...data.animation);
        }

        this.geometry = new BoxGeometry(width, height, 1);
        this.mesh = new Mesh(this.geometry, this.material);

        this.scene.add(this.mesh);

        this.mesh.add(this.skeletonMesh);

        this.x = data.x || 0;
        this.y = data.y || 0;
        this.scale = data.scale || 1;
    }

    get x() {
        return this._x;
    }
    set x(value: number) {
        this._x = value;
        this.mesh.position.x = value;
    }

    get y() {
        return this._y;
    }
    set y(value: number) {
        this._y = value;
        this.mesh.position.y = value;
    }

    get scale() {
        return this._scale;
    }
    set scale(value: number) {
        this._scale = value;
        this.mesh.scale.x = value;
        this.mesh.scale.y = value;
    }

    get rotation() {
        return this.mesh.rotation;
    }

    get visible() {
        return this.mesh.visible;
    }
    set visible(value: boolean) {
        this.mesh.visible = value;
    }

    update(delta: number) {
        this.skeletonMesh.update(delta);
    }
}
