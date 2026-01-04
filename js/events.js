import { appState } from "./state.js";
import { renderApp } from "./render.js";
import { saveState } from "./persistence.js";

export function initWorkspaceEvents() {
    const workspaceTabsContainer = document.querySelector('.workspaceTabs');
    if (!workspaceTabsContainer) return;

    workspaceTabsContainer.addEventListener('click', (e) =>{
        const tab = e.target.closest('.workspace-tab');
        if (!tab) return;

        const workspaceId = tab.dataset.workspaceId;
        if (!workspaceId) return;
        
        if (workspaceId === appState.activeWorkspaceId) return;
        appState.activeWorkspaceId = workspaceId;
        saveState(appState);
        renderApp();
    })
}

export function initHamburgerEvent(){
    const hamburgerButton = document.querySelector('#hamburgerButton');
    const sidebar = document.querySelector('.sideBar');
    if(!hamburgerButton || !sidebar) return;

    hamburgerButton.addEventListener('click', ()=>{
        sidebar.classList.toggle('collapsed');
    })
}

export function initTaskEvents(){
const taskLists = document.querySelectorAll('.task-list');
if(!taskLists.length) return;
taskLists.forEach(taskList =>{
    taskList.addEventListener('click',(e)=>{
        if (!e.target.classList.contains('taskDeleteButton')) return;
        const task = e.target.closest('.task');
        if (!task) return;
        appState.tasks = appState.tasks.filter(t=> t.id !== task.dataset.id);
        saveState(appState);
        renderApp();
    })
})
}