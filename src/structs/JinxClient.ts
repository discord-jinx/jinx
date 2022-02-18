import { Client, ClientOptions } from "discord.js";
import { Util } from "../utils/Util";

/**
 * The Jinx client extending discord.js client.
 * @param {JinxOptions} options - The options for the client.
 * @extends {Client} 
 */
export class JinxClient extends Client {
    public developerId: string | string[] | undefined;
    public util: Util;

    constructor (options: JinxOptions) {
        super(options);

        /**
         * The id of the developers
         * @type {string | string[]}
         */
        this.developerId = options["developerId"];

        /**
         * The class with utility methods.
         * @type {Util}
         */
        this.util = new Util(this);
    };
};

export interface JinxOptions extends ClientOptions {
    developerId?: string | string[];
};