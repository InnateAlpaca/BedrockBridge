import { bridge } from "../addons";

bridge.events.chatUpStream.subscribe(data=>{
    data.message=data.message.replace("@everyone", "\\@everyone");
    data.message=data.message.replace("@here", "\\@here");
})