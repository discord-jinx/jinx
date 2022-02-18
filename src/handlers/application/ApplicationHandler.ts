import { 
    CommandInteraction, 
    MessageContextMenuInteraction, 
    UserContextMenuInteraction 
} from "discord.js";
import { Application } from "..";
import { JinxClient, JinxHandler } from "../..";

export class ApplicationHandler extends JinxHandler {
    public client!: JinxClient;
    public allowDM: boolean;
    public global: boolean;
    public guilds: string | string[];

    constructor (client: JinxClient, {
        directory,
        instance = Application,
        allowDM = false,
        global = true,
        guilds = "all"
    } = {} as ApplicationHandlerOptions) {
        super(client, {
            directory,
            instance
        });

        /**
         * Whether to allow commands on DM
         * @type {boolean}
         */
        this.allowDM = Boolean(allowDM);

        /**
         * Whether to register the commands globally
         * @type {boolean}
         */
        this.global = Boolean(global);

        /**
         * The guilds to register the commands.
         * @type {"all" | string[]}
         * default to "all"
         */
        this.guilds = guilds;

        this.setup();
    };

    private setup (): void {
        this.client.once("ready", () => {
            this.client.on("interactionCreate", (i) => {

                if (i.isCommand()) {
                    return this.exec(i, "chat");
                };

                if (i.isMessageContextMenu()) {
                    return this.exec(i, "message");
                };

                if (i.isUserContextMenu()) {
                    return this.exec(i, "user");
                };

            });

            const commands: any[] = [];

             this.cache.forEach(app => {
                 commands.push(app);
             });

             if (this.global) {
                 this.client.application?.commands.set(commands);
             };

             if (typeof (this.guilds) === "string" && this.guilds === "all") {
                this.client.guilds.cache.forEach(async guild => {
                    await guild.commands.set(commands).catch(() => {});
                });
             } else if (Array.isArray(this.guilds)) {
                this.guilds.forEach(async id => {
                    const guild = this.client.guilds.cache.get(id);

                    if (guild) await guild.commands.set(commands).catch(() => {});
                });
             };
        });
    };

    private async exec (i: MessageContextMenuInteraction | CommandInteraction | UserContextMenuInteraction, type: "chat" | "message" | "user") {
        const command = this.cache.get(`${type}-${i.commandName}`) as Application;

        if (command) {
            if (!(await command.runBefore(i))) {
                return;
            };
            
            if (!command.allowDM && !i.inGuild()) return;
    
            if (command.onlyChannel && !this.client.util.checkChannel(command.onlyChannel, i.channelId)) return;
            if (command.onlyUser && !this.client.util.hasUser(command.onlyUser, i.user.id)) return;
    
            command ? command.interact(i) : null;
        } else return;
    };
};

export interface ApplicationHandlerOptions {
    allowDM?: boolean;
    global?: boolean;
    guilds?: "all" | string[];
    directory: string;
    instance?: Function;
};