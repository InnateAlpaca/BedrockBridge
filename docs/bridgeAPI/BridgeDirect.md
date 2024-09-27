# BridgeDirect Class

A class that provides direct connection capabilities to bridge-plugins. Through this class you can send messages to discord anytime.

> [!Warning] This class instances will work only if BedrockBridge's bridgeDirect capabilities have been enabled through the bridgeInitializeEvent.

## Properties

### **ready**
`read-only ready: boolean;`

True if BedrockBridge has been enabled for bridgeDirect and is currently possible to send messages.

Type: boolean

### **events**
`read-only ready: BridgeDirectEvents;`

Events available for bridgeDirect.

Type: BridgeDirectEvents

## Methods
- [sendMessage](#sendMessage)
- [sendEmbed](#sendEmbed)

### **sendMessage**
`
sendMessage(message, author, picture): void
`

Sends a message to discord, if bridgeDirect is ready. Otherwise it will throw an Error.

#### **Parameters**
- **message**: *string* message to be sent to discord
- **author**: *string* display name of the discord message
- **picture**: *string* url to a picture to be displayed as profile picture of the message.

### **sendEmbed**
`
sendEmbed(embed, author, picture): void
`

Sends an embed to discord.

#### **Parameters**
- **embed**: *EmbedObject* embed object according to the [discord definition](https://discord.com/developers/docs/resources/message#embed-object).
- **author**: *string* display name of the discord message
- **picture**: *string* url to a picture to be displayed as profile picture of the message.

## Example
First the bridge-plugin must enable to bridgeDirect capabilities

```js
import { bridge, bridgeDirect } from "../addons";
bridge.events.bridgeInitialize.subscribe(e=>{
    e.registerAddition("discord_direct"); //enabling direct messages
})

```
Then the plugin can implement some logic.
```js
import { world } from "@minecraft/server"

world.afterEvents.itemUse.subscribe(e=>{
    if (e.itemStack.nameTag==="legendary-item"){

        if (bridgeDirect.ready){ // making sure that the bridge is active
            bridgeDirect.sendMessage(e.source.name + " used a legendary item", "Legendary News")
        }
    }
})
```