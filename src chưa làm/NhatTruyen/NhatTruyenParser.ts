import { PartialSourceManga } from '@paperback/types'
import { MDImageQuality } from './NhatTruyenHelper'
import { MangaItem, CuuTruyenSearchResponse } from './NhatTruyenInterfaces'

export const parseMangaList = async (
    response: CuuTruyenSearchResponse['data'],
    source: any,
    thumbnailSelector: any
): Promise<PartialSourceManga[]> => {
    const results: PartialSourceManga[] = []
    const mangaArray = response.results

    for (const manga of mangaArray) {
        const mangaId = manga.id
        const mangaDetails = manga.attributes
        const title = source.decodeHTMLEntity(
            mangaDetails.title.en ??
            mangaDetails.altTitles
                .map((x: any) => Object.values(x).find((v: any) => v !== undefined))
                .find((t: any) => t !== undefined)
        )
        const coverFileName = manga.relationships
            .filter((x: any) => x.type == 'cover_art')
            .map((x: any) => x.attributes?.fileName)[0]
        const image = coverFileName
            ? `${source.COVER_BASE_URL}/${mangaId}/${coverFileName}${MDImageQuality.getEnding(await thumbnailSelector(source.stateManager))}`
            : 'https://mangadex.org/_nuxt/img/cover-placeholder.d12c3c5.jpg'
        const subtitle = `${mangaDetails.lastVolume ? `Vol. ${mangaDetails.lastVolume}` : ''} ${mangaDetails.lastChapter ? `Ch. ${mangaDetails.lastChapter}` : ''}`

        results.push(
            App.createPartialSourceManga({
                mangaId: mangaId,
                title: title,
                image: image,
                subtitle: subtitle
            })
        )
    }
    return results
}
