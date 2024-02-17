# alt:V Angular
This repository is a basic boilerplate for getting started with Angular in alt:V Multiplayer. It contains several helpful features and was generated with the Angular CLI. The project was setup using SCSS as stylesheet format, it is for both browser and in-game based development workflow.

// image here
![altV Angular](https://i.imgur.com/wB1ha8I.png "altV Angular")

## Getting started
Clone the repository and use `npm install`, after installing the packages use:

- `ng serve` for development mode, it's going to watch the files and build the application upon changes. You can create the alt:V browser on the generated address.
- `ng build` to build the angular project.

### Installation
1. When the player is connecting on server-side, emit an event to client-side and on client-side create the the view.on events.

The **view.on** events are the events called from the UI using **sendClient**.

Example:

```js
import * as alt from 'alt-client';

export let view = new alt.WebView('http://localhost:4200/');
view.focus();

alt.onServer("initializeBrowser", () => {
    view.on('SEND_TO_SERVER', (eventName, ...args) => {
        alt.emitServer(eventName, ...args)
    })

    view.on('onBrowserLoaded', () => {
        alt.log('The browser loaded succesfully.');  
    })
});
```

2. You're all done! If you did everything mentioned up correctly, you should have an alt:V + Angular project running with no problems.