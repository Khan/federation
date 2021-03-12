import { fetch } from 'apollo-server-env';
import { ServiceDefinitionUpdate } from './config';
interface ImplementingServiceLocation {
    name: string;
    path: string;
}
export interface CompositionMetadata {
    formatVersion: number;
    id: string;
    implementingServiceLocations: ImplementingServiceLocation[];
    schemaHash: string;
}
export declare function getServiceDefinitionsFromStorage({ graphId, apiKeyHash, graphVariant, federationVersion, fetcher, }: {
    graphId: string;
    apiKeyHash: string;
    graphVariant: string;
    federationVersion: number;
    fetcher: typeof fetch;
}): Promise<ServiceDefinitionUpdate>;
export {};
//# sourceMappingURL=legacyLoadServicesFromStorage.d.ts.map