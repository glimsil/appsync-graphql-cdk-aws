import createNote from './resolvers/createNote';
import deleteNote from './resolvers/deleteNote';
import getNoteById from './resolvers/getNoteById';
import listNotes from './resolvers/listNotes';
import updateNote from './resolvers/updateNote';
import Note from './resolvers/Note';

type AppSyncEvent = {
   info: {
     fieldName: string
  },
   arguments: {
     noteId: string,
     note: Note
  }
}

exports.handler = async (event:AppSyncEvent) => {
    console.error("received event")
    console.error(event)
    console.error("filedName: " + event.info.fieldName)
    switch (event.info.fieldName) {
        case "getNoteById":
            return await getNoteById(event.arguments.noteId);
        case "createNote":
            return await createNote(event.arguments.note);
        case "listNotes":
            return await listNotes();
        case "deleteNote":
            return await deleteNote(event.arguments.noteId);
        case "updateNote":
            return await updateNote(event.arguments.note);
        default:
            return null;
    }
}