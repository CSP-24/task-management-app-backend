export const ROUTES = {
  GET_ALL_TASKS: "GET /tasks",
  GET_TASK_BY_ID: "GET /tasks/{id}",
  CREATE_TASK: "POST /tasks",
  UPDATE_TASK_BY_ID: "PUT /tasks/{id}",
  DELETE_TASK_BY_ID: "DELETE /tasks/{id}",
};

export const TASK_KEYS = ["title", "description", "status"];

export const TASK_STATUS_VALUES = ["To Do", "In Progress", "Completed"];
