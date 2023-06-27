import 'source-map-support/register'
import { getUserId } from '../utils'
import * as middy from 'middy'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createAttachmentPresignedUrl } from '../../BusinessLogicLayer/todos'
import { cors, httpErrorHandler } from 'middy/middlewares'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId: string = getUserId(event)
    const todoId: string = event.pathParameters.todoId
    const returnUrl: string = await createAttachmentPresignedUrl(todoId, userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl: returnUrl
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
