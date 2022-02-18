import { UserResolvable } from "discord.js";
import glob, { sync } from "glob";
import path from "path";
import { JinxClient } from "..";

export class Util {
    public client: JinxClient;

    constructor (client: JinxClient) {
        this.client = client;
    };

    public checkClass (file): boolean {
        return (typeof (file) === "function") 
        && file.toString().includes("class");
    };

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

    public readdirFiles (directory: string): string[] {
        const cache: string[] = [];
        const files = glob.sync(directory, { nodir: true });

        for (let i = 0; i < files.length; i++) {
            cache.push(files[i]);   
        };

        return cache;
    };

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
            return null;
        };

        return file;
    };
};