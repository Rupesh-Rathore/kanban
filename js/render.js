import { appState } from "./state.js";

export function renderWorkspaceTitle(){
    if (!appState.activeWorkspaceId) return;
    const workspaceTitle = appState.workspaces.find(ws =>ws.id === appState.activeWorkspaceId);

    if (!workspaceTitle) return;

    const workspaceTitleElement = document.querySelector('#workspaceTitle');
    workspaceTitleElement.textContent = workspaceTitle.name;
}

export function renderWorkspaceTabs() {
    const workspaceTabsContainer = document.querySelector('.workspaceTabs');
    if (!workspaceTabsContainer) return;

    workspaceTabsContainer.innerHTML = '';

    appState.workspaces.forEach(ws =>{
        const tabElement = document.createElement('div');
        const nameElement = document.createElement('h2');
        const deleteElement = document.createElement('button');

        const isLastWorkspace = appState.workspaces.length === 1;

        nameElement.textContent = ws.name;
        nameElement.classList.add('workspace-name');

        deleteElement.innerHTML = '<img src="assets/svgs/delete.svg" alt="deleteTab">';
        deleteElement.classList.add('workspace-delete');
        deleteElement.setAttribute('data-workspace-id', ws.id);
        deleteElement.setAttribute('aria-label', 'Delete workspace');

        deleteElement.disabled = isLastWorkspace;
        deleteElement.title = isLastWorkspace ? 'At least one workspace is required' : 'Delete workpace';

        if(isLastWorkspace){
            deleteElement.classList.add('disabled');
        }

        tabElement.appendChild(nameElement);
        tabElement.appendChild(deleteElement);

        tabElement.classList.add('workspace-tab');
        tabElement.setAttribute('data-workspace-id', ws.id);

        if(ws.id === appState.activeWorkspaceId){
            tabElement.classList.add('active');
        }

        workspaceTabsContainer.appendChild(tabElement);
    })
}

export function renderTasks() {
    if (!appState.activeWorkspaceId) return;
    const tasks = appState.tasks.filter(task => task.workspaceId === appState.activeWorkspaceId);

    document.querySelectorAll('.task-list').forEach(list =>{
        list.innerHTML = '';
    });

    tasks.forEach(task =>{
        const taskelement = document.createElement('div');
        taskelement.classList.add('task');
        taskelement.setAttribute('data-id',task.id);
        taskelement.setAttribute("draggable","true");
        // taskelement.setAttribute('data-status',task.status);
        // taskelement.setAttribute('data-workspace-id',task.workspaceId);
        taskelement.innerHTML = `
                    <h1>${task.title}</h1>
                    <p>${task.description}</p>
                    <h3>${task.priority}</h3>
                    <button class="taskDeleteButton" >Delete</button>`;
        const targetList = document.querySelector(`[data-status="${task.status}"] .task-list`);

        if(targetList){
            targetList.appendChild(taskelement);
        }
    })
}

export function renderCount(){
    if (!appState.activeWorkspaceId) return;
    const statuses = ['todo', 'in-progress', 'review', 'done'];

    statuses.forEach(status =>{
        const column = document.querySelector(`[data-status="${status}"]`);
        if(!column) return;

        const countElement = column.querySelector('.heading .count');
        if(!countElement) return;

        const count = appState.tasks.filter(task => 
            task.workspaceId === appState.activeWorkspaceId
            && task.status ===status).length;
        countElement.textContent = count;
    });
}

export function renderApp(){
    renderWorkspaceTitle();
    renderWorkspaceTabs();
    renderTasks();
    renderCount();
}
