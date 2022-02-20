import { JinxClient, JinxError, JinxHandler } from "..";

export class JinxModule {
    public client!: JinxClient;
    public handler!: JinxHandler;
    public path!: string;
    public readonly id: string;

    constructor (type: string, options: JinxModuleOptions) {

        const { name = null } = typeof options === "object" ? options : {} as JinxModuleOptions;
        
        if (!name) throw new JinxError("NO_MODULE_NAME");

        /**
         * The id of the module
         * @type {string}
         */
        this.id = `${type}-${name}`;

        
        if ("handler" in this) {
            this.handler.cache.set(this.id, this);
        };
    };

    /**
     * Reloads the module
     * @param {string} id - The id of the module
     * @returns {boolean} boolean
     */
    public reload (id = this.id) {
        return this.handler.reload(id);
    };

    /**
     * Removes the module
     * @param {string} id - The id of the module
     * @returns {boolean} boolean
     */
    public remove (id = this.id) {
        return this.handler.remove(id);
    };
};

export interface JinxModuleOptions {
    name: string;
};