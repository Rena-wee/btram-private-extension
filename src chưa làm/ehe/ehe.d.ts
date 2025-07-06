import { CheerioAPI } from 'cheerio';
import { Chapter, ChapterDetails, ChapterProviding, DUISection, HomePageSectionsProviding, HomeSection, MangaProviding, PagedResults, Request, SearchRequest, SearchResultsProviding, SourceInfo, SourceManga, TagSection } from '@paperback/types';
import { Metadata } from './eheHelper';
export declare const BatoToInfo: SourceInfo;
export declare class BatoTo implements SearchResultsProviding, MangaProviding, ChapterProviding, HomePageSectionsProviding {
    private cheerio;
    constructor(cheerio: CheerioAPI);
    requestManager: import("@paperback/types").RequestManager;
    stateManager: import("@paperback/types").SourceStateManager;
    getSourceMenu(): Promise<DUISection>;
    getMangaShareUrl(mangaId: string): string;
    getMangaDetails(mangaId: string): Promise<SourceManga>;
    getChapters(mangaId: string): Promise<Chapter[]>;
    getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails>;
    getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void>;
    getViewMoreItems(homepageSectionId: string, metadata: Metadata | undefined): Promise<PagedResults>;
    getSearchResults(query: SearchRequest, metadata: Metadata | undefined): Promise<PagedResults>;
    getSearchTags(): Promise<TagSection[]>;
    getThumbnailUrl(mangaId: string): Promise<string>;
    CloudFlareError(status: number): void;
    getCloudflareBypassRequestAsync(): Promise<Request>;
}
//# sourceMappingURL=ehe.d.ts.map