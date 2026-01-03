import { appState } from "./state.js";

const APP_STATE_KEY = 'taskHubAppState';

export function loadState() {
    const defaultState = JSON.parse(JSON.stringify(appState));

    const savedState = localStorage.getItem(APP_STATE_KEY);

    // Checking if localStorage.getItem() returned something or not 

    if (!savedState){
        return defaultState;
    }
    else {
        try {
            const parsedState = JSON.parse(savedState);
            if (!parsedState || typeof parsedState !== 'object') {
                return defaultState;    
            }
            else {

                // Theme validation 

                if (parsedState.theme &&  (parsedState.theme ==='light' || parsedState.theme === 'dark')){
                    defaultState.theme = parsedState.theme;
                }

                // Workspace validation

                if(Array.isArray(parsedState.workspaces)){
                    const parsedWorkspaces = parsedState.workspaces;
                    const validWorkspaces = parsedWorkspaces.filter(
                        workspace => (typeof workspace.id === 'string' && workspace.id.trim() !== '') && (typeof workspace.name === 'string' && workspace.name.trim() !== '')
                    );
                    if(validWorkspaces && validWorkspaces.length >=1){
                        defaultState.workspaces = validWorkspaces;
                    }
                }

                // activeWorkspaceId validation

                if (typeof parsedState.activeWorkspaceId === 'string' && parsedState.activeWorkspaceId.trim() !== '' && defaultState.workspaces.find(ws => ws.id === parsedState.activeWorkspaceId)){
                    defaultState.activeWorkspaceId = parsedState.activeWorkspaceId;
                }
                else{
                    if(defaultState.workspaces.length > 0){
                        defaultState.activeWorkspaceId = defaultState.workspaces[0].id;
                    }
                }

                // task validation / normalization

                if(Array.isArray(parsedState.tasks)){
                    const workspaceIds = defaultState.workspaces.map(workspace => workspace.id);

                    const validTasks = parsedState.tasks.filter(task =>
                    ( typeof task.id === 'string' && task.id.trim() !== '') 
                    &&
                    ( typeof task.title === 'string' && task.title.trim() !== '')
                    &&
                    (['todo', 'in-progress', 'review', 'done'].includes(task.status))
                    &&
                    (workspaceIds.includes(task.workspaceId))
                    &&
                    (['low','medium','high'].includes(task.priority))
                    &&
                    (typeof task.description === 'string' )
                    );

                    defaultState.tasks = validTasks;
                }

            }
        }
        catch (error) {
            console.log(`Parsing failed with ${error} error`);
            return defaultState;
        }
    }

    return defaultState;

}


// const allowed = new Set(['a', 'b', 'c', 'd']);

// if (allowed.has(x)) {
//    do something
// }
