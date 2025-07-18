"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MDImageQuality = exports.URLBuilder = exports.MDHomepageSections = exports.MDRatings = exports.MDLanguages = void 0;
class MDLanguagesClass {
    constructor() {
        this.Languages = [
            {
                // Arabic
                name: 'اَلْعَرَبِيَّةُ',
                MDCode: 'ar',
                flagCode: '🇦🇪'
            },
            {
                // Bulgarian
                name: 'български',
                MDCode: 'bg',
                flagCode: '🇧🇬'
            },
            {
                // Bengali
                name: 'বাংলা',
                MDCode: 'bn',
                flagCode: '🇧🇩'
            },
            {
                // Catalan
                name: 'Català',
                MDCode: 'ca',
                flagCode: '🇪🇸'
            },
            {
                // Czech
                name: 'Čeština',
                MDCode: 'cs',
                flagCode: '🇨🇿'
            },
            {
                // Danish
                name: 'Dansk',
                MDCode: 'da',
                flagCode: '🇩🇰'
            },
            {
                // German
                name: 'Deutsch',
                MDCode: 'de',
                flagCode: '🇩🇪'
            },
            {
                // English
                name: 'English',
                MDCode: 'en',
                flagCode: '🇬🇧',
                default: true
            },
            {
                // Spanish
                name: 'Español',
                MDCode: 'es',
                flagCode: '🇪🇸'
            },
            {
                // Spanish (Latin American)
                name: 'Español (Latinoamérica)',
                MDCode: 'es-la',
                flagCode: '🇪🇸'
            },
            {
                // Farsi
                name: 'فارسی',
                MDCode: 'fa',
                flagCode: '🇮🇷'
            },
            {
                // Finnish
                name: 'Suomi',
                MDCode: 'fi',
                flagCode: '🇫🇮'
            },
            {
                // French
                name: 'Français',
                MDCode: 'fr',
                flagCode: '🇫🇷'
            },
            {
                // Hebrew
                name: 'עִבְרִית',
                MDCode: 'he',
                flagCode: '🇮🇱'
            },
            {
                // Hindi
                name: 'हिन्दी',
                MDCode: 'hi',
                flagCode: '🇮🇳'
            },
            {
                // Hungarian
                name: 'Magyar',
                MDCode: 'hu',
                flagCode: '🇭🇺'
            },
            {
                // Indonesian
                name: 'Indonesia',
                MDCode: 'id',
                flagCode: '🇮🇩'
            },
            {
                // Italian
                name: 'Italiano',
                MDCode: 'it',
                flagCode: '🇮🇹'
            },
            {
                // Japanese
                name: '日本語',
                MDCode: 'ja',
                flagCode: '🇯🇵'
            },
            {
                // Korean
                name: '한국어',
                MDCode: 'ko',
                flagCode: '🇰🇷'
            },
            {
                // Lithuanian
                name: 'Lietuvių',
                MDCode: 'lt',
                flagCode: '🇱🇹'
            },
            {
                // Mongolian
                name: 'монгол',
                MDCode: 'mn',
                flagCode: '🇲🇳'
            },
            {
                // Malay
                name: 'Melayu',
                MDCode: 'ms',
                flagCode: '🇲🇾'
            },
            {
                // Burmese
                name: 'မြန်မာဘာသာ',
                MDCode: 'my',
                flagCode: '🇲🇲'
            },
            {
                // Dutch
                name: 'Nederlands',
                MDCode: 'nl',
                flagCode: '🇳🇱'
            },
            {
                // Norwegian
                name: 'Norsk',
                MDCode: 'no',
                flagCode: '🇳🇴'
            },
            {
                // Polish
                name: 'Polski',
                MDCode: 'pl',
                flagCode: '🇵🇱'
            },
            {
                // Portuguese
                name: 'Português',
                MDCode: 'pt',
                flagCode: '🇵🇹'
            },
            {
                // Portuguese (Brazilian)
                name: 'Português (Brasil)',
                MDCode: 'pt-br',
                flagCode: '🇧🇷'
            },
            {
                // Romanian
                name: 'Română',
                MDCode: 'ro',
                flagCode: '🇷🇴'
            },
            {
                // Russian
                name: 'Pусский',
                MDCode: 'ru',
                flagCode: '🇷🇺'
            },
            {
                // Serbian
                name: 'Cрпски',
                MDCode: 'sr',
                flagCode: '🇷🇸'
            },
            {
                // Swedish
                name: 'Svenska',
                MDCode: 'sv',
                flagCode: '🇸🇪'
            },
            {
                // Thai
                name: 'ไทย',
                MDCode: 'th',
                flagCode: '🇹🇭'
            },
            {
                // Tagalog
                name: 'Filipino',
                MDCode: 'tl',
                flagCode: '🇵🇭'
            },
            {
                // Turkish
                name: 'Türkçe',
                MDCode: 'tr',
                flagCode: '🇹🇷'
            },
            {
                // Ukrainian
                name: 'Yкраї́нська',
                MDCode: 'uk',
                flagCode: '🇺🇦'
            },
            {
                // Vietnamese
                name: 'Tiếng Việt',
                MDCode: 'vi',
                flagCode: '🇻🇳'
            },
            {
                // Chinese (Simplified)
                name: '中文 (简化字)',
                MDCode: 'zh',
                flagCode: '🇨🇳'
            },
            {
                // Chinese (Traditional)
                name: '中文 (繁體字)',
                MDCode: 'zh-hk',
                flagCode: '🇭🇰'
            }
        ];
        // Sorts the languages based on name
        this.Languages = this.Languages.sort((a, b) => (a.name > b.name ? 1 : -1));
    }
    getMDCodeList() {
        return this.Languages.map((Language) => Language.MDCode);
    }
    getName(MDCode) {
        return (this.Languages.filter((Language) => Language.MDCode == MDCode)[0]?.name ?? 'Unknown');
    }
    getFlagCode(MDCode) {
        return (this.Languages.filter((Language) => Language.MDCode == MDCode)[0]?.flagCode ?? '_unknown');
    }
    getDefault() {
        return this.Languages.filter((Language) => Language.default).map((Language) => Language.MDCode);
    }
}
exports.MDLanguages = new MDLanguagesClass();
class MDContentRatingClass {
    constructor() {
        this.Ratings = [
            {
                name: 'Safe',
                enum: 'safe',
                default: true
            },
            {
                name: 'Suggestive',
                enum: 'suggestive'
            },
            {
                name: 'Erotica',
                enum: 'erotica'
            },
            {
                name: 'Pornographic',
                enum: 'pornographic'
            }
        ];
    }
    getEnumList() {
        return this.Ratings.map((Rating) => Rating.enum);
    }
    getName(ratingEum) {
        return (this.Ratings.filter((Rating) => Rating.enum == ratingEum)[0]?.name ?? '');
    }
    getDefault() {
        return this.Ratings.filter((Rating) => Rating.default).map((Rating) => Rating.enum);
    }
}
exports.MDRatings = new MDContentRatingClass();
class MDHomepageSectionsClass {
    constructor() {
        this.Sections = [
            {
                name: 'Seasonal',
                enum: 'seasonal',
                default: true
            },
            {
                name: 'Popular',
                enum: 'popular',
                default: true
            },
            {
                name: 'Latest Updates',
                enum: 'latest_updates',
                default: true
            }
        ];
    }
    getEnumList() {
        return this.Sections.map((Sections) => Sections.enum);
    }
    getName(sectionsEnum) {
        return (this.Sections.filter((Sections) => Sections.enum == sectionsEnum)[0]?.name ?? '');
    }
    getDefault() {
        return this.Sections.filter((Sections) => Sections.default).map((Sections) => Sections.enum);
    }
}
exports.MDHomepageSections = new MDHomepageSectionsClass();
class URLBuilder {
    constructor(baseUrl) {
        this.parameters = {};
        this.pathComponents = [];
        this.baseUrl = baseUrl.replace(/(^\/)?(?=.*)(\/$)?/gim, '');
    }
    addPathComponent(component) {
        this.pathComponents.push(component.replace(/(^\/)?(?=.*)(\/$)?/gim, ''));
        return this;
    }
    addQueryParameter(key, value) {
        this.parameters[key] = value;
        return this;
    }
    buildUrl({ addTrailingSlash, includeUndefinedParameters } = {
        addTrailingSlash: false,
        includeUndefinedParameters: false
    }) {
        let finalUrl = this.baseUrl + '/';
        finalUrl += this.pathComponents.join('/');
        finalUrl += addTrailingSlash ? '/' : '';
        finalUrl += Object.values(this.parameters).length > 0 ? '?' : '';
        finalUrl += Object.entries(this.parameters)
            .map((entry) => {
            if (!entry[1] && !includeUndefinedParameters) {
                return undefined;
            }
            if (Array.isArray(entry[1])) {
                return entry[1]
                    .map((value) => value || includeUndefinedParameters
                    ? `${entry[0]}[]=${value}`
                    : undefined)
                    .filter((x) => x !== undefined)
                    .join('&');
            }
            if (typeof entry[1] === 'object') {
                return Object.keys(entry[1])
                    .map((key) => entry[1][key] || includeUndefinedParameters
                    ? `${entry[0]}[${key}]=${entry[1][key]}`
                    : undefined)
                    .filter((x) => x !== undefined)
                    .join('&');
            }
            return `${entry[0]}=${entry[1]}`;
        })
            .filter((x) => x !== undefined)
            .join('&');
        return finalUrl;
    }
}
exports.URLBuilder = URLBuilder;
class MDImageQualityClass {
    constructor() {
        this.ImageQualities = [
            {
                name: 'Source (Original/Best)',
                enum: 'source',
                ending: '',
                default: ['manga']
            },
            {
                name: '<= 512px',
                enum: '512',
                ending: '.512.jpg'
            },
            {
                name: '<= 256px',
                enum: '256',
                ending: '.256.jpg',
                default: ['homepage', 'search']
            }
        ];
    }
    getEnumList() {
        return this.ImageQualities.map((ImageQuality) => ImageQuality.enum);
    }
    getName(imageQualityEnum) {
        return (this.ImageQualities.filter((ImageQuality) => ImageQuality.enum == imageQualityEnum)[0]?.name ?? '');
    }
    getEnding(imageQualityEnum) {
        return (this.ImageQualities.filter((ImageQuality) => ImageQuality.enum == imageQualityEnum)[0]?.ending ?? '');
    }
    getDefault(section) {
        return (this.ImageQualities.filter((ImageQuality) => ImageQuality.default?.includes(section)).map((ImageQuality) => ImageQuality.enum)[0] ?? '');
    }
}
exports.MDImageQuality = new MDImageQualityClass();
//# sourceMappingURL=VivicomiHelper.js.map