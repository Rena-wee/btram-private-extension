import {
    Chapter,
    ChapterDetails,
    HomeSection,
    HomeSectionType,
    PartialSourceManga,
    SourceManga,
    Tag,
    TagSection
} from '@paperback/types'

import { CuuTruyenGenres } from './CuuTruyenHelper'
import entities = require('entities')
import { CheerioAPI } from 'cheerio'

/**
 * Manga Details Page
 */
export const parseMangaDetails = ($: CheerioAPI, mangaId: string): SourceManga => {
    const titles: string[] = []
    const mainTitle = $('h1.detail-title').text().trim()
    titles.push(decodeHTMLEntity(mainTitle))
    const altTitles = $('.detail-info .other-name').text().split(';').map(t => t.trim()).filter(t => t)
    titles.push(...altTitles.map(decodeHTMLEntity))

    const author = $('.detail-info span:contains("Tác giả")').next().text().trim()
    const artist = $('.detail-info span:contains("Họa sĩ")').next().text().trim()
    const description = decodeHTMLEntity($('.detail-content p').text().trim())

    const arrayTags: Tag[] = []
    $('.detail-info a.genre-item').each((_, el) => {
        const label = $(el).text().trim()
        const id = encodeURI(CuuTruyenGenres.getParam(label) ?? label)
        if (label && id) arrayTags.push({ id, label })
    })

    const statusText = $('.detail-info span:contains("Tình trạng")').next().text().trim().toLowerCase()
    let status = 'Ongoing'
    if (statusText.includes('hoàn thành')) status = 'Completed'
    if (statusText.includes('tạm ngưng')) status = 'Hiatus'

    const tagSections: TagSection[] = [App.createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(App.createTag) })]

    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            titles,
            image: parseThumbnailUrl($),
            author,
            artist,
            desc: description,
            status,
            tags: tagSections
        })
    })
}

/**
 * Chapter List
 */
export const parseChapterList = ($: CheerioAPI, mangaId: string): Chapter[] => {
    const chapters: Chapter[] = []
    let sortingIndex = 0
    $('.list-chapters li').each((_, el) => {
        const a = $('a', el)
        const chapterId = a.attr('href')?.split('/').pop()
        if (!chapterId) return

        const name = a.text().trim()
        const timeText = $('.chapter-time', el).attr('title')
        const date = timeText ? new Date(timeText) : new Date()

        const match = name.match(/Ch(?:apter)?\s?(\d+(?:\.\d+)?)/i)
        const chapNum = match?.[1] ? parseFloat(match[1]) : 0

        chapters.push(App.createChapter({
            id: chapterId,
            name,
            chapNum,
            langCode: '🇻🇳',
            time: date,
            sortingIndex
        }))
        sortingIndex--
    })

    return chapters.reverse()
}

/**
 * Chapter Details
 */
export const parseChapterDetails = ($: CheerioAPI, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []
    $('.reading-detail .page-chapter img').each((_, el) => {
        const src = $(el).attr('src')?.trim()
        if (src) pages.push(src)
    })

    return App.createChapterDetails({
        id: chapterId,
        mangaId,
        pages
    })
}

/**
 * Home Sections
 */
export const parseHomeSections = ($: CheerioAPI, sectionCallback: (section: HomeSection) => void): void => {
    const popularSection = App.createHomeSection({
        id: 'popular',
        title: 'Truyện Đề Cử',
        containsMoreItems: true,
        type: HomeSectionType.singleRowLarge
    })
    const latestSection = App.createHomeSection({
        id: 'latest',
        title: 'Mới Cập Nhật',
        containsMoreItems: true,
        type: HomeSectionType.singleRowNormal
    })

    const popularItems: PartialSourceManga[] = []
    $('.section-popular .manga-item').each((_, el) => {
        const id = $('a', el).attr('href')?.split('/').pop()
        const title = $('.manga-title', el).text().trim()
        const image = $('img', el).attr('data-src') ?? ''
        if (id && title) {
            popularItems.push(App.createPartialSourceManga({
                mangaId: id,
                title: decodeHTMLEntity(title),
                image
            }))
        }
    })
    popularSection.items = popularItems
    sectionCallback(popularSection)

    const latestItems: PartialSourceManga[] = []
    $('.section-latest .manga-item').each((_, el) => {
        const id = $('a', el).attr('href')?.split('/').pop()
        const title = $('.manga-title', el).text().trim()
        const image = $('img', el).attr('data-src') ?? ''
        if (id && title) {
            latestItems.push(App.createPartialSourceManga({
                mangaId: id,
                title: decodeHTMLEntity(title),
                image
            }))
        }
    })
    latestSection.items = latestItems
    sectionCallback(latestSection)
}

/**
 * View More
 */
export const parseViewMore = ($: CheerioAPI): PartialSourceManga[] => {
    const mangas: PartialSourceManga[] = []
    $('.manga-list .manga-item').each((_, el) => {
        const id = $('a', el).attr('href')?.split('/').pop()
        const title = $('.manga-title', el).text().trim()
        const image = $('img', el).attr('data-src') ?? ''
        if (id && title) {
            mangas.push(App.createPartialSourceManga({
                mangaId: id,
                title: decodeHTMLEntity(title),
                image
            }))
        }
    })
    return mangas
}

/**
 * Search Results
 */
export const parseSearch = ($: CheerioAPI): PartialSourceManga[] => {
    const mangas: PartialSourceManga[] = []
    $('.search-results .manga-item').each((_, el) => {
        const id = $('a', el).attr('href')?.split('/').pop()
        const title = $('.manga-title', el).text().trim()
        const image = $('img', el).attr('data-src') ?? ''
        if (id && title) {
            mangas.push(App.createPartialSourceManga({
                mangaId: id,
                title: decodeHTMLEntity(title),
                image
            }))
        }
    })
    return mangas
}

/**
 * Tags (reuses all genres)
 */
export const parseTags = (): TagSection[] => {
    const tags = CuuTruyenGenres.getGenresList().map(label => {
        const id = encodeURI(CuuTruyenGenres.getParam(label) ?? label)
        return App.createTag({ id, label })
    })
    return [App.createTagSection({ id: '0', label: 'Genres', tags })]
}

/**
 * Helper: Extract cover image
 */
export const parseThumbnailUrl = ($: CheerioAPI): string => {
    return $('.detail-cover img').attr('src') ?? ''
}

/**
 * Pagination
 */
export const isLastPage = ($: CheerioAPI): boolean => {
    return $('.pagination li.active').next().length === 0
}

/**
 * HTML decode
 */
const decodeHTMLEntity = (str: string): string => {
    return entities.decodeHTML(str)
}
