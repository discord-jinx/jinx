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

    constructor (client: JinxClient, {
        directory,
        instance = Application,
        allowDM = false
    } = {} as ApplicationHandlerOptions) {
        super(client, {
            directory,
            instance
        });

        /**
         * Whether to allow commands on DM or not
         * @type {boolean}
         */
        this.allowDM = Boolean(allowDM);

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

             this.client.guilds.cache.get("942782748899307580")?.commands.set(commands);
        });
    };

    private async exec (i: MessageContextMenuInteraction | CommandInteraction | UserContextMenuInteraction, type: "chat" | "message" | "user") {
        if (this.allowDM !== true && i.channel?.type === "DM") return;

        const command = this.cache.get(`${type}-${i.commandName}`);

        if (!(await command.runBefore(i))) {
            return;
        };

        return command ? command.interact(i) : null;
    };
};

export interface ApplicationHandlerOptions {
    allowDM?: boolean;
    global?: boolean;
    guilds?: "all" | string[];
    directory: string;
    instance?: Function;
};