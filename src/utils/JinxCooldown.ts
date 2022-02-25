import { Collection } from "discord.js";

export class JinxCooldown {
    public cache = new Collection<string, Collection<string, number>>();

    constructor () {};

    /**
     * Set a user to the cooldown
     * @param {string} user - The id of the user
     * @param {string} commandName - The name of the Command
     * @param {number} cooldown - The cooldown of the Command
     */
    public set (userId: string, commandName: string, cooldown: number): void {
        if (!userId || !commandName) return;

        if (!this.cache.get(commandName)) {
            this.cache.set(commandName, new Collection());
        };

        const command = this.cache.get(commandName);
        
        command?.set(userId, Date.now());
        setTimeout(() => {
            command?.delete(userId);
        }, cooldown);
    };

    
    /**
     * Delete a user from the cooldown
     * @param {string} userId - The id of the user
     * @param {string} commandName - The name of the command
     * @returns {boolean} boolean
     */
    public delete (userId: string, commandName: string): boolean {
        const command = this.cache.get(commandName);
        
        if (command && command.get(userId)) {
            return command.delete(userId);
        } else {
            return false;
        };
    };

    /**
     * Whether the user is in cooldown
     * @param {string} userId - The id of the user
     * @param {string} commandName - The name of the command
     * @param {number} cooldown - The cooldown of the command
     * @returns {boolean} boolean
     */
    public has (userId: string, commandName: string, cooldown: number): boolean {
        const command = this.cache.get(commandName);

        if (command && command.has(userId)) {
            const time = command.get(userId)! + cooldown;

            if (Date.now() < time) {
                return true;
            };
        };

        return false;
    };

    /**
     * The remaining cooldown time of the user
     * @param {string} userId - The id of the user
     * @param {string} commandName - The name of the command
     * @param {number} cooldown - The cooldown of the command
     */
    public getTime (userId: string, commandName: string, cooldown: number): number | null {
        const command = this.cache.get(commandName);
        
        if (command) {
            const get = command.get(userId)! + cooldown;

            if (get) {
                const time = (get - Date.now()) / 1000;
                
                return time;
            };
        };

        return null;
    };
};