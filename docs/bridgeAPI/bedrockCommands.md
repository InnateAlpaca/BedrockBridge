# bedrockCommands Class

A class that provides command register system for BedrockBridge plugins.

## Methods
- [registerCommand](#registerCommand)

### **registerCommand**
`
registerCommand(name, callback, description): void
`

Register a command that can be run with the standard bridge prefix.

#### **Parameters**
- **name**: *string*
- **callback**: *(player: Player, ...params: commandArgument[])=>void* callback called on command run.
- **description**: *string* add a description that will be shown when players run "help" command.