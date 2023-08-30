# WorldBridge Class

A class that contains all useful tools for BedrockBridge

## Properties

### **discordCommands**
`read-only discordCommands: bridgeCommands;`

Contains a set of events that are applicable to the entirety of the world.  Event callbacks are called in a deferred manner. Event callbacks are executed in read-write mode.

Type: [*bridgeCommands*](bridgeCommands.md)

### **events**
`read-only events: bridgeEvents;`

Contains a set of events that change BedrockBridge's behaviour.

Type: [*bridgeEvents*](bridgeEvents.md)

### **bedrockCommands**
`read-only bedrockCommands: bedrockCommands;`

Command handler for bedrockbridge.

Type: [*bedrockCommands*](bedrockCommands.md)