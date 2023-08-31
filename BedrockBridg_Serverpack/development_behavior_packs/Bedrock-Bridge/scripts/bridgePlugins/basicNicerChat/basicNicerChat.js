/**
 * Basic Nicer Chat
 * 
 * This bridge-addon provides BedrockBRidge with better message parsing between discord and bedrock. 
 * It will translate message formatting codes as much as possible, handle roles, channels, users, emojis...
 */
import { bridge } from '../../addons';

// bridge.events.bridgeInitialize.subscribe(e=>{
//     // This request is needed to retrieve discord role names, otherwise they won't be sent.
//     e.registerAddition("discord_roles");
// })

bridge.events.chatDownStream.subscribe(e=>{
    // if (e.roles[0]) // if the player has a role
    //     e.author += ` - ${e.roles[0]}` //show the highest role
    e.message = '§r'+e.message.toBedrock(); //string.toBedrock is a custom function that handles everything is needed
})

bridge.events.chatUpStream.subscribe((e, sender)=>{
    // Parse bedrock string to discord string so to adapt formatting of the message
    e.message = e.message.toDiscord();
    
    // // Sometimes you may want to visualise nametag, without all string formatting though. If so you can use the following code
    // e.author = sender.nameTag.toDiscord(); //let's parse

    // // Or yet you may want to use the discord nametag for players who have connected it. In this case you may do instead
    // e.author = sender.dcNametag??sender.name; // not all players will have the dcNametag, we need to use name for those who don't have it.
})