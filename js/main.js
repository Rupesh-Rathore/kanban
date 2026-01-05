import { renderApp } from './render.js';
import { initWorkspaceEvents , initHamburgerEvent ,initTaskEvents } from './events.js';
import { appState } from "./state.js";
import { loadState, saveState } from "./persistence.js";


document.addEventListener('DOMContentLoaded', () => {

    //  Loading stored state
    const loadedState = loadState();
    Object.assign(appState, loadedState);

    //  Attach events

    initWorkspaceEvents();
    initHamburgerEvent();
    initTaskEvents();

    //  Render UI

    renderApp();
});