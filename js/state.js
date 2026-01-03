export let appState = {
    workspaces: [
            {id: 'ws-1', name: 'dummy workspace design'},
            {id: 'ws-2', name: 'dummy workspace testing'}],
    tasks: [
            {id: 't-1', title: 'dummy task 1', description: 'dummy task 1 description', priority: 'high', status: 'todo' , workspaceId: 'ws-1'},
            {id: 't-2', title: 'dummy task 2', description: 'dummy task 2 description', priority: 'medium', status: 'in-progress' , workspaceId: 'ws-1'},
            {id: 't-3', title: 'dummy task 3', description: 'dummy task 3 description', priority: 'low', status: 'review' , workspaceId: 'ws-1'},
            {id: 't-4', title: 'dummy task 4', description: 'dummy task 4 description', priority: 'low', status: 'done' , workspaceId: 'ws-1'}
        ],
    activeWorkspaceId: 'ws-1',
    theme: 'light'
};