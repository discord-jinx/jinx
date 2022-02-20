import { JinxClient, JinxError, JinxHandler, JinxHandlerOptions } from "../..";
import { Event } from "..";

/**
 * Handles and loads the events
 * @param {JinxClient} client - The Jinx client
 * @param {JinxHandlerOptions} options - The options for the handler
 * @extends {JinxHandler}
 */
export class EventHandler extends JinxHandler {
    constructor(client: JinxClient, {
        directory = null,
        instance = Event
    } = {} as JinxHandlerOptions) {
        if (!directory) throw new JinxError("NO_DIRECTORY", "events");
        super(client, { directory, instance });
    };

    public load(filepath: string) {
        this.client.util.getModule(filepath, this);

        return this.setup();
    };

    private setup() {
        const events = this.client.util.getAllCollectionKeys(this.cache);

        for (let i = 0; i < events.length; i++) {
            const event = this.cache.get(events[i]) as Event;

            if (event.name) {
                this.client[event.once ? "once" : "on"](
                    event.name,
                    (...args) => event.run(...args)
                );
            };
        };
    };
};