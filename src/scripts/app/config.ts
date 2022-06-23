const config = [
    {
        type: "spine",
        key: "assets/raptor.json",
        module: "loadText",
    },
    {
        type: "spine",
        key: "assets/raptor.atlas",
        module: "loadTextureAtlas",
    },
    {
        type: "gltf",
        key: "assets/cell.glb",
        module: "load"
    }
];

export default config;
