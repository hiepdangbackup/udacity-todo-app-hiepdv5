import { TodosAccess } from '../DataLogicLayer/todosAcess'
import { TodoItem } from '../models/TodoItem'
import { AttachmentUtils } from '../helpers/attachmentUtils'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { v4 as uuidv4 } from 'uuid'
import { createLogger } from '../utils/logger'

const logger = createLogger('todos')
const todoAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()

export async function createTodo(
  model: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info(`Create todo: ${userId}`)
  const newItem: TodoItem = {} as TodoItem
  newItem.todoId = uuidv4()
  newItem.name = model.name
  newItem.userId = userId
  newItem.createdAt = new Date().toISOString()
  newItem.dueDate = model.dueDate
  newItem.done = false
  return await todoAccess.createTodo(newItem)
}

export async function getTodos(userId: string): Promise<any> {
  logger.info(`Get todo: ${userId}`)
  return await todoAccess.getTodos(userId)
}

export async function updateTodo(
  todoId: string,
  userId: string,
  model: UpdateTodoRequest
) {
  logger.info(`Update todo ${todoId}`)
  await todoAccess.updateTodo(todoId, userId, model)
}

export async function deleteTodo(todoId: string, userId: string) {
  logger.info(`Delete todo: ${todoId}`)
  await todoAccess.deleteTodo(todoId, userId)
}

export async function createAttachmentPresignedUrl(
  todoId: string,
  userId: string
): Promise<string> {
  logger.info('Attachment presigned url:')
  const attachmentUrl: string = attachmentUtils.getSignedUrl(todoId)
  const dbUrl: string = `https://${process.env.ATTACHMENT_S3_BUCKET}.s3.amazonaws.com/${todoId}`
  await todoAccess.updateAttachment(todoId, userId, dbUrl)
  return attachmentUrl
}
