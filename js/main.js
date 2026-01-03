import { renderApp } from './render.js';
import { initWorkspaceEvents , initHamburgerEvent ,initTaskEvents } from './events.js';

document.addEventListener('DOMContentLoaded', () => {
    initWorkspaceEvents();
    initHamburgerEvent();
    initTaskEvents();
    renderApp();
});
