/**
 * basicNoPing v1.0.0
 * This bridge-addon will prevent your players from sending "pinging" '@everyone' messages
 */

import { bridge } from "../addons";

bridge.events.chatUpStream.subscribe(data=>{
    data.message=data.message.replace("@everyone", "\\@everyone");
    data.message=data.message.replace("@here", "\\@here");
})