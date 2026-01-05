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
    const cancelBtn = document.querySelector('#cancel-btn-id');

    //Modal events handlers

    if(!modal) return;
    if(!modalOpenBtn) return;
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
        if (e.key === 'Escape') closeModal(modal);
    })

    // Add task btn event handler
    const taskTitleInput = document.querySelector('#task-title-input');
    const taskDescInput = document.querySelector('#task-desc-input');
    const taskPriority = document.querySelector('#task-priority');
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
        document.querySelector('#task-title-input').value = '';
        document.querySelector('#task-desc-input').value = '';
        document.querySelector('#task-priority').value = 'low';
    })
}

// Helpers for Modal and Add task

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