import { RequestManager, SourceStateManager } from '@paperback/types';
export declare function getLanguages(stateManager: SourceStateManager): Promise<any>;
export declare function getRatings(stateManager: SourceStateManager): Promise<any>;
export declare function getDataSaver(stateManager: SourceStateManager): Promise<any>;
export declare function getSkipSameChapter(stateManager: SourceStateManager): Promise<any>;
export declare function forcePort443(stateManager: SourceStateManager): Promise<any>;
export declare function getHomepageThumbnail(stateManager: SourceStateManager): Promise<any>;
export declare function getSearchThumbnail(stateManager: SourceStateManager): Promise<any>;
export declare function getMangaThumbnail(stateManager: SourceStateManager): Promise<any>;
export declare function getAccessToken(stateManager: SourceStateManager): Promise<{
    accessToken: string;
    refreshToken: string | undefined;
    tokenBody: any;
} | undefined>;
export declare function saveAccessToken(stateManager: SourceStateManager, accessToken: string | undefined, refreshToken: string | undefined): Promise<{
    accessToken: string;
    refreshToken: string | undefined;
    tokenBody: any;
} | undefined>;
export declare function contentSettings(stateManager: SourceStateManager): import("@paperback/types").DUINavigationButton;
export declare function parseAccessToken(accessToken: string | undefined): Promise<any>;
export declare function authEndpointRequest(requestManager: RequestManager, endpoint: 'login' | 'refresh' | 'logout', payload: any): Promise<any>;
export declare function accountSettings(stateManager: SourceStateManager, requestManager: RequestManager): Promise<import("@paperback/types").DUINavigationButton>;
export declare function thumbnailSettings(stateManager: SourceStateManager): import("@paperback/types").DUINavigationButton;
export declare function resetSettings(stateManager: SourceStateManager): import("@paperback/types").DUIButton;
//# sourceMappingURL=VivicomiSettings.d.ts.map