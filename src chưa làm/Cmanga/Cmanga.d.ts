import { PagedResults, SourceManga, Chapter, ChapterDetails, HomeSection, SearchRequest, SourceInfo, TagSection, ChapterProviding, DUISection, SearchResultsProviding, HomePageSectionsProviding } from '@paperback/types';
import { requestMetadata } from './CmangaHelper';
export declare const MangaDexInfo: SourceInfo;
export declare class MangaDex implements ChapterProviding, SearchResultsProviding, HomePageSectionsProviding {
    MANGADEX_DOMAIN: string;
    MANGADEX_API: string;
    COVER_BASE_URL: string;
    stateManager: import("@paperback/types").SourceStateManager;
    requestManager: import("@paperback/types").RequestManager;
    getSourceMenu(): Promise<DUISection>;
    getMangaShareUrl(mangaId: string): string;
    getSearchTags(): Promise<TagSection[]>;
    supportsSearchOperators(): Promise<boolean>;
    supportsTagExclusion(): Promise<boolean>;
    getCustomListRequestURL(listId: string, ratings: string[]): Promise<string>;
    getMangaDetails(mangaId: string): Promise<SourceManga>;
    getChapters(mangaId: string): Promise<Chapter[]>;
    getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails>;
    getSearchResults(query: SearchRequest, metadata: requestMetadata): Promise<PagedResults>;
    getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void>;
    getViewMoreItems(homepageSectionId: string, metadata: requestMetadata): Promise<PagedResults>;
    decodeHTMLEntity(str: string | undefined): string | undefined;
    checkId(id: string): void;
}
//# sourceMappingURL=Cmanga.d.ts.map