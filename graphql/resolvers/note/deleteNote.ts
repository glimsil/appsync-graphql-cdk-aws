const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();

async function deleteNote(parent: any, args: any) {
    const params = {
        TableName: process.env.NOTES_TABLE,
        Key: {
          id: args.noteId
        }
    }
    try {
        await docClient.delete(params).promise()
        return args.noteId
    } catch (err) {
        console.log('DynamoDB error: ', err)
        return null
    }
}

export default deleteNote;