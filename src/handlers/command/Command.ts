import { PermissionString } from "discord.js"
import { JinxClient, JinxError, JinxModule } from "../..";
import { CommandHandler } from "..";

/**
 * Represents a command
 * @param {CommandOptions} options - The options for the command
 */
export class Command extends JinxModule {
    public client!: JinxClient;
    public name: string;
    public description?: string | null;
    public aliases: string[];
    public category: string | string[];
    public example: any;
    public developer: boolean;
    public allowBots: boolean;
    public allowClient: boolean;
    public allowDM: boolean;
    public userPermissions: PermissionString[];
    public clientPermissions: PermissionString[];
    public cooldown: number;
    public handler!: CommandHandler;

    constructor (options: CommandOptions) {
        super("command", options);

        const { 
            name = null, 
            description = null, 
            aliases = [], 
            example = null,
            category = "default",
            developer = false,
            cooldown,
            allowBots,
            allowClient,
            allowDM,
            userPermissions = [],
            clientPermissions = []
        } = typeof options === "object" ? options : {} as CommandOptions;

        if (!name) throw new JinxError("NO_MODULE_NAME");
        
        /**
         * The name of the command
         * @type {string}
         */
        this.name = name;

        /**
         * The description of the command
         * @type {string | null}
         */
        this.description = description;

        /**
         * The aliases of the command
         * @type {string[]}
         */
        this.aliases = aliases;

        /**
         * Whether to allow the bots to use the commands
         * @type {boolean}
         */
         this.allowBots = typeof allowBots === "boolean" ? allowBots : this.handler.allowBots;

         /**
          * Whether to allow the client to use its own commands
          * @type {boolean}
          */
         this.allowClient = typeof allowClient === "boolean" ? allowClient : this.handler.allowClient;
 
         /**
          * Whether to allow the use of commands in DMs
          * @type {boolean}
          */
         this.allowDM = typeof allowDM === "boolean" ? allowDM : this.handler.allowDM;

        /**
         * Whether the command is developer only
         * @type {boolean}
         */
        this.developer = Boolean(developer);

        /**
         * The examples for the command
         * @type {any}
         */
        this.example = example;

        /**
         * The category for the command
         * @type {string}
         */
        this.category = category;

        /**
         * The permissions required for the user
         * @type {string[]}
         */
        this.userPermissions = Array.isArray(userPermissions) ? userPermissions : [];

        /**
         * The permissions required for the client
         * @type {string[]}
         */
        this.clientPermissions = Array.isArray(clientPermissions) ? clientPermissions : [];

        /**
         * The cooldown of the command
         * @type {number}
         */
        this.cooldown = typeof cooldown === "number" ? cooldown : this.handler.defaultCooldown;

        if (Array.isArray(aliases)) {
            aliases.forEach(alias => {
                this.handler.cache.set(alias, this);
            });
        };
    };

    public hasPermission (message) {
        return true;
    };
    
    public run (message, args) {
        return;
    };
};

export interface CommandOptions {
    name: string;
    description?: string;
    aliases?: string[];
    category?: string | string[];
    example?: any;
    developer?: boolean;
    allowBots?: boolean;
    allowClient?: boolean;
    allowDM?: boolean;
    allowMention?: boolean;
    userPermissions?: PermissionString[];
    clientPermissions?: PermissionString[];
    cooldown?: number;
};