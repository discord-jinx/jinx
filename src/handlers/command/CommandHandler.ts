import {
    JinxClient,
    JinxError,
    JinxHandler,
    JinxHandlerOptions
} from "../..";
import { Message, Intents, PermissionString } from "discord.js";
import { Command } from "./Command";

export class CommandHandler extends JinxHandler {
    public prefix: string | string[] | Function;
    public allowBots: boolean;
    public allowClient: boolean;
    public allowDM: boolean;
    public allowMention: boolean;
    public defaultCooldown: number;
    public cooldownMessage: CommandHandlerOptions["cooldownMessage"];

    constructor(client: JinxClient, {
        directory = null,
        instance = Command,
        prefix = "jx!",
        allowBots = false,
        allowClient = false,
        allowDM = false,
        allowMention = true,
        defaultCooldown = 3000,
        cooldownMessage = () => true
    } = {} as CommandHandlerOptions) {
        if (!directory) throw new JinxError("NO_DIRECTORY", "commands");
        super(client, { directory, instance });

        /**
         * The prefix of the client
         * @type {string | string[] | Function}
         */
        this.prefix = typeof (prefix) === "function" ? prefix.bind(this) : prefix;

        /**
         * Whether to allow the bots to use the commands
         * @type {boolean}
         */
        this.allowBots = Boolean(allowBots);

        /**
         * Whether to allow the client to use its own commands
         * @type {boolean}
         */
        this.allowClient = Boolean(allowClient);

        /**
         * Whether to allow the use of commands in DMs
         * @type {boolean}
         */
        this.allowDM = Boolean(allowDM);

        /**
         * Whether to allow client mention usable as a prefix
         * @type {boolean}
         */
        this.allowMention = Boolean(allowMention);

        /**
         * The default cooldown time for the commands
         * @type {number}
         */
        this.defaultCooldown = typeof defaultCooldown === "number" ? defaultCooldown : 3000;

        /**
         * The message on cooldown
         * @type {Function}
         */
        this.cooldownMessage = typeof cooldownMessage === "function" ? cooldownMessage.bind(this) : () => true;
    };

    public load(filepath: string) {
        this.client.util.getModule(filepath, this);

        return this.setup();
    };

    private setup() {
        const intents = this.client.options.intents;
        const hasIntent = (Number(intents) & Intents.FLAGS.GUILD_MESSAGES) === Intents.FLAGS.GUILD_MESSAGES;

        if (!hasIntent) throw new JinxError("MISSING_INTENT", "GUILD_MESSAGES", "load message commands.");

        this.client.once("ready", () => {
            this.client.on("messageCreate", async message => {
                if (message.partial) await message.fetch();
                this.exec(message);
            });
        });
    };

    private async exec(message: Message) {

        var prefix = "";

        if (this.allowMention && message.content.startsWith(`<@!${this.client.user?.id}>`)) {
            prefix = `<@!${this.client.user?.id}>`;
        } else {
            var getPrefix = await this.client.util.resolvePrefix(this.prefix, message);

            if (Array.isArray(getPrefix)) {
                prefix = getPrefix.find((p) => message.content.startsWith(p)) as string;
            } else if (typeof (getPrefix) === "string") {
                prefix = getPrefix;
            };
        };

        if (!prefix) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const commandName = args.shift()?.toLowerCase();

        const command: Command = this.cache.get(`command-${commandName}`) || this.cache.get(`command-alias-${commandName}`);

        if (command) {

            if (!command.allowClient
                && message.author.id === this.client.user?.id) return;

            if (command.allowDM
                && message.channel.type !== "DM") return;

            if (command.developer
                && !this.client.util.checkDeveloper(message.author.id)
            ) return;

            if (message.guild) {
                if (command.userPermissions.length) {
                    if (!message.member?.permissions.has(
                        command.userPermissions
                    )) return;
                };

                if (command.clientPermissions.length) {
                    if (!message.guild?.me?.permissions.has(
                        command.clientPermissions
                    )) return;
                };

                if (!(await command.hasPermission(message))) return;
            };

            const cooldown = this.client.cooldown;

            if (cooldown.has(message.author.id, command.name, command.cooldown)) {
                const time = cooldown.getTime(message.author.id, command.name, command.cooldown) as number;

                return this.cooldownMessage!(message, command, time);
            };

            if (command.cooldown) {
                cooldown.set(message.author.id, command.name, command.cooldown)
            };

            command.run(message, args);
        };
    };
};

export interface CommandHandlerOptions extends JinxHandlerOptions {
    prefix?: string | string[] | Function;
    allowBots?: boolean;
    allowClient?: boolean;
    allowDM?: boolean;
    allowMention?: boolean;
    defaultCooldown?: number;
    cooldownMessage?: (message: Message, command: Command, time: number) => void;
};