# commandArgument Class

## Extends
- [*string*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)


Represents an argument passed to a prefix command.


## Methods
- [readNumber](#readNumber)
- [readInteger](#readInteger)
- [readBoolean](#readBoolean)
- [readPlayer](#readPlayer)
- [readLocation](#readLocation)

### **readNumber**
`
readNumber(): number
`

Returns the command argument as string.
#### **Returns** *number*

### **readInteger**
`
readInteger(): number
`
Returns the command argument as integer.
#### **Returns** *number*

### **readBoolean**
`
readBoolean(): boolean
`

Returns the command argument as boolean.

#### **Returns** *boolean*


### **readPlayer**
`
readPlayer(): Player | undefined
`

Returns a player object whose name is the current argument.

#### **Returns** [*Player*](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/player) | *undefined*

### **readLocation**
`
readLocation(): Vector
`
Returns a location. Notice: this only works if the paramter was passed as single paramter with quotes e.g. "12 32 54".

#### **Returns** [*Vector*](https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/vector)

> [!WARNING]
> This function can throw errors.