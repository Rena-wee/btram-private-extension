interface Genre {
    name: string;
    param: string;
}
declare class BTGenresClass {
    Genres: Genre[];
    constructor();
    getGenresList(): string[];
    getParam(name: string): string | undefined;
}
export declare const BTGenres: BTGenresClass;
interface Language {
    name: string;
    BTCode: string;
    lang: string;
    default?: boolean;
}
declare class BTLanguagesClass {
    Languages: Language[];
    constructor();
    getBTCodeList(): string[];
    getName(BTCode: string): string;
    getLangCode(BTCode: string): string;
    getDefault(): string[];
}
export declare const BTLanguages: BTLanguagesClass;
export interface Metadata {
    page: number;
}
export {};
//# sourceMappingURL=eheHelper.d.ts.map