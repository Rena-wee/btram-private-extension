export interface MangaItem {
    id: string;
    title: string;
    coverUrl?: string;
    author?: string;
    artist?: string;
    description?: string;
    status?: 'Ongoing' | 'Completed' | 'Hiatus';
    tags?: string[];
    lastUpdated?: string;
}
export interface ChapterItem {
    id: string;
    title: string;
    chapterNumber?: number;
    volumeNumber?: number;
    language?: string;
    pages?: number;
    releaseDate?: string;
}
export interface CuuTruyenSearchResponse {
    data: {
        total: number;
        results: any[];
    };
}
//# sourceMappingURL=VivicomiInterfaces.d.ts.map