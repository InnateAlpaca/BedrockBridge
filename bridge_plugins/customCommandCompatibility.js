import { bridge } from '../addons';
/**
 * Custom commands compatibility - BedrockBridge addon
 * This addon will prevent messages with specific prefixes from being sent to discord. 
 * This is useful when you have another custom-command addon and you don't want command text being sent to discord chat.
 * 
 * by InnateAlpaca (https://github.com/InnateAlpaca)
 */

const ignore_prefixes = ["?"] 
// const ignore_prefixes = ["?", ".", "!"] // multiple prefixes are possible too. Feel free to edit it!

bridge.events.chatUpStream.subscribe(e=>{
    if (ignore_prefixes.includes(e.message.charAt(0))){
        e.cancel=true;
    }
})