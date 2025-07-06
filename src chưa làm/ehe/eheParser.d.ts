import { Chapter, ChapterDetails, HomeSection, PartialSourceManga, SourceManga, TagSection } from '@paperback/types';
import { CheerioAPI } from 'cheerio';
export declare const parseMangaDetails: ($: CheerioAPI, mangaId: string) => SourceManga;
export declare const parseChapterList: ($: CheerioAPI, mangaId: string) => Chapter[];
export declare const parseChapterDetails: ($: CheerioAPI, mangaId: string, chapterId: string) => ChapterDetails;
export declare const parseHomeSections: ($: CheerioAPI, sectionCallback: (section: HomeSection) => void) => void;
export declare const parseViewMore: ($: CheerioAPI) => PartialSourceManga[];
export declare const parseTags: () => TagSection[];
export declare const parseSearch: ($: CheerioAPI, langFilter: boolean, langs: string[]) => PartialSourceManga[];
export declare const parseThumbnailUrl: ($: CheerioAPI) => string;
export declare const isLastPage: ($: CheerioAPI) => boolean;
//# sourceMappingURL=eheParser.d.ts.map