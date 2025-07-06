interface Genre {
    name: string;
    param: string;
}

class CuuTruyenGenresClass {
    Genres: Genre[] = [
        { name: 'Action', param: 'hanh-dong' },
        { name: 'Adult', param: 'truyen-18+' },
        { name: 'Adventure', param: 'phieu-luu' },
        { name: 'Comedy', param: 'hai-huoc' },
        { name: 'Cooking', param: 'am-thuc' },
        { name: 'Doujinshi', param: 'doujinshi' },
        { name: 'Drama', param: 'drama' },
        { name: 'Fantasy', param: 'giai-tuong' },
        { name: 'Horror', param: 'kinh-di' },
        { name: 'Isekai', param: 'isekai' },
        { name: 'Josei', param: 'josei' },
        { name: 'Manhua', param: 'manhua' },
        { name: 'Manhwa', param: 'manhwa' },
        { name: 'Mature', param: 'mature' },
        { name: 'Romance', param: 'romance' },
        { name: 'School Life', param: 'hoc-duong' },
        { name: 'Sci-fi', param: 'sci-fi' },
        { name: 'Seinen', param: 'seinen' },
        { name: 'Shoujo', param: 'shoujo' },
        { name: 'Shounen', param: 'shounen' },
        { name: 'Slice of Life', param: 'doi-thuong' },
        { name: 'Sports', param: 'the-thao' },
        { name: 'Supernatural', param: 'sieu-nhien' },
        { name: 'Tragedy', param: 'bi-kich' },
        { name: 'Yaoi', param: 'yaoi' },
        { name: 'Yuri', param: 'yuri' }
    ]

    constructor() {
        this.Genres = this.Genres.sort((a, b) => a.name > b.name ? 1 : -1)
    }

    getGenresList(): string[] {
        return this.Genres.map(Genre => Genre.name)
    }
    getParam(name: string): string | undefined {
        return this.Genres.find(Genre => Genre.name === name)?.param
    }
}

export const CuuTruyenGenres = new CuuTruyenGenresClass()

// Nếu CuuTruyen chỉ có Tiếng Việt, bạn không cần class Languages
// Nhưng mình để ví dụ nhỏ gọn cho bạn nếu muốn sau này thêm đa ngôn ngữ:
interface Language {
    name: string;
    code: string;
    lang: string;
    default?: boolean;
}

class CuuTruyenLanguagesClass {
    Languages: Language[] = [
        {
            name: 'Vietnamese',
            code: 'vi',
            lang: '🇻🇳',
            default: true
        }
    ]

    getCodeList(): string[] {
        return this.Languages.map(Language => Language.code)
    }
    getName(code: string): string {
        return this.Languages.find(Language => Language.code === code)?.name ?? 'Unknown'
    }
    getLangIcon(code: string): string {
        return this.Languages.find(Language => Language.code === code)?.lang ?? '🌐'
    }
    getDefault(): string[] {
        return this.Languages.filter(Language => Language.default).map(Language => Language.code)
    }
}

export const CuuTruyenLanguages = new CuuTruyenLanguagesClass()

export interface Metadata {
    page: number;
}
