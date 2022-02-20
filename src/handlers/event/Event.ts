import { ClientEvents } from "discord.js";
import { JinxModule } from "../..";

/**
 * Represents a event
 * @param {EventOptions} options - The options for the event
 */
export class Event extends JinxModule {
    public name: string | null;
    public once?: boolean;

    constructor (options: EventOptions) {
        super("event", options);

        const { name = null, once = false } = typeof options === "object" ? options : {} as EventOptions;
        
        /**
         * The name of the event
         * @type {string}
         */
        this.name = name;

        /**
         * Whether to once the event
         * @type {boolean}
         */
        this.once = Boolean(once);
    };
    
    public run (...args) {
        return;
    };
};

export type EventNames = keyof ClientEvents;

export interface EventOptions {
    name: EventNames;
    once?: boolean;
};