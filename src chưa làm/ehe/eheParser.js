"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLastPage = exports.parseThumbnailUrl = exports.parseSearch = exports.parseTags = exports.parseViewMore = exports.parseHomeSections = exports.parseChapterDetails = exports.parseChapterList = exports.parseMangaDetails = void 0;
const types_1 = require("@paperback/types");
const eheHelper_1 = require("./eheHelper");
const crypto_js_1 = __importDefault(require("crypto-js"));
const entities = require("entities");
const parseMangaDetails = ($, mangaId) => {
    const titles = [];
    titles.push(decodeHTMLEntity($('a', $('.item-title')).text().trim()));
    const altTitles = $('.alias-set').text().trim().split('/');
    for (const title of altTitles) {
        titles.push(decodeHTMLEntity(title));
    }
    const description = decodeHTMLEntity($('.limit-html').text().trim());
    const authorElement = $('div.attr-item b:contains("Authors")').next('span');
    const author = authorElement.length ? authorElement.children().map((_, e) => $(e).text().trim()).toArray().join(', ') : '';
    const artistElement = $('div.attr-item b:contains("Artists")').next('span');
    const artist = artistElement.length ? artistElement.children().map((_, e) => $(e).text().trim()).toArray().join(', ') : '';
    const arrayTags = [];
    for (const tag of $('div.attr-item b:contains("Genres")').next('span').children().toArray()) {
        const label = $(tag).text().trim();
        const id = encodeURI(eheHelper_1.BTGenres.getParam(label) ?? label);
        if (!id || !label)
            continue;
        arrayTags.push({ id, label });
    }
    const tagSections = [App.createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => App.createTag(x)) })];
    const rawStatus = $('div.attr-item b:contains("Upload status")').next('span').text().trim();
    let status = 'Ongoing';
    switch (rawStatus.toUpperCase()) {
        case 'COMPLETED':
            status = 'Completed';
            break;
        case 'HIATUS':
            status = 'Hiatus';
            break;
        default:
            status = 'Ongoing';
            break;
    }
    return App.createSourceManga({
        id: mangaId,
        mangaInfo: App.createMangaInfo({
            titles,
            image: `mangaId=${mangaId}`,
            status,
            author,
            artist,
            tags: tagSections,
            desc: description
        })
    });
};
exports.parseMangaDetails = parseMangaDetails;
const parseChapterList = ($, mangaId) => {
    const chapters = [];
    let sortingIndex = 0;
    for (const chapter of $('div.episode-list div.main .item').toArray()) {
        const title = $('b', chapter).text().trim();
        const chapterId = $('a', chapter).attr('href')?.replace(/\/$/, '')?.split('/').pop() ?? '';
        const group = $('a.ps-3 > span', chapter).text().trim();
        if (!chapterId)
            continue;
        let language = eheHelper_1.BTLanguages.getLangCode($('em').attr('data-lang') ?? '');
        if (language === 'Unknown')
            language = '🇬🇧';
        const timeAgo = $('i.ps-3', chapter).text().trim().split(' ');
        const chapNumRegex = title.match(/(\d+)(?:[-.]\d+)?/);
        let date = new Date();
        if (timeAgo[1] === 'secs')
            date = new Date(Date.now() - 1000 * Number(timeAgo[0]));
        if (timeAgo[1] === 'mins')
            date = new Date(Date.now() - 1000 * 60 * Number(timeAgo[0]));
        if (timeAgo[1] === 'hours')
            date = new Date(Date.now() - 1000 * 3600 * Number(timeAgo[0]));
        if (timeAgo[1] === 'days')
            date = new Date(Date.now() - 1000 * 3600 * 24 * Number(timeAgo[0]));
        let chapNum = (chapNumRegex && chapNumRegex[1]) ? Number(chapNumRegex[1].replace('-', '.')) : 0;
        if (isNaN(chapNum))
            chapNum = 0;
        chapters.push({
            id: chapterId,
            name: title,
            langCode: language,
            chapNum,
            time: date,
            sortingIndex,
            volume: 0,
            group
        });
        sortingIndex--;
    }
    if (chapters.length === 0)
        throw new Error(`Couldn't find any chapters for mangaId: ${mangaId}!`);
    return chapters.map(ch => {
        ch.sortingIndex += chapters.length;
        return App.createChapter(ch);
    });
};
exports.parseChapterList = parseChapterList;
const parseChapterDetails = ($, mangaId, chapterId) => {
    const scriptObj = $('script').toArray().find(obj => {
        const child = obj.children[0];
        const data = (child && 'data' in child) ? child.data ?? '' : '';
        return data.includes('batoPass') && data.includes('batoWord');
    });
    const scriptChild = scriptObj?.children[0];
    const script = (scriptChild && 'data' in scriptChild) ? scriptChild.data ?? '' : '';
    const batoPass = eval(script.match(/const\s+batoPass\s*=\s*(.*?);/)?.[1] ?? '').toString();
    const batoWord = script.match(/const\s+batoWord\s*=\s*"(.*)";/)?.[1] ?? '';
    const imgHttps = script.match(/const\s+imgHttps\s*=\s*(.*?);/)?.[1] ?? '';
    const imgList = JSON.parse(imgHttps);
    const tknList = JSON.parse(crypto_js_1.default.AES.decrypt(batoWord, batoPass).toString(crypto_js_1.default.enc.Utf8));
    const pages = imgList.map((value, i) => `${value}?${tknList[i]}`);
    return App.createChapterDetails({
        id: chapterId,
        mangaId,
        pages
    });
};
exports.parseChapterDetails = parseChapterDetails;
const parseHomeSections = ($, sectionCallback) => {
    const popularSection = App.createHomeSection({
        id: 'popular_updates',
        title: 'Popular Updates',
        containsMoreItems: true,
        type: types_1.HomeSectionType.singleRowLarge
    });
    const latestSection = App.createHomeSection({
        id: 'latest_releases',
        title: 'Latest Releases',
        containsMoreItems: true,
        type: types_1.HomeSectionType.singleRowNormal
    });
    // Popular
    const popularItems = [];
    for (const manga of $('.home-popular .col.item').toArray()) {
        const image = $('img', manga).first().attr('src') ?? '';
        const title = $('.item-title', manga).text().trim();
        const id = $('a', manga).attr('href')?.replace('/series/', '')?.trim().split('/')[0] ?? '';
        const btcode = $('em', manga).attr('data-lang');
        const lang = btcode ? eheHelper_1.BTLanguages.getLangCode(btcode) : '🇬🇧';
        const subtitle = lang + ' ' + $('.item-volch', manga).text().trim();
        if (!id || !title)
            continue;
        popularItems.push(App.createPartialSourceManga({
            image,
            title: decodeHTMLEntity(title),
            mangaId: id,
            subtitle: decodeHTMLEntity(subtitle)
        }));
    }
    popularSection.items = popularItems;
    sectionCallback(popularSection);
    // Latest
    const latestItems = [];
    for (const manga of $('.series-list .col.item').toArray()) {
        const image = $('img', manga).attr('src') ?? '';
        const title = $('.item-title', manga).text().trim();
        const id = $('a', manga).attr('href')?.replace('/series/', '')?.trim().split('/')[0] ?? '';
        const btcode = $('em', manga).attr('data-lang');
        const lang = btcode ? eheHelper_1.BTLanguages.getLangCode(btcode) : '🇬🇧';
        const subtitle = lang + ' ' + $('.item-volch a', manga).text().trim();
        if (!id || !title)
            continue;
        latestItems.push(App.createPartialSourceManga({
            image,
            title: decodeHTMLEntity(title),
            mangaId: id,
            subtitle: decodeHTMLEntity(subtitle)
        }));
    }
    latestSection.items = latestItems;
    sectionCallback(latestSection);
};
exports.parseHomeSections = parseHomeSections;
const parseViewMore = ($) => {
    const mangas = [];
    const collectedIds = [];
    for (const obj of $('.item', '#series-list').toArray()) {
        const id = $('a', obj).attr('href')?.replace('/series/', '').trim().split('/')[0] ?? '';
        const title = $('.item-title', obj).text();
        const btcode = $('em', obj).attr('data-lang');
        const lang = btcode ? eheHelper_1.BTLanguages.getLangCode(btcode) : '🇬🇧';
        const subtitle = lang + ' ' + $('.visited', obj).text().trim();
        const image = $('img', obj).attr('src') ?? '';
        if (!id || !title || collectedIds.includes(id))
            continue;
        mangas.push(App.createPartialSourceManga({
            image,
            title: decodeHTMLEntity(title),
            mangaId: id,
            subtitle: decodeHTMLEntity(subtitle)
        }));
        collectedIds.push(id);
    }
    return mangas;
};
exports.parseViewMore = parseViewMore;
const parseTags = () => {
    const arrayTags = [];
    for (const label of eheHelper_1.BTGenres.getGenresList()) {
        const id = encodeURI(eheHelper_1.BTGenres.getParam(label) ?? label);
        if (!id || !label)
            continue;
        arrayTags.push({ id, label });
    }
    return [App.createTagSection({ id: '0', label: 'genres', tags: arrayTags.map(x => App.createTag(x)) })];
};
exports.parseTags = parseTags;
const parseSearch = ($, langFilter, langs) => {
    const mangas = [];
    for (const obj of $('.item', '#series-list').toArray()) {
        const id = $('.item-cover', obj).attr('href')?.replace('/series/', '').trim().split('/')[0] ?? '';
        const title = $('.item-title', obj).text();
        const btcode = $('em', obj).attr('data-lang') ?? 'en,en_us';
        const lang = btcode ? eheHelper_1.BTLanguages.getLangCode(btcode) : '🇬🇧';
        const subtitle = lang + ' ' + $('.visited', obj).text().trim();
        const image = $('img', obj).attr('src') ?? '';
        if (!id || !title)
            continue;
        if (langFilter && !langs.includes(btcode))
            continue;
        mangas.push(App.createPartialSourceManga({
            image,
            title: decodeHTMLEntity(title),
            mangaId: id,
            subtitle
        }));
    }
    return mangas;
};
exports.parseSearch = parseSearch;
const parseThumbnailUrl = ($) => {
    return $('div.attr-cover img').attr('src') ?? '';
};
exports.parseThumbnailUrl = parseThumbnailUrl;
const isLastPage = ($) => {
    return $('.page-item').last().hasClass('disabled');
};
exports.isLastPage = isLastPage;
const decodeHTMLEntity = (str) => {
    return entities.decodeHTML(str);
};
//# sourceMappingURL=eheParser.js.map