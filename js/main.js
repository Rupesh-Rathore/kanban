import { renderApp } from './render.js';
import {
    initWorkspaceEvents,
    initHamburgerEvent,
    initTaskEvents,
    initAddTaskModalEvents,
    initAddWorkspaceModalEvents
} from './events.js';

import { appState } from "./state.js";
import { loadState, saveState } from "./persistence.js";


document.addEventListener('DOMContentLoaded', () => {

    // 1. Load state
    const loadedState = loadState();
    Object.assign(appState, loadedState);

    // 2. Attach ALL event handlers
    initWorkspaceEvents();
    initHamburgerEvent();
    initTaskEvents();
    initAddTaskModalEvents();
    initAddWorkspaceModalEvents();

    // 3. Render UI
    renderApp();
});
