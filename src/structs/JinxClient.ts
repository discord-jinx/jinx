import { Client, ClientOptions } from "discord.js";
import { JinxInvite, Util } from "..";

/**
 * The Jinx client extending discord.js client.
 * @param {JinxOptions} options - The options for the client.
 * @extends {Client} 
 */
export class JinxClient extends Client {
    public developerId: string | string[] | undefined;
    public util: Util;
    public invite!: JinxInvite | null;

    constructor (options: JinxOptions) {
        super(options);

        /**
         * The id of the developers
         * @type {string | string[]}
         */
        this.developerId = options["developerId"];

        /**
         * The utility of the client
         * @type {Util}
         */
        this.util = new Util(this);
        
        /**
         * The invite creator of the client
         * @type {JinxInvite | null}
         */
        this.invite = null;
    };

    public login(token?: string): Promise<string> {
        this.once("ready", () => {
            this.invite = new JinxInvite(this);
        });

        return super.login(token);
    };
};

export interface JinxOptions extends ClientOptions {
    developerId?: string | string[];
};