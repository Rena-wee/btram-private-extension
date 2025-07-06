"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMangaList = void 0;
const VivicomiHelper_1 = require("./VivicomiHelper");
const parseMangaList = async (response, source, thumbnailSelector) => {
    const results = [];
    const mangaArray = response.results;
    for (const manga of mangaArray) {
        const mangaId = manga.id;
        const mangaDetails = manga.attributes;
        const title = source.decodeHTMLEntity(mangaDetails.title.en ??
            mangaDetails.altTitles
                .map((x) => Object.values(x).find((v) => v !== undefined))
                .find((t) => t !== undefined));
        const coverFileName = manga.relationships
            .filter((x) => x.type == 'cover_art')
            .map((x) => x.attributes?.fileName)[0];
        const image = coverFileName
            ? `${source.COVER_BASE_URL}/${mangaId}/${coverFileName}${VivicomiHelper_1.MDImageQuality.getEnding(await thumbnailSelector(source.stateManager))}`
            : 'https://mangadex.org/_nuxt/img/cover-placeholder.d12c3c5.jpg';
        const subtitle = `${mangaDetails.lastVolume ? `Vol. ${mangaDetails.lastVolume}` : ''} ${mangaDetails.lastChapter ? `Ch. ${mangaDetails.lastChapter}` : ''}`;
        results.push(App.createPartialSourceManga({
            mangaId: mangaId,
            title: title,
            image: image,
            subtitle: subtitle
        }));
    }
    return results;
};
exports.parseMangaList = parseMangaList;
//# sourceMappingURL=VivicomiParser.js.map