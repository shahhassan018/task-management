const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const FETCH_TASKS_LIST = `${BASE_URL}/tasks/fetchTasks`;
const ADD_TASK = '${BASE_URL}/tasks/addTask';
const TOGGLE_TASK = '${BASE_URL}/tasks/toggleTask';
const DELETE_TASK = '${BASE_URL}/tasks/deleteTask';
const API_URL = '/api/tasks';


export {
    BASE_URL,
    FETCH_TASKS_LIST,
    ADD_TASK,
    TOGGLE_TASK,
    DELETE_TASK,
    API_URL
}  