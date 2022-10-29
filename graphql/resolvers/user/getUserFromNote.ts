import users from "./userData";


async function getUserFromNote(parent: any, args: any) {
    console.log("Executing getUserFromNote")
    console.log(parent);
    console.log(args);
    console.log("UserId: " + parent.userId);
    console.log(users[parent.userId]);
    return users[parent.userId];
}

export default getUserFromNote;