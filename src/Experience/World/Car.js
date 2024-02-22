import * as THREE from 'three';
import Experience from '../Experience';
import {
    Lensflare,
    LensflareElement,
} from 'three/examples/jsm/objects/Lensflare.js';
import porscheAudio from '/audio/porsche.mp3';

const lightsDOM = document.getElementById('lights');
const soundDOM = document.getElementById('sound');
const sound = new Audio(porscheAudio);

export default class Car {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('car');
        }

        // Setup
        this.resources = this.resources.items.carModel;

        this.setModel();
        this.setFlareLights();
        this.setSound();
    }

    setModel() {
        this.model = this.resources.scene;
        this.model.position.set(-0.7, 0, -6.5);
        this.scene.add(this.model);

        this.scene.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        this.updateMaterials();
    }

    setFlareLights() {
        this.rightLight = new THREE.PointLight(0xffffff, 1.5, 100);
        this.rightLight.position.set(-0.85, 0.755, 2.5);
        this.leftLight = new THREE.PointLight(0xffffff, 1.5, 100);
        this.leftLight.position.set(0.9, 0.755, 2.495);

        const textureLoader = new THREE.TextureLoader();

        const textureFlare0 = textureLoader.load(
            'textures/lensflare/lensflare0.png'
        );

        this.rightLensflare = new Lensflare();
        this.leftLensflare = new Lensflare();

        this.rightLensflare.addElement(
            new LensflareElement(textureFlare0, 512, 0)
        );
        this.leftLensflare.addElement(
            new LensflareElement(textureFlare0, 512, 0)
        );

        this.rightLight.add(this.rightLensflare);
        this.leftLight.add(this.leftLensflare);

        this.scene.add(this.rightLight, this.leftLight);

        // Debug
        if (this.debug.active) {
            this.debugFolder
                .add(this.rightLight, 'intensity')
                .name('rightLightIntensity')
                .min(0)
                .max(5)
                .step(0.001);
            this.debugFolder
                .add(this.leftLight, 'intensity')
                .name('leftLightIntensity')
                .min(0)
                .max(5)
                .step(0.001);
        }
    }

    setSound() {
        const rayOrigin = this.experience.camera.instance.position;
        const rayDirection = this.model.position
            .clone()
            .sub(rayOrigin)
            .normalize();

        this.raycaster = new THREE.Raycaster(rayOrigin, rayDirection);
    }

    updateMaterials() {
        this.model.traverse((child) => {
            if (child.isMesh && child.material.isMeshStandardMaterial) {
                child.material.needsUpdate = true;
            }
        });
    }

    update() {
        // Lights
        if (lightsDOM.classList.contains('active')) {
            this.rightLight.intensity = 1.5;
            this.leftLight.intensity = 1.5;
            this.rightLensflare.visible = true;
            this.leftLensflare.visible = true;
        } else {
            this.rightLight.intensity = 0;
            this.leftLight.intensity = 0;
            this.rightLensflare.visible = false;
            this.leftLensflare.visible = false;
        }

        // Sound
        this.raycaster.setFromCamera(
            { x: 0, y: 0 },
            this.experience.camera.instance
        );

        const intersects = this.raycaster.intersectObject(this.model, true);

        if (intersects.length && soundDOM.classList.contains('active')) {
            const distance = intersects[0].distance;
            sound.volume = THREE.MathUtils.mapLinear(distance, 0, 15, 1, 0);
            sound.play();
        } else {
            sound.pause();
        }
    }
}
