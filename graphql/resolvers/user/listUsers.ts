import users from "./userData";

async function listUsers(parent: any, args: any) {
    return Object.values(users);
}

export default listUsers;