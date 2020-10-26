"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceDefinitionsFromRemoteEndpoint = void 0;
const graphql_1 = require("graphql");
const node_fetch_1 = require("node-fetch");
const _1 = require("./");
async function getServiceDefinitionsFromRemoteEndpoint({ serviceList, headers = {}, serviceSdlCache, }) {
    if (!serviceList || !serviceList.length) {
        throw new Error('Tried to load services from remote endpoints but none provided');
    }
    let isNewSchema = false;
    const promiseOfServiceList = serviceList.map(({ name, url, dataSource }) => {
        if (!url) {
            throw new Error(`Tried to load schema for '${name}' but no 'url' was specified.`);
        }
        const request = {
            query: _1.SERVICE_DEFINITION_QUERY,
            http: {
                url,
                method: 'POST',
                headers: new node_fetch_1.Headers(headers),
            },
        };
        return dataSource
            .process({ request, context: {} })
            .then(({ data, errors }) => {
            if (data && !errors) {
                const typeDefs = data._service.sdl;
                const previousDefinition = serviceSdlCache.get(name);
                if (previousDefinition !== typeDefs) {
                    isNewSchema = true;
                }
                serviceSdlCache.set(name, typeDefs);
                return {
                    name,
                    url,
                    typeDefs: graphql_1.parse(typeDefs),
                };
            }
            throw new Error(errors === null || errors === void 0 ? void 0 : errors.map(e => e.message).join("\n"));
        })
            .catch(err => {
            const errorMessage = `Couldn't load service definitions for "${name}" at ${url}` +
                (err && err.message ? ": " + err.message || err : "");
            throw new Error(errorMessage);
        });
    });
    const serviceDefinitions = await Promise.all(promiseOfServiceList);
    return { serviceDefinitions, isNewSchema };
}
exports.getServiceDefinitionsFromRemoteEndpoint = getServiceDefinitionsFromRemoteEndpoint;
//# sourceMappingURL=loadServicesFromRemoteEndpoint.js.map