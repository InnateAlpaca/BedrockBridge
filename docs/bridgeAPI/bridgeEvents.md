# bridgeEvents Class

Contains a set of events that are available for bridge addons.

## Properties

### **bridgeInitialize**
`read-only bridgeInitialize: bridgeInitializeEventSignal;`

This event fires every time someone sends a message on mc chat, you can edit how it will appear on discord chat.

Type: [*bridgeInitializeEventSignal*]

### **chatUpStream**
`read-only buttonPush: chatUpStreamEventSignal;`

This event fires every time someone sends a message on mc chat, you can edit how it will appear on discord chat.

Type: [*chatUpStreamEventSignal*]

### **chatSend**
`read-only chatSend: ChatSendAfterEventSignal;`

This event is triggered after a chat message has been broadcast or sent to players.

Type: [*ChatSendAfterEventSignal*](ChatSendAfterEventSignal.md)

> [!CAUTION]
> This property is still in pre-release.  Its signature may change or it may be removed in future releases.

### **chatDownStream**
`read-only chatDownStream: chatDownStreamEventSignal;`

This event fires every time someone sends a message on discord chat, you can edit how it will appear on bedrock chat.

Type: [*chatDownStream*]

### **playerJoinLog**
`read-only playerJoinLog: playerJoinLogEventSignal;`

This event fires every time a player joins the server.

Type: [*playerJoinLogEventSignal*]

### **playerLeaveLog**
`read-only playerLeaveLog: playerLeaveLogEventSignal;`

This event fires every time a player leaves the server.

Type: [*playerLeaveLogEventSignal*]

### **playerDieLog**
`read-only playerDieLog: playerDieLogEventSignal;`

This event fires when a player dies.

Type: [*playerDieLogEventSignal*]

### **petDieLog**
`read-only petDieLog: petDieLogEventSignal;`

This event fires when someone's pet dies.

Type: [*petDieLogEventSignal*]