async function randomText(parent: any, args: any) {
    return "Random text for user " + parent.name + " on " + Date.now();
}

export default randomText;