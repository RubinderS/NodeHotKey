# NodeHotKey
This is an autohotkey like library. It can be used for 3 purposes:-
1. Make global Macros and assign hotkeys to trigger them.
2. Catch global keyboard/mouse events in your code.
3. Trigger keyboard/mouse events from your code.

# Usage

## import
import { NodeHotKey } from 'NodeHotKey';

## Initialize the object
<code>
let nhk = new NodeHotKey({});<br/>
</code>
Currently we are passing an empty object. A Macro Config object can be passed to the constructor in order to create autohotkey like macros.<br/>
Please refer the Macro section for this.

## Catch global Keyboard/Mouse events
<code>
nhk.startListening(); // start listening for keyboard and mouse events
<br/>
<br/>
nhk.on(nhk.eventTypes.keyReleased, (eventData: any) => {<br/>
    console.log('KeyReleased ', eventData.keyCode);<br/>
});<br/><br/>
nhk.on(nhk.eventTypes.keyPressed, (eventData: any) => {<br/>
    console.log('KeyPressed ', eventData.keyCode);<br/>
});<br/><br/>
nhk.on(nhk.eventTypes.mouseKeyReleased, (eventData: any) => {<br/>
    console.log('mouseKeyReleased ', eventData.keyCode);<br/>
});<br/><br/>
nhk.on(nhk.eventTypes.mouseKeyPressed, (eventData: any) => {<br/>
    console.log('mouseKeyPressed ', eventData.keyCode);<br/>
});<br/><br/>
nhk.on(nhk.eventTypes.macroTriggered, (eventData: any) => {<br/>
    console.log('macroTriggered ', eventData.macroName);<br/>
});<br/><br/>
nhk.on(nhk.eventTypes.hotstringTriggered, (eventData: any) => {<br/>
    console.log('hotstringTriggered ', eventData.macroName);<br/>
});<br/><br/>
nhk.stopListening();
</code>

## Marco
Macros are pre-defined steps that can be triggered by either pressing hotkeys or typing hotstrings. These can be defined in JSON format and can be triggered by hotkeys or hotstrings.
<br/><br/>
### A sample macro looks like this
<code>
let macroConfig = {<br/>
'Name of the Macro': {<br/>
		keys: [KC._CONTROL, KC._E],<br/>
		steps: [<br/>
			{ type: 'This Macro can be triggered by pressing CTRL+E\n' },<br/>
			{ type: "Wait for 3 secs then press ','  " },<br/>
			{ wait: 2000 },<br/>
			{ pressKey: KC._COMMA },<br/>
			{ releaseKey: KC._COMMA }<br/>
		]<br/>
	},<br/>
</code>

we can then pass this macroConfig to constructor of NodeHotKey like this:-<br/>
<code>
let nhk = new NodeHotKey(macroConfig);<br/>
nhk.startListening();
</code>
<br/>
More sample Marco configs can be found [github link]
## Trigger keyboard/mouse events
There are utility functions in the package which can be used to trigger keyboard/mouse events.<br/>
<code>
import { pressKey,releaseKey, KEYCODES as KC } from './NodeHotKey'; <br/>
<br/>
pressKey(KC._A);<br/>
releaseKey(KC._A);<br/>
<br/>
pressKey(KC._MOUSE_RIGHT);<br/>
releaseKey(KC._MOUSE_RIGHT);<br/>
</code>

## Putting it all togther
<br/>
<code>
import { NodeHotKey, pressKey,releaseKey, KEYCODES as KC } from './NodeHotKey';<br/>
<br/>
// press some keys <br/>
pressKey(KC._A);<br/>
releaseKey(KC._A);<br/>
<br/>
pressKey(KC._MOUSE_RIGHT);<br/>
releaseKey(KC._MOUSE_RIGHT);<br/>
<br/>
let macroConfig = {<br/>
'Name of the Macro': {<br/>
		keys: [KC._CONTROL, KC._E],<br/>
		steps: [<br/>
			{ type: 'This Macro can be triggered by pressing CTRL+E\n' },<br/>
			{ type: "Wait for 3 secs then press ','  " },<br/>
			{ wait: 2000 },<br/>
			{ pressKey: KC._COMMA },<br/>
			{ releaseKey: KC._COMMA }<br/>
		]<br/>
	},<br/>
<br/>
let nhk = new NodeHotKey(macroConfig);<br/>
<br/>
nhk.startListening();<br/>
<br/>
nhk.on(nhk.eventTypes.keyReleased, (eventData: any) => {<br/>
    console.log('KeyReleased ', eventData.keyCode);<br/>
});<br/>
<br/>
nhk.on(nhk.eventTypes.keyPressed, (eventData: any) => {<br/>
    console.log('KeyPressed ', eventData.keyCode);<br/>
});<br/>
<br/>
nhk.on(nhk.eventTypes.mouseKeyReleased, (eventData: any) => {<br/>
    console.log('mouseKeyReleased ', eventData.keyCode);<br/>
});<br/>
<br/>
nhk.on(nhk.eventTypes.mouseKeyPressed, (eventData: any) => {<br/>
    console.log('mouseKeyPressed ', eventData.keyCode);<br/>
});<br/>
<br/>
nhk.on(nhk.eventTypes.macroTriggered, (eventData: any) => {<br/>
    console.log('macroTriggered ', eventData.macroName);<br/>
});<br/>
<br/>
nhk.on(nhk.eventTypes.hotstringTriggered, (eventData: any) => {<br/>
    console.log('hotstringTriggered ', eventData.macroName);<br/>
});
<br/>
<br/>
// nhk.stopListening();
</code>
