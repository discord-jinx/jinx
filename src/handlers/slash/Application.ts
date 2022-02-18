import {
    ApplicationCommandDataResolvable,
    ApplicationCommandOptionData,
    ChatInputApplicationCommandData,
    CommandInteraction,
    MessageApplicationCommandData,
    MessageContextMenuInteraction,
    UserApplicationCommandData,
    UserContextMenuInteraction
} from "discord.js";
import { ApplicationHandler } from "..";
import { JinxClient } from "../..";

const resolveTypes = {
    "CHAT_INPUT": "chat",
    "MESSAGE": "message",
    "USER": "user"
};

export class Application {
    public type?: string;
    public name?: string;
    public description?: string;
    public options?: ApplicationCommandOptionData[];
    public default_permission?: boolean;
    public defaultPermission?: boolean;
    public handler!: ApplicationHandler;
    public client!: JinxClient;

    constructor(data = {} as ApplicationCommandDataResolvable) {
        
        const { type = "CHAT_INPUT", name = null } = data;

        /**
         * The type of the command
         * @type {string}
         * default to "CHAT_INPUT"
         */
        this.type = type as string;

        /**
         * The name of the command
         * @type {string | null}
         */
        this.name = name as string;


        if (type === "CHAT_INPUT") {
            const { options = [], description = "This command has no description", defaultPermission = true } = data as ChatInputApplicationCommandData;
            
            /**
             * The description of the command
             * @type {string}
             */
            this.description = description;

            /**
             * The options of the command
             * @type {ApplicationCommandOptionData[]}
             */
            this.options = options;

            /**
             * Whether the command is enabled by default when added to a guild
             * @type {boolean}
             */
            this.defaultPermission = Boolean(defaultPermission);
            this.default_permission = Boolean(defaultPermission);
            
            this.handler.cache.set(`${resolveTypes[type]}-${this.name}`, this);

        } else if (type === "MESSAGE" || type === "USER") {
            const { defaultPermission = true } = data as UserApplicationCommandData | MessageApplicationCommandData;

            /**
             * Whether the command is enabled by default when added to a guild
             * @type {boolean}
             */
            this.defaultPermission = Boolean(defaultPermission);
            this.default_permission = Boolean(defaultPermission);

            this.handler.cache.set(`${resolveTypes[type]}-${this.name}`, this);
        };
    };

    /**
     * This method will run at the beginning.
     * If this returns false then it won't interact.
     * @param {MessageContextMenuInteraction | CommandInteraction | UserContextMenuInteraction} interaction - The discord.js interaction object
     * @returns {boolean}
     */
    runBefore (interaction: MessageContextMenuInteraction | CommandInteraction | UserContextMenuInteraction): boolean {
        return true;
    };

    /**
     * Interact with the command by this method.
     * @param {MessageContextMenuInteraction | CommandInteraction | UserContextMenuInteraction} interaction - The discord.js interaction object
     * @returns 
     */
    interact (interaction: CommandInteraction) {
        return;
    };
};