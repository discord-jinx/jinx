import { ClientEvents } from "discord.js";
import { EventHandler } from "..";
import { JinxClient, JinxError } from "../..";

/**
 * Represents a event
 * @param {EventOptions} options - The options for the event
 */
export class Event {
    public client!: JinxClient;
    public name: string;
    public once?: boolean;
    public handler!: EventHandler;
    public readonly id: string;

    constructor (options: EventOptions) {
        const { name = null, once } = typeof options === "object" ? options : {} as EventOptions;
        
        if (!name) throw new JinxError("NO_MODULE_NAME");
        
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

        /**
         * The id of the event
         * @type {string}
         */
        this.id = "event-" + this.name;

        this.handler.cache.set(this.id, this);
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