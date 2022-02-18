import { Collection } from "discord.js";
import { JinxClient, ApplicationHandler } from "..";
import path from "path";

/**
 * JinxHandler class that handles modules
 * @param {JinxClient} client - The Jinx client
 * @param {JinxHandlerOptions} data - The options for the handler
 * @extends {EventEmitter}
 */
export class JinxHandler {
    public client: JinxClient;
    public directory: string;
    public cache: Collection<string, any>;
    public instance: Function | undefined;

    constructor (client: JinxClient, data: JinxHandlerOptions) {

        /**
         * The Jinx client
         * @type {JinxClient}
         */
        this.client = client;

        /**
         * The directory to the modules
         * @type {string}
         */
        this.directory = data.directory;

        /**
         * The module base class
         * @type {Function}
         */
        this.instance = data.instance;

        /**
         * The collection for storing modules
         * @type {Collection}
         */
        this.cache = new Collection();

    };

    public load (f: string) {
        let file = require(path.resolve(f));

        if (!this.client.util.checkClass(file)) {
            if (this.client.util.checkClass(file.default)) {
                file = file.default;
            } else return null;
        };

        file.prototype.client = this.client;
        file.prototype.handler = this;

        const c = new file();

        if (this.instance) {
            if (!(c instanceof this.instance)) return;
        };
    };

    public loadAll (directory: string = this.directory) {
        const paths = this.client.util.readdirFiles(directory);
        console.log(paths)

        for (let i = 0; i < paths.length; i++) {
            const file = path.resolve(paths[i]);

            this.load(file);
        }
    };
};

export interface JinxHandlerOptions {
    directory: string;
    instance?: Function;
};