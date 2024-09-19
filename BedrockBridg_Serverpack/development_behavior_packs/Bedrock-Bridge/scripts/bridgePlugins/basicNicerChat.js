/**
 * Basic Nicer Chat @version 1.0.1 - BedrockBridge addon
 * 
 * This bridge-addon provides BedrockBridge with better message parsing between discord and bedrock. 
 * It will translate message formatting codes as much as possible, handle roles, channels, users, emojis...
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 */
import { bridge } from '../addons';

bridge.events.chatDownStream.subscribe(e=>{
    e.message = '§r'+(e.mention?"Reply: ":"")+e.message.toBedrock(); //string.toBedrock is a custom function that handles everything is needed
})

bridge.events.chatUpStream.subscribe((e, sender)=>{
    // Parse bedrock string to discord string so to adapt formatting of the message
    e.message = e.message.toDiscord();
    e.message = e.message.replace("@everyone", "`@everyone`")
    e.message = e.message.replace("@here", "`@here`")
    // // Sometimes you may want to visualise nametag, without all string formatting though. If so you can use the following code
    // e.author = sender.nameTag.toDiscord(); //let's parse

    // // Or yet you may want to use the discord nametag for players who have connected it. In this case you may do instead
    // e.author = sender.dcNametag??sender.name; // not all players will have the dcNametag, we need to use name for those who don't have it.
})