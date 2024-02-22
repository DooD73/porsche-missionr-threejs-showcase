import * as THREE from 'three';
import Experience from '../Experience';
import vertexShader from '../Shaders/floor/vertex.glsl';
import fragmentShader from '../Shaders/floor/fragment.glsl';

export default class Floor {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.debug = this.experience.debug;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('floor');
        }

        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }

    setGeometry() {
        this.geometry = new THREE.PlaneGeometry(20, 20, 1, 1);
    }

    setMaterial() {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uTime: { value: 0 },
                uColor: { value: new THREE.Color('#ff0000') },
            },
            vertexShader,
            fragmentShader,
        });

        if (this.debug.active) {
            this.debugFolder
                .add(this.material.uniforms.uColor.value, 'r')
                .min(0)
                .max(1)
                .step(0.001)
                .name('red');
            this.debugFolder
                .add(this.material.uniforms.uColor.value, 'g')
                .min(0)
                .max(1)
                .step(0.001)
                .name('green');
            this.debugFolder
                .add(this.material.uniforms.uColor.value, 'b')
                .min(0)
                .max(1)
                .step(0.001)
                .name('blue');
        }
    }

    setMesh() {
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.rotation.x = -Math.PI * 0.5;
        this.mesh.receiveShadow = true;
        this.scene.add(this.mesh);
    }

    update() {
        this.material.uniforms.uTime.value = this.experience.time.elapsed;
    }
}
