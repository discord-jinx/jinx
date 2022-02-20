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
import { JinxClient, JinxError } from "../..";

const appTypes = {
    "CHAT_INPUT": "chat",
    "MESSAGE": "message",
    "USER": "user"
};

/**
 * Represents a application command
 * @param {ApplicationCommandDataResolvable & ApplicationOptions} data - The options for the command
 */
export class Application {
    public type?: string;
    public name?: string;
    public description?: string;
    public options?: ApplicationCommandOptionData[];
    public default_permission?: boolean;
    public defaultPermission?: boolean;
    public handler!: ApplicationHandler;
    public client!: JinxClient;
    public allowDM?: boolean;
    public dmOnly?: boolean;
    public onlyChannel?: string | string[];
    public onlyUser?: string | string[];
    public id: string;

    constructor(data = {} as ApplicationCommandDataResolvable & ApplicationOptions) {

        const {
            type = "CHAT_INPUT",
            name = null,
            allowDM,
            dmOnly = false,
            onlyChannel = null,
            onlyUser = null
        } = typeof data === "object" ? data : {} as ApplicationCommandDataResolvable & ApplicationOptions;

        if (!name) throw new JinxError("NO_MODULE_NAME");

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
        } else if (type === "MESSAGE" || type === "USER") {
            const { defaultPermission = true } = data as UserApplicationCommandData | MessageApplicationCommandData;

            /**
             * Whether the command is enabled by default when added to a guild
             * @type {boolean}
             */
            this.defaultPermission = Boolean(defaultPermission);
            this.default_permission = Boolean(defaultPermission);
        };

        /**
         * The id of the command
         * @type {string | null}
         */
         this.id = appTypes[type] + "-" + this.name;

        /**
         * Defines the property - "allowDM"
         * @type {boolean}
         */
        Object.defineProperty(this, "allowDM", { value: (allowDM && typeof (allowDM) === "boolean") ? allowDM : (this.handler) ? this.handler.allowDM : false, enumerable: false });

        /**
         * Defines the property - "dmOnly"
         * @type {boolean}
         */
        Object.defineProperty(this, "dmOnly", { value: Boolean(dmOnly), enumerable: false });

        /**
         * Defines the property - "onlyChannel"
         * @type {string | string[] | null}
         */
        Object.defineProperty(this, "onlyChannel", { value: onlyChannel, enumerable: false });

        /**
         * Defines the property - "onlyUser"
         * @type {string | string[] | null}
         */
        Object.defineProperty(this, "onlyUser", { value: onlyUser, enumerable: false });

        this.handler.cache.set(this.id, this);
    };

    /**
     * This method will run at the beginning.
     * If this returns false then it won't interact.
     * @param {MessageContextMenuInteraction | CommandInteraction | UserContextMenuInteraction} interaction - The discord.js interaction object
     * @returns {boolean}
     */
    public runBefore(interaction: MessageContextMenuInteraction | CommandInteraction | UserContextMenuInteraction): boolean {
        return true;
    };

    /**
     * Interact with the command by this method.
     * @param {MessageContextMenuInteraction | CommandInteraction | UserContextMenuInteraction} interaction - The discord.js interaction object
     * @returns 
     */
    public interact(interaction: MessageContextMenuInteraction | CommandInteraction | UserContextMenuInteraction) {
        return;
    };

    /**
     * Removes the command from the cache
     */
    public remove() {
        return this.handler.remove(this.id as string);
    };

    /**
     * Reloads the command
     */
    public reload () {
        return this.handler.reload(this.id as string);
    };
};

export interface ApplicationOptions {
    allowDM?: boolean;
    dmOnly?: boolean;
    onlyChannel?: string | string[];
    onlyUser?: string | string[];
};