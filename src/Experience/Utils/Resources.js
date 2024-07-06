import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import EventEmitter from './EventEmitter';

export default class Resources extends EventEmitter {
    constructor(assets) {
        super();

        // Options
        this.assets = assets;

        // Setup
        this.items = {};
        this.toLoad = this.assets.length;
        this.loaded = 0;
        this.preloader = document.querySelector('.preloader');
        this.overlay = document.querySelector('.overlay');

        this.setLoaders();
        this.startLoading();
    }

    setLoaders() {
        this.loaders = {};

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/draco/');
        this.loaders.gltfLoader = new GLTFLoader();
        this.loaders.gltfLoader.setDRACOLoader(dracoLoader);

        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader();
    }

    startLoading() {
        // Load each source
        for (const source of this.assets) {
            if (source.type === 'gltf') {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);
                    },
                    (xhr) => {
                        this.onLoading(xhr);
                    }
                );
            } else if (source.type === 'texture') {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);
                    },
                    (xhr) => {
                        this.onLoading(xhr);
                    }
                );
            } else if (source.type === 'cubeTexture') {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) => {
                        this.sourceLoaded(source, file);
                    },
                    (xhr) => {
                        this.onLoading(xhr);
                    }
                );
            }
        }
    }

    onLoading(xhr) {
        // Update loading bar
        console.log('Loading progress:', (xhr.loaded / xhr.total) * 100); // Log the loading progress
        this.overlay.style.clipPath = `inset(0 ${
            100 - (xhr.loaded / xhr.total) * 100
        }% 0 0)`;
        console.log('Overlay clipPath style:', this.overlay.style.clipPath); // Log the applied style
    }

    sourceLoaded(source, file) {
        this.items[source.name] = file;

        this.loaded++;

        if (this.loaded === this.toLoad) {
            this.preloader.style.opacity = 0;
            setTimeout(() => {
                this.preloader.style.display = 'none';
            }, 1000);
            this.trigger('ready');
        }
    }
}
