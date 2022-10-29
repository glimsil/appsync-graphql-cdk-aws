import getNoteById from "./note/getNoteById";
import listNotes from "./note/listNotes";
import createNote from "./note/createNote";
import updateNote from "./note/updateNote";
import deleteNote from "./note/deleteNote";
import listUsers from "./user/listUsers";
import getUserFromNote from "./user/getUserFromNote";
import randomText from "./user/randomText";

export const resolverMapping: { [key: string]: { [key: string]: (parent: any, args: any) => any } } = {
    Query: {
        getNoteById,
        listNotes,
        listUsers
    },
    Mutation: {
        createNote,
        updateNote,
        deleteNote
    },
    User: {
        randomText
    },
    Note: {
        user: getUserFromNote
    }
}