import { Collection, GuildMember, Message } from "discord.js";
import { JinxClient, JinxError } from "..";
import glob, { sync } from "glob";
import path from "path";

export class Util {
    public client: JinxClient;

    constructor (client: JinxClient) {
        this.client = client;
    };

    /**
     * @param {any} file 
     * @returns {boolean}
     */
    public checkClass (file): boolean {
        return (typeof (file) === "function") 
        && file.toString().includes("class");
    };

    /**
     * Check if the user is a developer
     * @param {string} id - The id of the user
     * @returns {boolean}
     */
    public checkDeveloper (id: string): boolean {
        const { developerId } = this.client;

        if (Array.isArray(developerId)) {
            return developerId.includes(id);
        } else {
            return id === developerId;
        };
    };

    public hasUser (userId: string | string[], current: string): boolean {
        return Array.isArray(userId) ? userId.includes(current) : current === userId;
    };

    public checkChannel (channel: string | string[], current: string): boolean {
        return Array.isArray(channel) ? channel.includes(current) : current === channel;
    };

    /**
     * Gets all the files path from a directory
     * @param {string} directory - The path to the directory
     */
    public readdirFiles (directory: string): string[] {
        const cache: string[] = [];
        const files = glob.sync(directory, { nodir: true });

        for (let i = 0; i < files.length; i++) {
            cache.push(files[i]);   
        };

        return cache;
    };

    /**
     * Gets the module from the path
     * @param {string} filepath - The path to the module
     * @param {*} handler - The handler of the module
     * @returns {any}
     */
    public getModule (filepath: string, handler): any | null {
        var file = require(path.resolve(filepath));

        if (!this.client.util.checkClass(file)) {
            if (this.client.util.checkClass(file.default)) {
                file = file.default;
            } else return null;
        };

        file.prototype.client = this.client;
        file.prototype.handler = handler;
        file.prototype.path = filepath;

        file = new file();

        if (!(file instanceof handler.instance)) {
            throw new JinxError("NOT_AN_INSTANCE", handler.instance.name);
        };

        return file;
    };

    /**
     * Get all the keys from a collection
     * @param {Collection<any, any>} col - The Discord.js collection
     * @returns {string[]}
     */
    public getAllCollectionKeys (col: Collection<any, any>): string[] {
        const cache: string[] = [];
        col.forEach((v, k) => cache.push(k));

        return cache;
    };

    public async resolvePrefix (prefix: string | string[] | Function, message: Message) {
        var pref: string | string[] = "jx!";

        if (typeof (prefix) === "function") {
            pref = await prefix(message);
        } else if (typeof (prefix) === "string") {
            pref = prefix;
        } else if (Array.isArray(prefix)) {
            pref = prefix;
        };

        return pref;
    };
};