import { ASTNode, FieldNode, GraphQLNullableType, ListTypeNode, NamedTypeNode, SelectionNode } from 'graphql';
export declare function getResponseName(node: FieldNode): string;
export declare function allNodesAreOfSameKind<T extends ASTNode>(firstNode: T, remainingNodes: ASTNode[]): remainingNodes is T[];
export declare function astFromType(type: GraphQLNullableType): NamedTypeNode | ListTypeNode;
export declare function printWithReducedWhitespace(ast: ASTNode): string;
export declare function parseSelections(source: string): ReadonlyArray<SelectionNode>;
//# sourceMappingURL=graphql.d.ts.map