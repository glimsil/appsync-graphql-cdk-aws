import createNote from './resolvers/createNote';
import deleteNote from './resolvers/deleteNote';
import getNoteById from './resolvers/getNoteById';
import listNotes from './resolvers/listNotes';
import updateNote from './resolvers/updateNote';
import Note from './resolvers/Note';

type AppSyncEvent = {
   info: {
     fieldName: string,
     parentTypeName: string
  },
   arguments: {
     noteId: string,
     note: Note
  }
  source: any
}

exports.handler = async (event:AppSyncEvent) => {
    console.error("received event")
    console.error(event)
    console.error("filedName: " + event.info.fieldName)
    switch (event.info.parentTypeName) {
        case "Query":
            return await queryResolver(event);
        case "Mutation":
            return await mutationResolver(event);
        case "Note":
            return await noteResolver(event);
        case "User":
            return await userResolver(event);
        default:
            return null;
    }
}

const queryResolver = async (event:AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "getNoteById":
            return await getNoteById(event.arguments.noteId);
        case "listNotes":
            return await listNotes();
        default:
            return null;
    }
}

const mutationResolver = async (event:AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "createNote":
            return await createNote(event.arguments.note);
        case "deleteNote":
            return await deleteNote(event.arguments.noteId);
        case "updateNote":
            return await updateNote(event.arguments.note);
        default:
            return null;
    }
}

const noteResolver = async (event:AppSyncEvent) => {
    const source = event.source;
    switch (event.info.fieldName) {
        case "user":
            return {
                id:"123",
                name: "User of Note " + source.id 
            };
        case "listNotes":
            return await listNotes();
        default:
            return null;
    }
}

const userResolver = async (event:AppSyncEvent) => {
    const source = event.source;
    switch (event.info.fieldName) {
        case "randomText":
            return "random text for " + source.name;
        default:
            return null;
    }
}