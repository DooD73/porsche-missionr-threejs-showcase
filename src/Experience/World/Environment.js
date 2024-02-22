import * as THREE from 'three';
import Experience from '../Experience';

export default class Environment {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.renderer = this.experience.renderer;
        this.debug = this.experience.debug;

        // Debug
        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('environment');
        }

        this.steRealtimeEnvironmentMap();
    }

    steRealtimeEnvironmentMap() {
        this.environmentMap = {};
        this.environmentMap.texture =
            this.resources.items.environmentMapTexture;
        this.environmentMap.mapping = THREE.EquirectangularReflectionMapping;
        this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace;

        // this.scene.background = this.environmentMap.texture;

        const updateAllMaterials = () => {
            this.scene.traverse((child) => {
                if (child.isMesh && child.material.isMeshStandardMaterial) {
                    child.material.envMapIntensity =
                        this.environmentMap.envMapIntensity;
                    child.material.needsUpdate = true;
                }
            });
        };

        this.environmentMap.envMapIntensity = 5;
        updateAllMaterials();

        this.ringLight = new THREE.Mesh(
            new THREE.TorusGeometry(5, 0.1, 3, 64),
            new THREE.MeshBasicMaterial({
                color: new THREE.Color(0xfffffff),
            })
        );
        this.ringLight.layers.enable(1);
        this.ringLight.rotation.x = -Math.PI * 0.5;
        this.ringLight.position.y = 0.01;
        this.scene.add(this.ringLight);

        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
            type: THREE.HalfFloatType,
        });

        this.cubeCamera = new THREE.CubeCamera(0.1, 100, cubeRenderTarget);
        this.cubeCamera.layers.set(1);
        this.scene.environment = cubeRenderTarget.texture;

        this.rightLightAnimation = true;

        if (this.debug.active) {
            this.debugFolder
                .addColor(this.ringLight.material, 'color')
                .name('ringLightColor');
            this.debugFolder
                .add(this.environmentMap, 'envMapIntensity')
                .min(0)
                .max(10)
                .step(0.001)
                .onChange(updateAllMaterials)
                .name('intensity');
            this.debugFolder
                .add(this, 'rightLightAnimation')
                .name('rightLightAnimation');
        }
    }

    update() {
        if (this.ringLight) {
            this.ringLight.scale.x =
                Math.sin(this.experience.time.elapsed * 0.5) * 0.25 + 0.75;
            this.ringLight.scale.y =
                Math.sin(this.experience.time.elapsed * 0.5) * 0.25 + 0.75;

            // Color animation - white to red
            // value shifts from 0.5 to 1
            if (this.rightLightAnimation) {
                this.ringLight.material.color.setHSL(
                    1,
                    1,
                    1 -
                        (Math.sin(this.experience.time.elapsed * 0.5) + 1) *
                            0.25
                );
            }

            this.cubeCamera.update(this.renderer.instance, this.scene);
        }
    }
}
