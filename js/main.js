import { renderApp } from './render.js';
import { initWorkspaceEvents , initHamburgerEvent ,initTaskEvents } from './events.js';
import { appState } from "./state.js";
import { loadState } from "./persistence.js";


document.addEventListener('DOMContentLoaded', () => {

    //  Loading stored state
    appState = loadState();

    //  Attach events

    initWorkspaceEvents();
    initHamburgerEvent();
    initTaskEvents();

    //  Render UI

    renderApp();
});
