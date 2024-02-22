import EventEmitter from './EventEmitter';
import Experience from '../Experience';

export default class Time extends EventEmitter {
    constructor() {
        super();

        //Setup
        this.start = Date.now();
        this.current = this.start;
        this.elapsed = 0;
        this.delta = 16;
        this.experience = new Experience();

        //Debug
        this.debug = this.experience.debug;

        window.requestAnimationFrame(() => {
            this.tick();
        });
    }

    tick() {
        if (this.debug.active) {
            this.debug.stats.begin();
        }

        const currentTime = Date.now();
        this.delta = currentTime - this.current;
        this.current = currentTime;
        this.elapsed = (this.current - this.start) / 1000;

        this.trigger('tick');

        window.requestAnimationFrame(() => {
            this.tick();
        });

        if (this.debug.active) {
            this.debug.stats.end();
        }
    }
}
