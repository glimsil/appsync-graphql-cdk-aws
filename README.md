# appsync-graphql-cdk-aws
This is an example on how to create and deploy a graphql api with appsync + lambda, using CDK.

Requirements:
 - Node.js
 - CDK
 - AWS CLI

# Setup
First, setup you aws environment running:

```
aws configure
```
You should set up your User Access Key / Secret and region.

# Deploying
In the first time you should run:

```
cdk bootstrap # You only have to run it once
```   

Build and compile running:
```
npm run build
```   

To deploy the api run:
```
cdk deploy --require-approval never
```

The graphql api endpoint and graphql api key will be outputed after deployment. The outputformat would be something like:

```
InfraStack.GraphQLAPIKey = xxxxxxxxxxxxxxxxxxxxx
InfraStack.GraphQLAPIURL = https://xxxxxxxxxxxxxxx.appsync-api.us-west-2.amazonaws.com/graphql
```

To destroy the stack, run:

```
cdk destroy
```

# Testing

You can test the integration using Appsync console (in your AWS account) or executing an http request (using curl or postman for example). If you're going to call appsync by http call outside aws console, you should add your access key (outputed by cdk) as header: `x-api-key: xxxxxxxxxxxxxxxxxxxxx`

Create Note mutation:

```
mutation createNote {
  createNote(note: {
    id: "0001"
    name: "My first note"
    completed: false
  }) {
    id
    name
    completed
  }
}
```

Update Note mutation:

```
mutation updateNote {
  updateNote(note: {
    id: "0001"
    completed: true
  }) {
    id
    completed
  }
}
```

Get Note query:

```
query getNoteById {
  getNoteById(noteId: "0001") {
    id
    name
    completed
  }
}
```

List All Notes query:

```
query listNotes {
  listNotes {
    id
    name
    completed
  }
}
```

Subscriptions (doesn't work with http):

```
subscription onCreate {
  onCreateNote {
    id	
    name
    completed
  }
}

subscription onUpdate {
  onUpdateNote {
    id
    completed
  }
}
```