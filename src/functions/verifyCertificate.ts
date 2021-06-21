import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda"
import { document } from "src/utils/dynamodbClient"

export const handle: APIGatewayProxyHandler = async (event): Promise<APIGatewayProxyResult> => {
  const { id } = event.pathParameters;

  const response = await document.query({
    TableName: "users_certificates",
    KeyConditionExpression: "id= :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  }).promise();


  const userCertificate = response.Items[0];

  if (userCertificate) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Valid certificate",
        name: userCertificate.name,
        url: `https://tusa-certificatesignite.s3.sa-east-1.amazonaws.com/${id}.pdf`
      }),
      headers: {
        "Content-type": "application/json"
      }
    }
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: "Invalid certificate",
    }),
    headers: {
      "Content-type": "application/json"
    }
  }
}