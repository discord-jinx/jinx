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

    public readdirFiles (directory: string): string[] {
        const cache: string[] = [];
        const files = glob.sync(directory, { nodir: true });

        for (let i = 0; i < files.length; i++) {
            cache.push(files[i]);   
        };

        return cache;
    };
};