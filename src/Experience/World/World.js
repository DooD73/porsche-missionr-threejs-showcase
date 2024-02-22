import Experience from '../Experience';
import Car from './Car';
import Environment from './Environment';
import Floor from './Floor';

export default class World {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        // Wait for resources
        this.resources.on('ready', () => {
            // Setup
            this.floor = new Floor();
            this.car = new Car();
            this.environment = new Environment();
        });
    }

    update() {
        if (this.floor) {
            this.floor.update();
        }
        if (this.car) {
            this.car.update();
        }
        if (this.environment) {
            this.environment.update();
        }
    }
}
