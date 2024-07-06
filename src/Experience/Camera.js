import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Experience from './Experience';

export default class Camera {
    constructor() {
        this.experience = new Experience();
        this.sizes = this.experience.sizes;
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;

        this.setInstance();
        this.setOrbitControls();
        this.setPovCamera();
    }

    setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            35,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        );
        this.instance.position.set(4, 1.5, 6);
        if (window.innerWidth < 768) this.instance.position.set(0, 1.5, 15);
        this.scene.add(this.instance);
    }

    setOrbitControls() {
        this.controls = new OrbitControls(this.instance, this.canvas);
        this.controls.enableDamping = true;
        this.controls.enablePan = false;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.1;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 15;
    }

    setPovCamera() {
        this.povCamera = this.instance.clone();
        this.povCamera.position.set(0.35, 1.1, -0.45);
        this.povCamera.rotation.y = Math.PI;
        this.povCamera.rotation.x = 0; // Fix camera tilt
        this.povCamera.rotation.z = 0; // Fix camera tilt
        this.scene.add(this.povCamera);

        // PovCamera helpers
        // this.cameraHelper = new THREE.CameraHelper(this.povCamera);
        // this.scene.add(this.cameraHelper);
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();

        this.povCamera.aspect = this.sizes.width / this.sizes.height;
        this.povCamera.updateProjectionMatrix();
    }

    update() {
        this.controls.update();
    }
}
