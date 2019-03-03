![GitHub](https://img.shields.io/github/license/Rubinder25/NodeHotKey.svg?style=flat-square)
![GitHub package.json version](https://img.shields.io/github/package-json/v/Rubinder25/NodeHotKey.svg?style=flat-square)
# NodeHotKey
https://github.com/Rubinder25/NodeHotKey  
https://www.npmjs.com/package/nodehotkey  
This is an autohotkey like library. It can be used for 3 purposes:-
1. Make global Macros and assign hotkeys to trigger them.
2. Catch global keyboard/mouse events in your code.
3. Trigger keyboard/mouse events from your code.
# Usage
## Install
`npm install nodehotkey --save`
follow this page to install dependencies for robot-js on your platform: http://getrobot.net/docs/usage.html
## import
`import { NodeHotKey } from 'NodeHotKey';`
## Initialize the object
```javascript
let nhk = new NodeHotKey({});
```
Currently we are passing an empty object. A Macro Config object can be passed to the constructor in order to create autohotkey like macros.
Please refer the Macro section for this.
## Catch global Keyboard/Mouse events
```javascript
nhk.startListening(); // start listening for keyboard and mouse events

nhk.on(nhk.eventTypes.keyReleased, (eventData: any) => {
    console.log('KeyReleased ', eventData.keyCode);
});

nhk.on(nhk.eventTypes.keyPressed, (eventData: any) => {
    console.log('KeyPressed ', eventData.keyCode);
});

nhk.on(nhk.eventTypes.mouseKeyReleased, (eventData: any) => {
    console.log('mouseKeyReleased ', eventData.keyCode);
});

nhk.on(nhk.eventTypes.mouseKeyPressed, (eventData: any) => {
    console.log('mouseKeyPressed ', eventData.keyCode);
});

nhk.on(nhk.eventTypes.macroTriggered, (eventData: any) => {
    console.log('macroTriggered ', eventData.macroName);
});

nhk.on(nhk.eventTypes.hotstringTriggered, (eventData: any) => {
    console.log('hotstringTriggered ', eventData.macroName);
});

nhk.stopListening();
```
## Marco
Macros are pre-defined steps that can be triggered by either pressing hotkeys or typing hotstrings. These can be defined in JSON format and can be triggered by hotkeys or hotstrings.
### A sample macro looks like this
```javascript
let macroConfig = {
'Name of the Macro': {
		keys: [KC._CONTROL, KC._E],
		steps: [
			{ type: 'This Macro can be triggered by pressing CTRL+E\n' },
			{ type: "Wait for 3 secs then press ','  " },
			{ wait: 2000 },
			{ pressKey: KC._COMMA },
			{ releaseKey: KC._COMMA }
		]
	},
```
we can then pass this macroConfig to constructor of NodeHotKey like this:-
```javascript
let nhk = new NodeHotKey(macroConfig);
nhk.startListening();
```

More sample Marco configs can be found [github link]
## Trigger keyboard/mouse events
There are utility functions in the package which can be used to trigger keyboard/mouse events.
```javascript
import { pressKey,releaseKey, KEYCODES as KC } from './NodeHotKey'; 

pressKey(KC._A);
releaseKey(KC._A);

pressKey(KC._MOUSE_RIGHT);
releaseKey(KC._MOUSE_RIGHT);
```
## Putting it all togther

```javascript
import { NodeHotKey, pressKey,releaseKey, KEYCODES as KC } from './NodeHotKey';

// press some keys 
pressKey(KC._A);
releaseKey(KC._A);

pressKey(KC._MOUSE_RIGHT);
releaseKey(KC._MOUSE_RIGHT);

let macroConfig = {
'Name of the Macro': {
		keys: [KC._CONTROL, KC._E],
		steps: [
			{ type: 'This Macro can be triggered by pressing CTRL+E\n' },
			{ type: "Wait for 3 secs then press ','  " },
			{ wait: 2000 },
			{ pressKey: KC._COMMA },
			{ releaseKey: KC._COMMA }
		]
	},

let nhk = new NodeHotKey(macroConfig);

nhk.startListening();

nhk.on(nhk.eventTypes.keyReleased, (eventData: any) => {
    console.log('KeyReleased ', eventData.keyCode);
});

nhk.on(nhk.eventTypes.keyPressed, (eventData: any) => {
    console.log('KeyPressed ', eventData.keyCode);
});

nhk.on(nhk.eventTypes.mouseKeyReleased, (eventData: any) => {
    console.log('mouseKeyReleased ', eventData.keyCode);
});

nhk.on(nhk.eventTypes.mouseKeyPressed, (eventData: any) => {
    console.log('mouseKeyPressed ', eventData.keyCode);
});

nhk.on(nhk.eventTypes.macroTriggered, (eventData: any) => {
    console.log('macroTriggered ', eventData.macroName);
});

nhk.on(nhk.eventTypes.hotstringTriggered, (eventData: any) => {
    console.log('hotstringTriggered ', eventData.macroName);
});


// nhk.stopListening();
```
## Sample Project
This is a sample project built using NodeHotKey package:-
https://github.com/Rubinder25/SampleProject_using_NodeHotKey
