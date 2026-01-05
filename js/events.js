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
    });
    taskList.addEventListener('dragstart',(e) =>{
        const task = e.target.closest('.task');
        if (!task) return;
        e.dataTransfer.setData('text/plain', task.dataset.id);
    e.dataTransfer.effectAllowed = 'move';
    });
    taskList.addEventListener('dragover',(e) =>{
        e.preventDefault();
    });
    taskList.addEventListener('drop',(e) =>{
        e.preventDefault();
        const droppedTaskId = e.dataTransfer.getData('text/plain');
        if(!droppedTaskId) return;
        const droppedTask = appState.tasks.find(task => task.id === droppedTaskId) ;
        if(!droppedTask) return;
        if(droppedTask.status === taskList.closest('.task-column').dataset.status) return;
        droppedTask.status = taskList.closest('.task-column').dataset.status;
        saveState(appState);
        renderApp();
    })
})
}

export function initAddTaskModalEvents() {
    const modalOpenBtn = document.querySelector('#addTask');
    const modalBg = document.querySelector('.modal .bg');
    const modal = document.querySelector('.modal');
    const addTaskBtn = document.querySelector('#add-new-task');
    const cancelBtn = document.querySelector('#cancel-btn-id-task');

    //Modal events handlers

    if (!modal || !modalOpenBtn) return;

    modalOpenBtn.addEventListener('click' , () => {
        openModal(modal);
    })

    if(modalBg) {
        modalBg.addEventListener('click' , () => {
            closeModal(modal);
        })
    }

    if(cancelBtn) {
        cancelBtn.addEventListener('click' , () => {
            closeModal(modal);
        })
    }

    window.addEventListener('keydown' , (e) => {
        if (modal.classList.contains('open') && e.key === 'Escape') {
            closeModal(modal);
        }
    })

    // Add task btn event handler
    const taskTitleInput = document.querySelector('#task-title-input');
    const taskDescInput = document.querySelector('#task-desc-input');
    const taskPriority = document.querySelector('#task-priority');

    if (!taskTitleInput || !taskDescInput || !taskPriority) return;

    if(!addTaskBtn) return;

    addTaskBtn.addEventListener('click' , () => {
        
        const taskTitleInputValue = taskTitleInput.value;
        const taskDescInputValue = taskDescInput.value;
        const taskPriorityValue = taskPriority.value;

        if(!taskTitleInputValue || !taskPriorityValue ) return;
        if(taskTitleInputValue.trim() === '') return;
        if(!appState.activeWorkspaceId) return;

        const task = createTaskFromInput(taskTitleInputValue, taskDescInputValue, taskPriorityValue, appState.activeWorkspaceId, appState.tasks);

        if(!task) return;
        appState.tasks.push(task);
        saveState(appState);
        renderApp();
        closeModal(modal);
        taskTitleInput.value = '';
        taskDescInput.value = '';
        taskPriority.value = 'low';
    })
}

// Helpers for add task Modal

function openModal(modal) {
    modal.classList.add('open');
}

function closeModal(modal) {
    modal.classList.remove('open');
}

function createTaskFromInput(title, description, priority, workspaceId, existingTasks) {
    let id;
    do{
        id = crypto.randomUUID();
    } while (existingTasks.some(t => t.id === id));
    return {
        id : id,
        title : title,
        description : description,
        priority : priority,
        status : 'todo',
        workspaceId : workspaceId
    }
}


export function initAddWorkspaceModalEvents() {
    const modalOpenBtn = document.querySelector('#addWorkspaceBtn');
    const modal = document.querySelector('.add-new-workspace');
    const modalBg = document.querySelector('.add-new-workspace .bg');
    const addWorkspaceBtn = document.querySelector('#add-new-workspace');
    const cancelBtn = document.querySelector('#cancel-btn-id-workspace');

    if (!modal || !modalOpenBtn) return;

    modalOpenBtn.addEventListener('click' , () => {
        openModal(modal);
    })

    if(modalBg) {
        modalBg.addEventListener('click' , () => {
            closeModal(modal);
        })
    }

    if(cancelBtn) {
        cancelBtn.addEventListener('click' , () => {
            closeModal(modal);
        })
    }

    window.addEventListener('keydown' , (e) => {
        if (modal.classList.contains('open') && e.key === 'Escape') {
            closeModal(modal);
        }
    })

    // Add workspace event handler 

    const workspaceNameInput = document.querySelector('#workspace-title-input');

    if (!workspaceNameInput) return;

    if(!addWorkspaceBtn) return;
    addWorkspaceBtn.addEventListener('click',() => {
        const workspaceNameInputValue = workspaceNameInput.value;

        if(!workspaceNameInputValue) return;
        if(workspaceNameInputValue.trim() === '') return;

        const workspace = createWorkspaceFromInput(workspaceNameInputValue,appState.workspaces);

        if(!workspace) return;
        appState.workspaces.push(workspace);
        appState.activeWorkspaceId = workspace.id;
        saveState(appState);
        renderApp();
        closeModal(modal);
        workspaceNameInput.value = '';
    })
}

function createWorkspaceFromInput(name, existingWorkspaces) {
    const trimmedName = name.trim();
    if (!trimmedName) return null;

    const normalized = trimmedName.toLowerCase();
    if (existingWorkspaces.some(ws => ws.name.toLowerCase() === normalized)) {
        return null;
    }

    let id;
    do {
        id = crypto.randomUUID();
    } while (existingWorkspaces.some(ws => ws.id === id));

    return {
        id: id,
        name: trimmedName
    };
}
