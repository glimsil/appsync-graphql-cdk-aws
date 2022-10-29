const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient();
import NoteInput from './NoteInput';

async function createNote(parent: any, args: any) {
    const note: NoteInput = args.note;
    const params = {
        TableName: process.env.NOTES_TABLE,
        Item: note
    }
    try {
        await docClient.put(params).promise();
        return note;
    } catch (err) {
        console.log('DynamoDB error: ', err);
        return null;
    }
}

export default createNote;