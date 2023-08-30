/**
 * Basic Nicer Chat
 * 
 * This bridge-addon provides BedrockBRidge with better message parsing between discord and bedrock. 
 * It will translate message formatting codes as much as possible, handle roles, channels, users, emojis...
 */
import { bridge } from '../addons';

bridge.events.bridgeInitialize.subscribe(e=>{
    // This request is needed to retrieve discord role names, otherwise they won't be sent.
    e.registerAddition("discord_roles");
})

bridge.events.chatDownStream.subscribe(e=>{
    if (e.roles[0])
        e.author += ` - ${e.roles[0]}`
    e.message = '§r'+e.message.toBedrock();
    //string.toBedrock is a custom function that handles everything is needed
})

bridge.events.chatUpStream.subscribe(e=>{
    e.message = '§r'+e.message.toDiscord();
})