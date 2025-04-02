import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { ROUTES, TASK_KEYS } from "./constants.mjs";
import { generateRandomID, validateTask } from "./utils.mjs";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = process.env.TABLE_NAME;

const getAllTasks = async () => {
  const resp = await dynamo.send(new ScanCommand({ TableName: tableName }));
  return resp.Items;
};

const getTaskByID = async (id) => {
  const resp = await dynamo.send(
    new GetCommand({
      TableName: tableName,
      Key: { id },
    }),
  );
  return resp.Item;
};

const createTask = async (data) => {
  const task = {
    id: generateRandomID(),
  };
  TASK_KEYS.forEach((key) => {
    task[key] = data[key];
  });
  validateTask(task);
  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: task,
      ConditionExpression: "attribute_not_exists(id)",
    }),
  );
  return task;
};

const updateTaskByID = async (id, data) => {
  const task = { id };
  TASK_KEYS.forEach((key) => {
    task[key] = data[key];
  });
  validateTask(task);
  await dynamo.send(
    new PutCommand({
      TableName: tableName,
      Item: task,
      ConditionExpression: "attribute_exists(id)",
    }),
  );
  return task;
};

const deleteTaskByID = async (id) => {
  await dynamo.send(
    new DeleteCommand({
      TableName: tableName,
      Key: {
        id,
      },
    }),
  );
  return "ok";
};

export const handler = async (event) => {
  console.info("received:", event);
  let body;
  let statusCode = 200;
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    switch (event.routeKey) {
      case ROUTES.GET_ALL_TASKS:
        body = await getAllTasks();
        break;
      case ROUTES.GET_TASK_BY_ID:
        body = await getTaskByID(event.pathParameters.id);
        break;
      case ROUTES.CREATE_TASK:
        body = await createTask(JSON.parse(event.body));
        break;
      case ROUTES.UPDATE_TASK_BY_ID:
        body = await updateTaskByID(
          event.pathParameters.id,
          JSON.parse(event.body),
        );
        break;
      case ROUTES.DELETE_TASK_BY_ID:
        body = await deleteTaskByID(event.pathParameters.id);
        break;
      default:
        throw new Error(`Unsupported route: "${event.routeKey}"`);
    }
  } catch (err) {
    statusCode = 400;
    body = err.message;
  } finally {
    body = JSON.stringify(body);
  }

  console.info(
    `response to: ${event.routeKey} statusCode: ${statusCode} body: ${body}`,
  );

  return {
    statusCode,
    body,
    headers,
  };
};
