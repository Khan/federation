"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalGraphQLDataSource = void 0;
const graphql_1 = require("graphql");
const schemaInstrumentation_1 = require("apollo-server-core/dist/utils/schemaInstrumentation");
class LocalGraphQLDataSource {
    constructor(schema) {
        this.schema = schema;
        schemaInstrumentation_1.enablePluginsForSchemaResolvers(schema);
    }
    async process({ request, context, }) {
        return graphql_1.graphql({
            schema: this.schema,
            source: request.query,
            variableValues: request.variables,
            operationName: request.operationName,
            contextValue: context,
        });
    }
    sdl() {
        const result = graphql_1.graphqlSync({
            schema: this.schema,
            source: `{ _service { sdl }}`,
        });
        if (result.errors) {
            throw new Error(result.errors.map(error => error.message).join('\n\n'));
        }
        const sdl = result.data && result.data._service && result.data._service.sdl;
        return graphql_1.parse(sdl);
    }
}
exports.LocalGraphQLDataSource = LocalGraphQLDataSource;
//# sourceMappingURL=LocalGraphQLDataSource.js.map