"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatoTo = exports.BatoToInfo = void 0;
const types_1 = require("@paperback/types");
const eheParser_1 = require("./eheParser");
const eheHelper_1 = require("./eheHelper");
const eheSettings_1 = require("./eheSettings");
const BATO_DOMAIN = 'https://batocomic.org';
exports.BatoToInfo = {
    version: '3.1.4',
    name: 'BatoTo',
    icon: 'icon.png',
    author: 'niclimcy',
    authorWebsite: 'https://github.com/niclimcy',
    description: 'Extension that pulls manga from bato.to',
    contentRating: types_1.ContentRating.MATURE,
    websiteBaseURL: BATO_DOMAIN,
    sourceTags: [
        {
            text: 'Multi Language',
            type: types_1.BadgeColor.BLUE
        }
    ],
    intents: types_1.SourceIntents.MANGA_CHAPTERS | types_1.SourceIntents.HOMEPAGE_SECTIONS | types_1.SourceIntents.SETTINGS_UI | types_1.SourceIntents.CLOUDFLARE_BYPASS_REQUIRED
};
class BatoTo {
    constructor(cheerio) {
        this.cheerio = cheerio;
        this.requestManager = App.createRequestManager({
            requestsPerSecond: 4,
            requestTimeout: 15000,
            interceptor: {
                interceptRequest: async (request) => {
                    request.headers = {
                        ...(request.headers ?? {}),
                        ...{
                            'referer': `${BATO_DOMAIN}/`,
                            'user-agent': await this.requestManager.getDefaultUserAgent()
                        }
                    };
                    if (request.url.includes('mangaId=')) {
                        const mangaId = request.url.replace('mangaId=', '');
                        if (mangaId)
                            request.url = await this.getThumbnailUrl(mangaId);
                    }
                    return request;
                },
                interceptResponse: async (response) => {
                    return response;
                }
            }
        });
        this.stateManager = App.createSourceStateManager();
    }
    async getSourceMenu() {
        return Promise.resolve(App.createDUISection({
            id: 'main',
            header: 'Source Settings',
            isHidden: false,
            rows: async () => [
                (0, eheSettings_1.languageSettings)(this.stateManager),
                (0, eheSettings_1.resetSettings)(this.stateManager)
            ]
        }));
    }
    getMangaShareUrl(mangaId) { return `${BATO_DOMAIN}/series/${mangaId}`; }
    async getMangaDetails(mangaId) {
        const request = App.createRequest({
            url: `${BATO_DOMAIN}/series/${mangaId}`,
            method: 'GET'
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        return (0, eheParser_1.parseMangaDetails)($, mangaId);
    }
    async getChapters(mangaId) {
        const request = App.createRequest({
            url: `${BATO_DOMAIN}/series/${mangaId}`,
            method: 'GET'
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        return (0, eheParser_1.parseChapterList)($, mangaId);
    }
    async getChapterDetails(mangaId, chapterId) {
        const request = App.createRequest({
            url: `${BATO_DOMAIN}/chapter/${chapterId}`,
            method: 'GET'
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        return (0, eheParser_1.parseChapterDetails)($, mangaId, chapterId);
    }
    async getHomePageSections(sectionCallback) {
        const request = App.createRequest({
            url: `${BATO_DOMAIN}`,
            method: 'GET'
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        (0, eheParser_1.parseHomeSections)($, sectionCallback);
    }
    async getViewMoreItems(homepageSectionId, metadata) {
        const page = metadata?.page ?? 1;
        let param = '';
        switch (homepageSectionId) {
            case 'popular_updates':
                param = `?sort=views_d.za&page=${page}`;
                break;
            case 'latest_releases':
                param = `?sort=update.za&page=${page}`;
                break;
            default:
                throw new Error('Requested to getViewMoreItems for a section ID which doesn\'t exist');
        }
        const langHomeFilter = await this.stateManager.retrieve('language_home_filter') ?? false;
        const langs = await this.stateManager.retrieve('languages') ?? eheHelper_1.BTLanguages.getDefault();
        param += langHomeFilter ? `&langs=${langs.join(',')}` : '';
        const request = App.createRequest({
            url: `${BATO_DOMAIN}/browse`,
            method: 'GET',
            param
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        const manga = (0, eheParser_1.parseViewMore)($);
        metadata = !(0, eheParser_1.isLastPage)($) ? { page: page + 1 } : undefined;
        return App.createPagedResults({
            results: manga,
            metadata
        });
    }
    async getSearchResults(query, metadata) {
        const page = metadata?.page ?? 1;
        let request;
        // Regular search
        if (query.title) {
            request = App.createRequest({
                url: `${BATO_DOMAIN}/search?word=${encodeURI(query.title ?? '')}&page=${page}`,
                method: 'GET'
            });
            // Tag Search
        }
        else {
            request = App.createRequest({
                url: `${BATO_DOMAIN}/browse?genres=${query?.includedTags?.map((x) => x.id)[0]}&page=${page}`,
                method: 'GET'
            });
        }
        const langSearchFilter = await this.stateManager.retrieve('language_search_filter') ?? false;
        const langs = await this.stateManager.retrieve('languages') ?? eheHelper_1.BTLanguages.getDefault();
        const response = await this.requestManager.schedule(request, 1);
        const $ = this.cheerio.load(response.data);
        const manga = (0, eheParser_1.parseSearch)($, langSearchFilter, langs);
        metadata = !(0, eheParser_1.isLastPage)($) ? { page: page + 1 } : undefined;
        return App.createPagedResults({
            results: manga,
            metadata
        });
    }
    async getSearchTags() {
        return (0, eheParser_1.parseTags)();
    }
    async getThumbnailUrl(mangaId) {
        const request = App.createRequest({
            url: `${BATO_DOMAIN}/series/${mangaId}`,
            method: 'GET'
        });
        const response = await this.requestManager.schedule(request, 1);
        this.CloudFlareError(response.status);
        const $ = this.cheerio.load(response.data);
        return (0, eheParser_1.parseThumbnailUrl)($);
    }
    CloudFlareError(status) {
        if (status == 503 || status == 403) {
            throw new Error(`CLOUDFLARE BYPASS ERROR:\nPlease go to the homepage of <${BatoTo.name}> and press the cloud icon.`);
        }
    }
    async getCloudflareBypassRequestAsync() {
        return App.createRequest({
            url: BATO_DOMAIN,
            method: 'GET',
            headers: {
                'referer': `${BATO_DOMAIN}/`,
                'user-agent': await this.requestManager.getDefaultUserAgent()
            }
        });
    }
}
exports.BatoTo = BatoTo;
//# sourceMappingURL=ehe.js.map