/**
 * Basic Nicer Chat - BedrockBridge addon @version 1.1.0
 * 
 * This bridge-addon provides BedrockBridge with better message parsing between discord and bedrock. 
 * It will translate message formatting codes as much as possible, handle roles, channels, users, emojis...
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 */
import { world } from '@minecraft/server';
import { bridge } from '../addons';

const modes = {
    nickname: "nickname",
    name: "name",
    dcName: "dcName"
}

var show_mode = world.getDynamicProperty("esploratori:nicerchat:show_mode")??modes.nickname

bridge.events.chatDownStream.subscribe(e=>{
    e.message = '§r'+(e.mention?"Reply: ":"")+e.message.toBedrock(); //string.toBedrock is a custom function that handles everything is needed
})

bridge.events.chatUpStream.subscribe((e, sender)=>{
    // Parse bedrock string to discord string so to adapt formatting of the message
    e.message = e.message.toDiscord();
    e.message = e.message.replace("@everyone", "`@everyone`")
    e.message = e.message.replace("@here", "`@here`")
    
    switch (show_mode) {
        case modes.nickname: 
            e.author = sender.nameTag.toDiscord(); //let's parse
            break;
        case modes.name:
            e.author = sender.name.toDiscord(); //let's parse
            break;
        case modes.dcName:
            e.author = (sender.dcNametag??sender.name).toDiscord(); //let's parse
            break;
    }
})

bridge.bedrockCommands.registerAdminCommand("changeChatNameMode", (player, mode)=>{
    if (mode?.toString() in modes){
        show_mode=mode.toString();
        world.setDynamicProperty("esploratori:nicerchat:show_mode", mode.toString())
        player.sendMessage("§eChat mode changed to "+mode)
    }
    else {
        player.sendMessage(`§cMode not supported, please use one of: '${Object.values(modes).join("', '") }'. Usage: changeChatNameMode <mode>`)
    }
}, "Change what name is shown in discord chat: 'name', 'nickname' or 'dcName'")