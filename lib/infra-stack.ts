import { CfnOutput, Construct, Duration, Expiration, Stack, StackProps } from '@aws-cdk/core';
import { AuthorizationType, GraphqlApi, LambdaDataSource, Schema } from '@aws-cdk/aws-appsync';
import { AttributeType, Table } from '@aws-cdk/aws-dynamodb';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { PolicyDocument, PolicyStatement, Role, ServicePrincipal } from "@aws-cdk/aws-iam";
import * as path from "path";

export class InfraStack extends Stack {

  private notesGraphqlApi: GraphqlApi;
  private notesTable: Table;
  private resolverLambdaRole: Role;
  private resolverLambda: Function;
  private notesLambdaDataSource: LambdaDataSource;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    this.notesGraphqlApi = this.createGraphqlApi();
    this.notesTable = this.createNotesTable();
    this.resolverLambdaRole = this.createResolverLambdaRole();
    this.resolverLambda = this.createResolverLambda();
    this.notesLambdaDataSource = this.createLambdaDatasource();

    new CfnOutput(this, "GraphQLAPIURL", {
     value: this.notesGraphqlApi.graphqlUrl
    });
    new CfnOutput(this, "GraphQLAPIKey", {
      value: this.notesGraphqlApi.apiKey || ''
    });
  }

  private createNotesTable(): Table {
    return new Table(this, `NotesTable`, {
        tableName: 'NotesTable',
        partitionKey: {
            name: 'id',
            type: AttributeType.STRING
        },
    });
  }

  private createGraphqlApi(): GraphqlApi {
    return new GraphqlApi(this, 'ResolverApi', {
      name: 'glimsil-ResolverAppsyncGraphqlApi',
      schema: Schema.fromAsset('graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY,
          apiKeyConfig: {
            expires: Expiration.after(Duration.days(365))
          }
        },
      },
      xrayEnabled: true,
    });
  }

  private createResolverLambdaRole(): Role {
    // Policies to give lambda permissions to use DynamoDB NotesTable
    const accessDdb = new PolicyDocument({
      statements: [
        new PolicyStatement({
          actions: [
              "dynamodb:BatchGetItem",
              "dynamodb:GetItem",
              "dynamodb:Scan",
              "dynamodb:Query",
              "dynamodb:BatchWriteItem",
              "dynamodb:PutItem",
              "dynamodb:UpdateItem",
              "dynamodb:DeleteItem"
          ],
          resources: [this.notesTable.tableArn] // only notesTable
        }),
      ],
    });
    const cloudwatch = new PolicyDocument({
      statements: [
        new PolicyStatement({
          actions: [
              "cloudwatch:*",
              "logs:*"
          ],
          resources: ["*"]
        }),
      ],
    });
    return new Role(this, `ResolverLambdaRole`, {
      roleName: 'ResolverLambdaRole',
      description: 'IAM role for ResolverLambda',
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
      inlinePolicies: {
        AccessDdb: accessDdb, // add inline policy to IAM Role
        CloudWatch: cloudwatch
      }
    });
  }

  private createResolverLambda(): Function {
    return new Function(this, 'GraphqlResolverHandler', {
      runtime: Runtime.NODEJS_14_X,
      handler: 'handler.handle',
      code: Code.fromAsset('graphql'),
      role: this.resolverLambdaRole,
      environment: {
        'NOTES_TABLE': this.notesTable.tableName
      },
      memorySize: 1024
    });
  }

  private createLambdaDatasource(): LambdaDataSource {
    this.notesLambdaDataSource = this.notesGraphqlApi.addLambdaDataSource('ResolverLambdaDatasource', this.resolverLambda);
    this.notesLambdaDataSource.createResolver({
      typeName: "Query",
      fieldName: "getNoteById"
    });

    this.notesLambdaDataSource.createResolver({
      typeName: "Query",
      fieldName: "listNotes"
    });

    this.notesLambdaDataSource.createResolver({
      typeName: "Query",
      fieldName: "listUsers"
    });

    this.notesLambdaDataSource.createResolver({
      typeName: "Note",
      fieldName: "user"
    });

    this.notesLambdaDataSource.createResolver({
      typeName: "User",
      fieldName: "randomText"
    });
    
    this.notesLambdaDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "createNote"
    });
    
    this.notesLambdaDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "deleteNote"
    });
    
    this.notesLambdaDataSource.createResolver({
      typeName: "Mutation",
      fieldName: "updateNote"
    });

    return this.notesLambdaDataSource;
  }
}
