import { resolverMapping } from './resolvers/resolverMapping';

type AppSyncEvent = {
   info: {
      fieldName: string,
      parentTypeName: string
   },
   arguments: any
   source: any
}

exports.handle = async (event:AppSyncEvent) => {
    console.log("received event")
    console.log(event)
    console.log("parent: " + event.info.parentTypeName)
    console.log("field: " + event.info.fieldName)
    const resolver = resolverMapping[event.info.parentTypeName][event.info.fieldName];
    if (resolver) {
        return await resolver(event.source, event.arguments);
    } else {
        return null;
    }
}