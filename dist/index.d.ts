/// <reference path="../src/make-fetch-happen.d.ts" />
import { GraphQLService, SchemaChangeCallback, Unsubscriber, GraphQLServiceEngineConfig } from 'apollo-server-core';
import { GraphQLExecutionResult, Logger, GraphQLRequestContextExecutionDidStart, ApolloConfig } from 'apollo-server-types';
import { InMemoryLRUCache } from 'apollo-server-caching';
import { GraphQLSchema, GraphQLError } from 'graphql';
import { ServiceDefinition, ComposedGraphQLSchema } from '@apollo/federation';
import { buildQueryPlan, buildOperationContext } from './buildQueryPlan';
import { executeQueryPlan, ServiceMap } from './executeQueryPlan';
import { CompositionMetadata } from './loadServicesFromStorage';
import { serializeQueryPlan, QueryPlan, OperationContext } from './QueryPlan';
import { GraphQLDataSource } from './datasources/types';
import { HeadersInit } from 'node-fetch';
import { fetch } from 'apollo-server-env';
export declare type ServiceEndpointDefinition = Pick<ServiceDefinition, 'name' | 'url'>;
interface GatewayConfigBase {
    debug?: boolean;
    logger?: Logger;
    __exposeQueryPlanExperimental?: boolean;
    buildService?: (definition: ServiceEndpointDefinition) => GraphQLDataSource;
    experimental_didResolveQueryPlan?: Experimental_DidResolveQueryPlanCallback;
    experimental_didFailComposition?: Experimental_DidFailCompositionCallback;
    experimental_updateServiceDefinitions?: Experimental_UpdateServiceDefinitions;
    experimental_didUpdateComposition?: Experimental_DidUpdateCompositionCallback;
    experimental_pollInterval?: number;
    experimental_approximateQueryPlanStoreMiB?: number;
    experimental_autoFragmentization?: boolean;
    fetcher?: typeof fetch;
    serviceHealthCheck?: boolean;
}
interface RemoteGatewayConfig extends GatewayConfigBase {
    serviceList: ServiceEndpointDefinition[];
    introspectionHeaders?: HeadersInit;
}
interface ManagedGatewayConfig extends GatewayConfigBase {
    federationVersion?: number;
}
interface LocalGatewayConfig extends GatewayConfigBase {
    localServiceList: ServiceDefinition[];
}
export declare type GatewayConfig = RemoteGatewayConfig | LocalGatewayConfig | ManagedGatewayConfig;
declare type DataSourceMap = {
    [serviceName: string]: {
        url?: string;
        dataSource: GraphQLDataSource;
    };
};
export declare type Experimental_DidResolveQueryPlanCallback = ({ queryPlan, serviceMap, operationContext, requestContext, }: {
    readonly queryPlan: QueryPlan;
    readonly serviceMap: ServiceMap;
    readonly operationContext: OperationContext;
    readonly requestContext: GraphQLRequestContextExecutionDidStart<Record<string, any>>;
}) => void;
export declare type Experimental_DidFailCompositionCallback = ({ errors, serviceList, compositionMetadata, }: {
    readonly errors: GraphQLError[];
    readonly serviceList: ServiceDefinition[];
    readonly compositionMetadata?: CompositionMetadata;
}) => void;
export interface Experimental_CompositionInfo {
    serviceDefinitions: ServiceDefinition[];
    schema: GraphQLSchema;
    compositionMetadata?: CompositionMetadata;
}
export declare type Experimental_DidUpdateCompositionCallback = (currentConfig: Experimental_CompositionInfo, previousConfig?: Experimental_CompositionInfo) => void;
export declare type Experimental_UpdateServiceDefinitions = (config: GatewayConfig) => Promise<{
    serviceDefinitions?: ServiceDefinition[];
    compositionMetadata?: CompositionMetadata;
    isNewSchema: boolean;
}>;
export declare const GCS_RETRY_COUNT = 5;
export declare function getDefaultGcsFetcher(): import("make-fetch-happen").Fetcher;
export declare const HEALTH_CHECK_QUERY = "query __ApolloServiceHealthCheck__ { __typename }";
export declare const SERVICE_DEFINITION_QUERY = "query __ApolloGetServiceDefinition__ { _service { sdl } }";
export declare class ApolloGateway implements GraphQLService {
    schema?: ComposedGraphQLSchema;
    protected serviceMap: DataSourceMap;
    protected config: GatewayConfig;
    private logger;
    protected queryPlanStore?: InMemoryLRUCache<QueryPlan>;
    private apolloConfig?;
    private pollingTimer?;
    private onSchemaChangeListeners;
    private serviceDefinitions;
    private compositionMetadata?;
    private serviceSdlCache;
    private warnedStates;
    private queryPlannerPointer?;
    private fetcher;
    protected experimental_didResolveQueryPlan?: Experimental_DidResolveQueryPlanCallback;
    protected experimental_didFailComposition?: Experimental_DidFailCompositionCallback;
    protected experimental_didUpdateComposition?: Experimental_DidUpdateCompositionCallback;
    protected updateServiceDefinitions: Experimental_UpdateServiceDefinitions;
    protected experimental_pollInterval?: number;
    private experimental_approximateQueryPlanStoreMiB?;
    constructor(config?: GatewayConfig);
    cleanup(): void;
    load(options?: {
        apollo?: ApolloConfig;
        engine?: GraphQLServiceEngineConfig;
    }): Promise<{
        schema: ComposedGraphQLSchema;
        executor: <TContext>(requestContext: GraphQLRequestContextExecutionDidStart<TContext>) => Promise<GraphQLExecutionResult>;
    }>;
    protected updateComposition(): Promise<void>;
    serviceHealthCheck(serviceMap?: DataSourceMap): Promise<{
        name: string;
        response: import("apollo-server-types").GraphQLResponse;
    }[]>;
    protected createSchema(serviceList: ServiceDefinition[]): {
        schema: ComposedGraphQLSchema;
        composedSdl: string | undefined;
    };
    onSchemaChange(callback: SchemaChangeCallback): Unsubscriber;
    private pollServices;
    private createAndCacheDataSource;
    private createDataSource;
    protected createServices(services: ServiceEndpointDefinition[]): void;
    protected loadServiceDefinitions(config: GatewayConfig): ReturnType<Experimental_UpdateServiceDefinitions>;
    executor: <TContext>(requestContext: GraphQLRequestContextExecutionDidStart<TContext>) => Promise<GraphQLExecutionResult>;
    protected validateIncomingRequest<TContext>(requestContext: GraphQLRequestContextExecutionDidStart<TContext>, operationContext: OperationContext): readonly GraphQLError[];
    private initializeQueryPlanStore;
    stop(): Promise<void>;
}
export { buildQueryPlan, executeQueryPlan, serializeQueryPlan, buildOperationContext, QueryPlan, ServiceMap, };
export * from './datasources';
//# sourceMappingURL=index.d.ts.map