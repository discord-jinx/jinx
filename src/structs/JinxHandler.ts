import { Collection } from "discord.js";
import { JinxClient, ApplicationHandler, JinxError } from "..";
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
    public instance: Function | any;

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
         * @type {Function | any}
         */
        this.instance = data.instance;

        /**
         * The collection for storing modules
         * @type {Collection}
         */
        this.cache = new Collection();

    };

    public load (filepath: string | null | undefined) {
        if (!filepath) throw new JinxError("NO_FILE_PATH");

        return this.client.util.getModule(filepath, this);
    };

    
    public loadAll (directory: string = this.directory) {
        const paths = this.client.util.readdirFiles(directory);

        for (let i = 0; i < paths.length; i++) {
            const file = path.resolve(paths[i]);

            this.load(file);
        };
    };

    /**
     * Reload a module from the cache
     * @param {string} id
     */
    public reload (id: string | null | undefined): boolean {
        if (!id) throw new JinxError("NO_ID", "reload");

        const file = this.cache.get(id);

        if (!file) {
            return false;
        };

        const fpath = file.path;
        delete require.cache[require.resolve(fpath)];
        this.load(fpath);

        return true;
    };

    /**
     * Reload all the modules from the cache
     * @returns {undefined} undefined
     */
    public reloadAll () {
        return this.cache.forEach((file) => {
            return this.reload(file.id);
        });
    };

    /**
     * Remove a module from the cache
     * @param {string} id - The id of the module 
     * @returns {boolean} boolean
     */
    public remove (id: string | null | undefined): boolean {
        if (!id) throw new JinxError("NO_ID", "remove");
        
        return this.cache.delete(id);
    };

    /**
     * Remove all the modules from the cache
     * @param {boolean} confirm - Pass true to confirm
     */
    public removeAll (confirm: boolean): boolean {
        const keys: string[] = [];
        this.cache.forEach((_, k) => keys.push(k));

        if (!confirm) return false;
        
         for (let key of keys) {
             this.cache.delete(key);
         };

        return true;
    };
};

export interface JinxHandlerOptions {
    directory: string;
    instance?: Function;
};