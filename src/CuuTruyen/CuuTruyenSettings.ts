import {
    DUIButton,
    DUINavigationButton,
    SourceStateManager
} from '@paperback/types'

import { CuuTruyenLanguages } from './CuuTruyenHelper'

const getLanguages = async (stateManager: SourceStateManager): Promise<string[]> => {
    return (await stateManager.retrieve('languages') ?? CuuTruyenLanguages.getDefault())
}

const getLanguageHomeFilter = async (stateManager: SourceStateManager): Promise<boolean> => {
    return (await stateManager.retrieve('language_home_filter') ?? false)
}

const getLanguageSearchFilter = async (stateManager: SourceStateManager): Promise<boolean> => {
    return (await stateManager.retrieve('language_search_filter') ?? false)
}

export const languageSettings = (stateManager: SourceStateManager): DUINavigationButton => {
    return App.createDUINavigationButton({
        id: 'language_settings',
        label: 'Ngôn ngữ hiển thị',
        form: App.createDUIForm({
            sections: async () => [
                App.createDUISection({
                    id: 'content',
                    footer: 'Khi bật, truyện sẽ được lọc theo ngôn ngữ đã chọn.',
                    isHidden: false,
                    rows: async () => [
                        App.createDUISelect({
                            id: 'languages',
                            label: 'Ngôn ngữ',
                            options: CuuTruyenLanguages.getCodeList(),
                            labelResolver: async (option) => CuuTruyenLanguages.getName(option),
                            value: App.createDUIBinding({
                                get: () => getLanguages(stateManager),
                                set: async (newValue) => await stateManager.store('languages', newValue)
                            }),
                            allowsMultiselect: true
                        }),
                        App.createDUISwitch({
                            id: 'language_home_filter',
                            label: 'Lọc ngôn ngữ trên trang chính',
                            value: App.createDUIBinding({
                                get: () => getLanguageHomeFilter(stateManager),
                                set: async (newValue) => await stateManager.store('language_home_filter', newValue)
                            })
                        }),
                        App.createDUISwitch({
                            id: 'language_search_filter',
                            label: 'Lọc ngôn ngữ khi tìm kiếm',
                            value: App.createDUIBinding({
                                get: () => getLanguageSearchFilter(stateManager),
                                set: async (newValue) => await stateManager.store('language_search_filter', newValue)
                            })
                        })
                    ]
                })
            ]
        })
    })
}

export const resetSettings = (stateManager: SourceStateManager): DUIButton => {
    return App.createDUIButton({
        id: 'reset',
        label: 'Khôi phục mặc định',
        onTap: async () => {
            await Promise.all([
                stateManager.store('languages', CuuTruyenLanguages.getDefault()),
                stateManager.store('language_home_filter', false),
                stateManager.store('language_search_filter', false)
            ])
        }
    })
}
