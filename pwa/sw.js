/**
 * You should only modify this, if you know what you are doing.
 * This phaser template is using workbox (https://developers.google.com/web/tools/workbox/)
 * to precache all assets.
 * It uses the InjectManifest function from 'workbox-webpack-plugin' inside
 * webpack/webpack.common.js
 */
import { precacheAndRoute } from 'workbox-precaching';
import * as configs from "../src/scripts/game/scenes/Boot/config";

// Use with precache injection
precacheAndRoute(self.__WB_MANIFEST)

const cacheName = 'js13kPWA-v1';

const gamesImages = [
    "assets/image/loading/background.png",
    "assets/image/loading/loading-fill.png",
    "assets/image/loading/loading-fill-bk.png",
    "assets/image/loading/loading-frame.png",
];

(function preload() {
    const load = [];

    for (let type in configs) {
        for (let key in configs[type]) {
            for (let frame in configs[type][key]) {
                load.push([type, key, configs[type][key][frame]]);
            }
        }
    }

    load.forEach((data) => {
        const [type, key, frame] = data;
        const path = `assets/${type}/${key}/${frame}`;

        if (type === "image") gamesImages.push(`${path}.png`);

        if (type === "spine") {
            gamesImages.push(`${path}.json`);
            gamesImages.push(`${path}.atlas`);
            gamesImages.push(`${path}.png`);
        }

        if (type === "aseprite") {
            gamesImages.push(`${path}.json`);
            gamesImages.push(`${path}.png`);
        }

        if (type === "audio") {
            gamesImages.push(path);
        }

        if (type === "multiatlas") {
            gamesImages.push(`${path}.json`);
            gamesImages.push(`${path}.png`);
            for (let i = 0; i < 99; i++) {
                gamesImages.push(`${path}-${i}.png`);
            }
        }
    });
})()

self.addEventListener('install', (e) => {
    e.waitUntil((async () => {
        const cache = await caches.open(cacheName);

        await cache.addAll(gamesImages);
    })());
});

self.addEventListener('fetch', (e) => {
    e.respondWith((async () => {
        const r = await caches.match(e.request);

        if (r) { return r; }

        const response = await fetch(e.request);
        const cache = await caches.open(cacheName);

        cache.put(e.request, response.clone());

        return response;
    })());
});
