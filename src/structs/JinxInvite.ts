import { BotURL } from "dbotlinkgen";
import { JinxClient } from "..";

export class JinxInvite extends BotURL {
    constructor (client: JinxClient) {
        super();

        if (client) {
            this.setClient(client.user?.id as string);
        };

        this.setScopes(["bot", "applicationsCommands"]);
    };
};