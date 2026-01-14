import { appState } from "./state.js";

const APP_STATE_KEY = 'taskHubAppState';

// Predicate helper functions

function isValidTheme(theme){
    return theme === 'light' || theme === 'dark';
}

function isValidWorkspace(workspace){
    return (workspace && typeof workspace === 'object')
    &&
    (typeof workspace.id === 'string' && workspace.id.trim() !== '')
    &&
    (typeof workspace.name === 'string' && workspace.name.trim() !== '');
}

function isValidTask(task,workspaceIds){
    return (task && typeof task === 'object')
    &&
    ( typeof task.id === 'string' && task.id.trim() !== '') 
    &&
    ( typeof task.title === 'string' && task.title.trim() !== '')
    &&
    (['todo', 'in-progress', 'review', 'done'].includes(task.status))
    &&
    (workspaceIds.has(task.workspaceId))
    &&
    (['low','medium','high'].includes(task.priority))
    &&
    (typeof task.description === 'string' )
}

// Normalization helper functions

function normalizeTheme(state, parsedState){
    if(isValidTheme(parsedState.theme)){
        state.theme = parsedState.theme;
    }
}

function normalizeWorkspaces(state, parsedState){
    if(Array.isArray(parsedState.workspaces)){

        const parsedWorkspaces = parsedState.workspaces;
        const validWorkspaces = parsedWorkspaces.filter(isValidWorkspace);

        if(validWorkspaces && validWorkspaces.length >=1){
            state.workspaces = validWorkspaces;
        }
    }
}

function normalizeActiveWorkspaceId(state, parsedState){
    if (
        typeof parsedState.activeWorkspaceId === 'string' &&
        parsedState.activeWorkspaceId.trim() !== '' &&
        state.workspaces.find(ws => ws.id === parsedState.activeWorkspaceId)
        ) {
            state.activeWorkspaceId = parsedState.activeWorkspaceId;
        } else {
            if (state.workspaces.length > 0) {
                state.activeWorkspaceId = state.workspaces[0].id;
            }
    }
}

function normalizeTasks(state, parsedState){
    if(Array.isArray(parsedState.tasks)){
        const workspaceIds = new Set(state.workspaces.map(workspace => workspace.id));

        const validTasks = parsedState.tasks.filter(task => isValidTask(task,workspaceIds));

        state.tasks = validTasks;
    }
}

export function loadState() {
    const defaultState = JSON.parse(JSON.stringify(appState));

    const savedState = localStorage.getItem(APP_STATE_KEY);

    if (!savedState){
        return defaultState
    }
    
    try {
        const parsedState = JSON.parse(savedState);
        if (!parsedState || typeof parsedState !== 'object') {
            return defaultState;    
        }
        else {
            normalizeTheme(defaultState,parsedState);
            normalizeWorkspaces(defaultState,parsedState);
            normalizeActiveWorkspaceId(defaultState,parsedState);
            normalizeTasks(defaultState,parsedState);
        }
    }
    catch (error) {
        console.log(`Parsing failed with ${error} error`);
        return defaultState;
    }

    return defaultState;

}

export function saveState(state) {
    try{
        localStorage.setItem(APP_STATE_KEY,JSON.stringify(state));
    }
    catch(error){
        console.error(`Failed to save state : ${error}`);
    }
}