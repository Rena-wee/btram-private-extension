export interface requestMetadata {
    offset?: number;
    collectedIds?: string[];
}
interface Language {
    name: string;
    MDCode: string;
    flagCode: string;
    default?: boolean;
}
declare class MDLanguagesClass {
    Languages: Language[];
    constructor();
    getMDCodeList(): string[];
    getName(MDCode: string): string;
    getFlagCode(MDCode: string): string;
    getDefault(): string[];
}
export declare const MDLanguages: MDLanguagesClass;
interface Rating {
    name: string;
    enum: string;
    default?: true;
}
declare class MDContentRatingClass {
    Ratings: Rating[];
    getEnumList(): string[];
    getName(ratingEum: string): string;
    getDefault(): string[];
}
export declare const MDRatings: MDContentRatingClass;
interface HomePageSection {
    name: string;
    enum: string;
    default?: true;
}
declare class MDHomepageSectionsClass {
    Sections: HomePageSection[];
    getEnumList(): string[];
    getName(sectionsEnum: string): string;
    getDefault(): string[];
}
export declare const MDHomepageSections: MDHomepageSectionsClass;
export declare class URLBuilder {
    parameters: Record<string, any | any[]>;
    pathComponents: string[];
    baseUrl: string;
    constructor(baseUrl: string);
    addPathComponent(component: string): URLBuilder;
    addQueryParameter(key: string, value: any | any[]): URLBuilder;
    buildUrl({ addTrailingSlash, includeUndefinedParameters }?: {
        addTrailingSlash: boolean;
        includeUndefinedParameters: boolean;
    }): string;
}
interface ImageQuality {
    name: string;
    enum: string;
    ending: string;
    default?: string[];
}
declare class MDImageQualityClass {
    ImageQualities: ImageQuality[];
    getEnumList(): string[];
    getName(imageQualityEnum: string): string;
    getEnding(imageQualityEnum: string): string;
    getDefault(section: string): string;
}
export declare const MDImageQuality: MDImageQualityClass;
export {};
//# sourceMappingURL=YuriGardenHelper.d.ts.map