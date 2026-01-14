import { appState } from "./state.js";
import { renderApp } from "./render.js";
import { saveState } from "./persistence.js";

let pendingDeleteWorkspaceId = null;

export function initWorkspaceEvents() {
    const workspaceTabsContainer = document.querySelector('.workspaceTabs');
    if (!workspaceTabsContainer) return;

    workspaceTabsContainer.addEventListener('click', (e) => {

        // DELETE WORKSPACE
        const deleteBtn = e.target.closest('.workspace-delete');
        if (deleteBtn) {
            e.stopPropagation();

            const tab = deleteBtn.closest('.workspace-tab');
            if (!tab) return;

            pendingDeleteWorkspaceId = tab.dataset.workspaceId;
            if (!pendingDeleteWorkspaceId) return;

            const ws = appState.workspaces.find(
                w => w.id === pendingDeleteWorkspaceId
            );
            if (!ws) return;

            const deleteWorkspaceTitle =
                document.querySelector('.delete-workspace-title');

            deleteWorkspaceTitle.textContent =
                `Delete workspace "${ws.name}" and all its tasks?`;

            const modal = document.querySelector('.delete-workspace');
            openModal(modal);
            return;
        }

        // SWITCH WORKSPACE
        const tab = e.target.closest('.workspace-tab');
        if (!tab) return;

        const workspaceId = tab.dataset.workspaceId;
        if (!workspaceId || workspaceId === appState.activeWorkspaceId) return;

        appState.activeWorkspaceId = workspaceId;
        saveState(appState);
        renderApp();
    });
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
    const modalBg = document.querySelector('.add-new-task .bg');
    const modal = document.querySelector('.add-new-task');
    const formAddTask = document.querySelector('.add-new-task .center')
    
    // Add task btn event handler
    const taskTitleInput = document.querySelector('#task-title-input');
    const taskDescInput = document.querySelector('#task-desc-input');
    const taskPriority = document.querySelector('#task-priority');
    const cancelBtn = document.querySelector('#cancel-btn-id-task');
    
    if (!taskTitleInput || !taskDescInput || !taskPriority) return;
    //Modal events handlers
    
    if (!modal || !modalOpenBtn) return;

    modalOpenBtn.addEventListener('click' , () => {
        openModal(modal);
        taskTitleInput.focus();
    })

    if(modalBg) {
        modalBg.addEventListener('click' , () => {
            closeModal(modal);
            formAddTask.reset();
        })
    }

    if(cancelBtn) {
        cancelBtn.addEventListener('click' , () => {
            closeModal(modal);
            formAddTask.reset();
        })
    }

    window.addEventListener('keydown' , (e) => {
        if (modal.classList.contains('open') && e.key === 'Escape') {
            closeModal(modal);
            formAddTask.reset();
        }
    })



    if(!formAddTask) return;

    formAddTask.addEventListener('submit' , (e) => {
        
        e.preventDefault();

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
        formAddTask.reset();
    })
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

export function initDeleteWorkspaceModalEvents() {
        
        const modal = document.querySelector('.delete-workspace');
        const modalBg = document.querySelector('.delete-workspace .bg');
        const confirmBtn = document.querySelector('#confirm-delete-workspace');
        const cancelBtn =document.querySelector('#cancel-delete-workspace');

        const deleteWorkspaceTitle = document.querySelector('.delete-workspace .icon-and-title .delete-workspace-title');

        if(!modal) return;

        if(!deleteWorkspaceTitle) return;

        if(modalBg) {
        modalBg.addEventListener('click' , () => {
            resetDeleteWorkspaceModal(modal,deleteWorkspaceTitle);
            })
        }

        if(cancelBtn) {
        cancelBtn.addEventListener('click' , () => {
            resetDeleteWorkspaceModal(modal,deleteWorkspaceTitle);
            })
        }

        window.addEventListener('keydown' , (e) => {
        if (modal.classList.contains('open') && e.key === 'Escape') {
            resetDeleteWorkspaceModal(modal,deleteWorkspaceTitle);
            }
        })

        if(!confirmBtn) return;
        confirmBtn.addEventListener('click' , () => {
            
            if (!pendingDeleteWorkspaceId) return
            confirmedWorkspaceDeletion();
            resetDeleteWorkspaceModal(modal,deleteWorkspaceTitle);
        })

}
// Helpers for add task/workspace/deleteWorkspace Modal

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

function resetDeleteWorkspaceModal(modal,deleteWorkspaceTitle) {
    pendingDeleteWorkspaceId = null;
    deleteWorkspaceTitle.textContent = '';
    closeModal(modal);

}

function confirmedWorkspaceDeletion() {

    if(!pendingDeleteWorkspaceId) return;
    if(appState.workspaces.length === 1) return;

    appState.tasks = appState.tasks.filter(task => task.workspaceId !== pendingDeleteWorkspaceId);
    appState.workspaces = appState.workspaces.filter( ws => ws.id !== pendingDeleteWorkspaceId);

    if (appState.activeWorkspaceId === pendingDeleteWorkspaceId) {
        appState.activeWorkspaceId =
        appState.workspaces.length > 0 ? appState.workspaces[0].id : null;
    }

    saveState(appState);
    renderApp();
}