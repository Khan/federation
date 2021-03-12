"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceDefinitionsFromStorage = void 0;
const graphql_1 = require("graphql");
const envOverridePartialSchemaBaseUrl = 'APOLLO_PARTIAL_SCHEMA_BASE_URL';
const envOverrideStorageSecretBaseUrl = 'APOLLO_STORAGE_SECRET_BASE_URL';
const urlFromEnvOrDefault = (envKey, fallback) => (process.env[envKey] || fallback).replace(/\/$/, '');
const urlPartialSchemaBase = urlFromEnvOrDefault(envOverridePartialSchemaBaseUrl, 'https://federation.api.apollographql.com/');
const urlStorageSecretBase = urlFromEnvOrDefault(envOverrideStorageSecretBaseUrl, 'https://storage-secrets.api.apollographql.com/');
function getStorageSecretUrl(graphId, apiKeyHash) {
    return `${urlStorageSecretBase}/${graphId}/storage-secret/${apiKeyHash}.json`;
}
function fetchApolloGcs(fetcher, ...args) {
    const [input, init] = args;
    const url = typeof input === 'object' && input.url || input;
    return fetcher(input, init)
        .catch(fetchError => {
        throw new Error("Cannot access Apollo storage: " + fetchError);
    })
        .then(async (response) => {
        if (response.ok || response.status === 304) {
            return response;
        }
        const body = await response.text();
        if (response.status === 403 && body.includes("AccessDenied")) {
            throw new Error("Unable to authenticate with Apollo storage " +
                "while fetching " + url + ".  Ensure that the API key is " +
                "configured properly and that a federated service has been " +
                "pushed.  For details, see " +
                "https://go.apollo.dev/g/resolve-access-denied.");
        }
        throw new Error("Could not communicate with Apollo storage: " + body);
    });
}
;
async function getServiceDefinitionsFromStorage({ graphId, apiKeyHash, graphVariant, federationVersion, fetcher, }) {
    const storageSecretUrl = getStorageSecretUrl(graphId, apiKeyHash);
    const secret = await fetchApolloGcs(fetcher, storageSecretUrl).then(res => res.json());
    const baseUrl = `${urlPartialSchemaBase}/${secret}/${graphVariant}/v${federationVersion}`;
    const compositionConfigResponse = await fetchApolloGcs(fetcher, `${baseUrl}/composition-config-link`);
    if (compositionConfigResponse.status === 304) {
        return { isNewSchema: false };
    }
    const linkFileResult = await compositionConfigResponse.json();
    const compositionMetadata = await fetchApolloGcs(fetcher, `${urlPartialSchemaBase}/${linkFileResult.configPath}`).then(res => res.json());
    const serviceDefinitions = await Promise.all(compositionMetadata.implementingServiceLocations.map(async ({ name, path }) => {
        const { url, partialSchemaPath } = await fetcher(`${urlPartialSchemaBase}/${path}`).then(response => response.json());
        const sdl = await fetcher(`${urlPartialSchemaBase}/${partialSchemaPath}`).then(response => response.text());
        return { name, url, typeDefs: graphql_1.parse(sdl) };
    }));
    return {
        serviceDefinitions,
        compositionMetadata,
        isNewSchema: true,
    };
}
exports.getServiceDefinitionsFromStorage = getServiceDefinitionsFromStorage;
//# sourceMappingURL=loadServicesFromStorage.js.map