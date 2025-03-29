import { system, world } from "@minecraft/server";

class bridgeEvent {
    constructor(event_name) {
        this.name = event_name;
    }
    subscribe(callback) {
        this.#callbacks.set(callback, callback)
        return callback;
    }
    unsubscribe(callback) {
        this.#callbacks.delete(callback)
    }
    /**@private*/
    async emit(params, ...args) {
        for (const callback of this.#callbacks.values()) {
            try {
                await callback(params, ...args);
            }
            catch (err) {
                console.error(`bridge-plugin error for ${this.name} event:\n${err}`)
            }
        }
        return params;
    }
    #callbacks = new Map();
}

/**
 * This class provides an interface for plugins to send custom messages to discord, anytime.
 * The class si independent from the pack and can be used in any other pack, as long as BedrockBridge is installed for the world.
 */
class BridgeDirect {
    #ready = false
    constructor() {
        system.afterEvents.scriptEventReceive.subscribe(e => {
            if (e.id === "discord:ready") {
                this.#ready = true;
                this.events.directInitialize.emit()
            }
        })
    }
    /**Returns true if the connection is ready and messages can be sent to discord*/
    get ready() {
        return this.#ready;
    }
    /**
     * Send a message to discord
     * @throws {Error} throws if the initialize event hasn't been fired yet
     * @param {string} message body of the message
     * @param {string?} author title of the message
     * @param {string?} picture url to a picture to be displayed as discord pfp for the message
     */
    sendMessage(message, author, picture) {
        if (this.#ready) {
            // system.scriptEventReceive
            system.sendScriptEvent("discord:message", JSON.stringify({ message: message, author: author, picture: picture ?? "https://i.imgur.com/9y8IvBG.png" }))
        }
        else throw new Error("BridgeDirect: you cannot send a message while the bridge is not ready")
    }
    /**
     * Send a custom embed to discord.
     * @param {Object} embed embed object, according to discord API
     * @param {string?} author title of the message
     * @param {string?} picture url to a picture to be displayed as discord pfp for the message
     */
    sendEmbed(embed, author, picture) {
        if (this.#ready)
            system.sendScriptEvent("discord:embed", JSON.stringify({
                author: author,
                embed: embed,
                picture: picture
            }))
        else throw new Error("BridgeDirect: you cannot send an embed while the bridge is not ready")
    }
    events = {
        /**Event fired when the connection is ready and messages can be sent to discord.*/
        directInitialize: new bridgeEvent("directInitialize")
    }
}

export const bridgeDirect = new BridgeDirect();