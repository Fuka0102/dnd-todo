export type Data = {
    id: string,
    name: string,
    lists: {
        id: string,
        title: string,
        todos: {
            id: string,
            title: string
        }[]
    }[]
}

export const todoData = {
    id: 'PJ1',
    name: 'Project 1',
    lists: [
        {
        id: 'list-sample',
        title: 'List Sample',
        todos: [
            {id: 'todo1', title: 'todo 1'},
            {id: 'todo2', title: 'todo 2'},
            {id: 'todo3', title: 'todo 3'},
        ],
    },
    {
        id: 'list-sample2',
        title: 'List Sample2',
        todos: [
            {id: 'todo4', title: 'todo 4'},
            {id: 'todo5', title: 'todo 5'},
            {id: 'todo6', title: 'todo 6'},
        ],
    },
    {
        id: 'list-sample3',
        title: 'List Sample3',
        todos: [
            {id: 'todo7', title: 'todo 7'},
            {id: 'todo8', title: 'todo 8'},
        ],
    }]
}