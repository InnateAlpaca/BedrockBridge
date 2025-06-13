import { CustomCommandStatus, CommandPermissionLevel, CustomCommandRegistry, CustomCommandSource, CustomCommandParamType, CustomCommandOrigin } from "@minecraft/server"

class GameCommandManager {
    /**@type {Map<string, ()=>CustomCommandStatus|undefined>} */
    #callbacks = new Map();
    #namespace = "esploratori:"

    /**Slash commands to registration to be run in start mode. @param {CustomCommandRegistry} registry*/
    registerCommands(registry){
        // const callbacks = this.#callbacks;
        registry.registerCommand({
            name: this.#namespace+"connect",
            description: "Start connection to BedrockBridge",
            permissionLevel: CommandPermissionLevel.GameDirectors
        }, (origin) => {
            const callback = this.#callbacks.get("connect");
            return {...callback(origin)};
        })

        registry.registerCommand({
            name: this.#namespace + "messages",
            description: "List error messages received from BedrockBridge",
            permissionLevel: CommandPermissionLevel.GameDirectors
        }, (origin) => {
            const callback = this.#callbacks.get("messages");
            return {...callback(origin)};
        })

        registry.registerCommand({
            name: this.#namespace + "status",
            description: "Current status of the discord connection",
            permissionLevel: CommandPermissionLevel.GameDirectors
        }, (origin) => {
            const callback = this.#callbacks.get("status");
            return { ...callback(origin)}
        })

        registry.registerCommand({
            name: this.#namespace + "logging",
            description: "Enables (or disables) error logging on console",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [
                { 
                    name: "enabled",
                    type: CustomCommandParamType.Boolean
                }
            ]
        }, (origin, value) => {
            const callback = this.#callbacks.get("logging");
            return {...callback(origin, value)};
        })

        registry.registerCommand({
            name: this.#namespace + "linkdc",
            description: "Make your streamed chat from mc look like your discord messages (on discord)",
            permissionLevel: CommandPermissionLevel.Any
        }, (origin) => {   
            if (origin.sourceType !== CustomCommandSource.Entity){
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Only players can run this command"
                }
            }
            const callback = this.#callbacks.get("linkdc");
            return {...callback(origin)};
        })

        registry.registerCommand({
            name: this.#namespace + "unlink",
            description: "Reset your streamed picture and nametag to your xbox account (requires relog)",
            permissionLevel: CommandPermissionLevel.GameDirectors
        }, (origin) => {
            if (origin.sourceType !== CustomCommandSource.Any) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Only players can run this command"
                }
            }
            const callback = this.#callbacks.get("unlink");
            return {...callback(origin)};
        })

        registry.registerCommand({
            name: this.#namespace + "deaf",
            description: "Stop messages from discord from being visualised on your screen",
            permissionLevel: CommandPermissionLevel.GameDirectors
        }, (origin) => {
            if (origin.sourceType !== CustomCommandSource.Entity) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Only players can run this command"
                }
            }
            const callback = this.#callbacks.get("deaf");
            return {...callback(origin)};
        })

        registry.registerCommand({
            name: this.#namespace + "undeaf",
            description: "Resume discord-message show on your screen",
            permissionLevel: CommandPermissionLevel.GameDirectors
        }, (origin) => {
            if (origin.sourceType !== CustomCommandSource.Entity) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Only players can run this command"
                }
            }
            const callback = this.#callbacks.get("undeaf");
            return {...callback(origin)};
        })

        registry.registerCommand({
            name: this.#namespace + "listpartners",
            description: "List external servers you can transfer to",
            permissionLevel: CommandPermissionLevel.Any
        }, (origin) => {
            const callback = this.#callbacks.get("listpartners");
            return {...callback(origin)};
        })

        registry.registerCommand({
            name: this.#namespace + "transfer",
            description: "Teleport to a different server",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [
                { 
                    name: "target",
                    type: CustomCommandParamType.String
                }
            ]
        }, (origin, target) => {
            if (origin.sourceType !== CustomCommandSource.Entity) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Only players can run this command"
                }
            }
            const callback = this.#callbacks.get("transfer");
            return {...callback(origin, target)};
        })

        registry.registerCommand({
            name: this.#namespace + "plugins",
                description: "Open the plugin manager",
                permissionLevel: CommandPermissionLevel.GameDirectors
            }, origin=>{
            if (origin.sourceType !== CustomCommandSource.Entity) {
                return {
                    status: CustomCommandStatus.Failure,
                    message: "Only players can run this command"
                }
            }            
            const callback = this.#callbacks.get("plugins");
            callback(origin)
            })
    }
    /**
     * Set the callback for a command
     * @param {string} name 
     * @param {(origin: CustomCommandOrigin, ...params: Any[])=>CustomCommandStatus|undefined} callback 
     */
    setCallback(name, callback){
        this.#callbacks.set(name, callback);
    }
    /**Executes a command callback for a certain command.*/
    run(name, ...params){
        const callback = this.#callbacks.get(name)
        return callback(...params);
    }
}

export const gameCommandManager = new GameCommandManager();

 /**
 * Function used to automate sending async command replies
 * @param {CustomCommandOrigin} origin 
 * @param {CustomCommandResult} result 
 */
export function replyOrigin(origin, result){
    switch (origin.sourceType) {
        case CustomCommandSource.Entity:
            if (origin.sourceEntity.typeId === 'minecraft:player'){
                const prefix = result.status === CustomCommandStatus.Success ? "§e" : "§c";
                origin.sourceEntity.sendMessage(prefix + result.message);
            }
            break;
        case CustomCommandSource.Server: {
            if (result.status === CustomCommandStatus.Success) {
                console.info(result.message)
            }
            else {
                console.error(result.message)
            }
        }
    }
}