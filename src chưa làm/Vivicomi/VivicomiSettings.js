"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetSettings = exports.thumbnailSettings = exports.accountSettings = exports.authEndpointRequest = exports.parseAccessToken = exports.contentSettings = exports.saveAccessToken = exports.getAccessToken = exports.getMangaThumbnail = exports.getSearchThumbnail = exports.getHomepageThumbnail = exports.forcePort443 = exports.getSkipSameChapter = exports.getDataSaver = exports.getRatings = exports.getLanguages = void 0;
const VivicomiHelper_1 = require("./VivicomiHelper");
async function getLanguages(stateManager) {
    return (await stateManager.retrieve('languages') ?? VivicomiHelper_1.MDLanguages.getDefault());
}
exports.getLanguages = getLanguages;
async function getRatings(stateManager) {
    return (await stateManager.retrieve('ratings') ?? VivicomiHelper_1.MDRatings.getDefault());
}
exports.getRatings = getRatings;
async function getDataSaver(stateManager) {
    return (await stateManager.retrieve('data_saver') ?? false);
}
exports.getDataSaver = getDataSaver;
async function getSkipSameChapter(stateManager) {
    return (await stateManager.retrieve('skip_same_chapter') ?? false);
}
exports.getSkipSameChapter = getSkipSameChapter;
async function forcePort443(stateManager) {
    return (await stateManager.retrieve('force_port_443') ?? false);
}
exports.forcePort443 = forcePort443;
async function getHomepageThumbnail(stateManager) {
    return (await stateManager.retrieve('homepage_thumbnail') ?? [VivicomiHelper_1.MDImageQuality.getDefault('homepage')]);
}
exports.getHomepageThumbnail = getHomepageThumbnail;
async function getSearchThumbnail(stateManager) {
    return (await stateManager.retrieve('search_thumbnail') ?? [VivicomiHelper_1.MDImageQuality.getDefault('search')]);
}
exports.getSearchThumbnail = getSearchThumbnail;
async function getMangaThumbnail(stateManager) {
    return (await stateManager.retrieve('manga_thumbnail') ?? [VivicomiHelper_1.MDImageQuality.getDefault('manga')]);
}
exports.getMangaThumbnail = getMangaThumbnail;
async function getAccessToken(stateManager) {
    const accessToken = await stateManager.keychain.retrieve('access_token');
    const refreshToken = await stateManager.keychain.retrieve('refresh_token');
    if (!accessToken)
        return undefined;
    return {
        accessToken,
        refreshToken,
        tokenBody: await parseAccessToken(accessToken)
    };
}
exports.getAccessToken = getAccessToken;
async function saveAccessToken(stateManager, accessToken, refreshToken) {
    await Promise.all([
        stateManager.keychain.store('access_token', accessToken),
        stateManager.keychain.store('refresh_token', refreshToken)
    ]);
    if (!accessToken)
        return undefined;
    return {
        accessToken,
        refreshToken,
        tokenBody: await parseAccessToken(accessToken)
    };
}
exports.saveAccessToken = saveAccessToken;
function contentSettings(stateManager) {
    return App.createDUINavigationButton({
        id: 'content_settings',
        label: 'Content Settings',
        form: App.createDUIForm({
            sections: async () => [
                App.createDUISection({
                    isHidden: false,
                    id: 'content',
                    footer: 'When enabled, same chapters from different scanlation group will not be shown.',
                    rows: async () => {
                        await Promise.all([
                            getLanguages(stateManager),
                            getRatings(stateManager),
                            getDataSaver(stateManager),
                            getSkipSameChapter(stateManager)
                        ]);
                        return await [
                            App.createDUISelect({
                                id: 'languages',
                                label: 'Languages',
                                options: VivicomiHelper_1.MDLanguages.getMDCodeList(),
                                labelResolver: async (option) => VivicomiHelper_1.MDLanguages.getName(option),
                                value: App.createDUIBinding({
                                    get: async () => getLanguages(stateManager),
                                    set: async (newValue) => { await stateManager.store('languages', newValue); }
                                }),
                                allowsMultiselect: true
                            }),
                            App.createDUISelect({
                                id: 'ratings',
                                label: 'Content Rating',
                                options: VivicomiHelper_1.MDRatings.getEnumList(),
                                labelResolver: async (option) => VivicomiHelper_1.MDRatings.getName(option),
                                value: App.createDUIBinding({
                                    get: async () => getRatings(stateManager),
                                    set: async (newValue) => { await stateManager.store('ratings', newValue); }
                                }),
                                allowsMultiselect: true
                            }),
                            App.createDUISwitch({
                                id: 'data_saver',
                                label: 'Data Saver',
                                value: App.createDUIBinding({
                                    get: async () => getDataSaver(stateManager),
                                    set: async (newValue) => { await stateManager.store('data_saver', newValue); }
                                })
                            }),
                            App.createDUISwitch({
                                id: 'skip_same_chapter',
                                label: 'Skip Same Chapter',
                                value: App.createDUIBinding({
                                    get: async () => getSkipSameChapter(stateManager),
                                    set: async (newValue) => { await stateManager.store('skip_same_chapter', newValue); }
                                })
                            }),
                            App.createDUISwitch({
                                id: 'force_port_443',
                                label: 'Force Port 443',
                                value: App.createDUIBinding({
                                    get: async () => forcePort443(stateManager),
                                    set: async (newValue) => { await stateManager.store('force_port_443', newValue); }
                                })
                            })
                        ];
                    }
                })
            ]
        })
    });
}
exports.contentSettings = contentSettings;
async function parseAccessToken(accessToken) {
    if (!accessToken)
        return undefined;
    const tokenBodyBase64 = accessToken.split('.')[1];
    if (!tokenBodyBase64)
        return undefined;
    const tokenBodyJSON = Buffer.from(tokenBodyBase64, 'base64').toString('ascii');
    return JSON.parse(tokenBodyJSON);
}
exports.parseAccessToken = parseAccessToken;
const authRequestCache = {};
function authEndpointRequest(requestManager, endpoint, payload) {
    if (authRequestCache[endpoint] == undefined) {
        authRequestCache[endpoint] = _authEndpointRequest(requestManager, endpoint, payload).finally(() => {
            delete authRequestCache[endpoint];
        });
    }
    return authRequestCache[endpoint];
}
exports.authEndpointRequest = authEndpointRequest;
async function _authEndpointRequest(requestManager, endpoint, payload) {
    const response = await requestManager.schedule(App.createRequest({
        method: 'POST',
        url: 'https://api.mangadex.org/auth/' + endpoint,
        headers: {
            'content-type': 'application/json'
        },
        data: payload
    }), 1);
    if (response.status > 399) {
        throw new Error('Request failed with error code:' + response.status);
    }
    const jsonData = (typeof response.data === 'string') ? JSON.parse(response.data) : response.data;
    if (jsonData.result != 'ok') {
        throw new Error('Request failed with errors: ' + jsonData.errors.map((x) => `[${x.title}]: ${x.detail}`));
    }
    return jsonData;
}
async function accountSettings(stateManager, requestManager) {
    const accessToken = await getAccessToken(stateManager);
    if (!accessToken) {
        return App.createDUIOAuthButton({
            id: 'mdex_oauth',
            label: 'Login with MangaDex',
            authorizeEndpoint: 'https://auth.mangadex.dev/realms/mangadex/protocol/openid-connect/auth',
            clientId: 'thirdparty-oauth-client',
            redirectUri: 'paperback://mangadex-login',
            responseType: {
                type: 'pkce',
                pkceCodeLength: 64,
                pkceCodeMethod: 'S256',
                formEncodeGrant: true,
                tokenEndpoint: 'https://auth.mangadex.dev/realms/mangadex/protocol/openid-connect/token'
            },
            async successHandler(accessToken, refreshToken) {
                await saveAccessToken(stateManager, accessToken, refreshToken);
            },
            scopes: ['email', 'openid']
        });
    }
    return App.createDUINavigationButton({
        id: 'account_settings',
        label: 'Session Info',
        form: App.createDUIForm({
            onSubmit: async () => undefined,
            sections: async () => {
                const accessToken = await getAccessToken(stateManager);
                if (!accessToken) {
                    return [
                        App.createDUISection({
                            isHidden: false,
                            id: 'not_logged_in_section',
                            rows: async () => [
                                App.createDUILabel({
                                    id: 'not_logged_in',
                                    label: 'Not Logged In'
                                })
                            ]
                        })
                    ];
                }
                return [
                    App.createDUISection({
                        isHidden: false,
                        id: 'introspect',
                        rows: async () => {
                            return Object.keys(accessToken.tokenBody).map((key) => {
                                const value = accessToken.tokenBody[key];
                                return App.createDUIMultilineLabel({
                                    id: key,
                                    label: key,
                                    value: Array.isArray(value) ? value.join('\n') : `${value}`
                                });
                            });
                        }
                    }),
                    App.createDUISection({
                        isHidden: false,
                        id: 'refresh_button_section',
                        rows: async () => [
                            App.createDUIButton({
                                id: 'refresh_token_button',
                                label: 'Refresh Token',
                                onTap: async () => {
                                    const response = await authEndpointRequest(requestManager, 'refresh', { token: accessToken.refreshToken });
                                    await saveAccessToken(stateManager, response.token.session, response.token.refresh);
                                }
                            }),
                            App.createDUIButton({
                                id: 'logout_button',
                                label: 'Logout',
                                onTap: async () => {
                                    await authEndpointRequest(requestManager, 'logout', {});
                                    await saveAccessToken(stateManager, undefined, undefined);
                                }
                            })
                        ]
                    })
                ];
            }
        })
    });
}
exports.accountSettings = accountSettings;
function thumbnailSettings(stateManager) {
    return App.createDUINavigationButton({
        id: 'thumbnail_settings',
        label: 'Thumbnail Quality',
        form: App.createDUIForm({
            sections: async () => [
                App.createDUISection({
                    isHidden: false,
                    id: 'thumbnail',
                    rows: async () => {
                        await Promise.all([
                            getHomepageThumbnail(stateManager),
                            getSearchThumbnail(stateManager),
                            getMangaThumbnail(stateManager)
                        ]);
                        return await [
                            App.createDUISelect({
                                id: 'homepage_thumbnail',
                                label: 'Homepage Thumbnail',
                                options: VivicomiHelper_1.MDImageQuality.getEnumList(),
                                labelResolver: async (option) => VivicomiHelper_1.MDImageQuality.getName(option),
                                value: App.createDUIBinding({
                                    get: async () => getHomepageThumbnail(stateManager),
                                    set: async (newValue) => await stateManager.store('homepage_thumbnail', newValue)
                                }),
                                allowsMultiselect: false
                            }),
                            App.createDUISelect({
                                id: 'search_thumbnail',
                                label: 'Search Thumbnail',
                                options: VivicomiHelper_1.MDImageQuality.getEnumList(),
                                labelResolver: async (option) => VivicomiHelper_1.MDImageQuality.getName(option),
                                value: App.createDUIBinding({
                                    get: async () => getSearchThumbnail(stateManager),
                                    set: async (newValue) => await stateManager.store('search_thumbnail', newValue)
                                }),
                                allowsMultiselect: false
                            }),
                            App.createDUISelect({
                                id: 'manga_thumbnail',
                                label: 'Manga Thumbnail',
                                options: VivicomiHelper_1.MDImageQuality.getEnumList(),
                                labelResolver: async (option) => VivicomiHelper_1.MDImageQuality.getName(option),
                                value: App.createDUIBinding({
                                    get: async () => getMangaThumbnail(stateManager),
                                    set: async (newValue) => await stateManager.store('manga_thumbnail', newValue)
                                }),
                                allowsMultiselect: false
                            })
                        ];
                    }
                })
            ]
        })
    });
}
exports.thumbnailSettings = thumbnailSettings;
function resetSettings(stateManager) {
    return App.createDUIButton({
        id: 'reset',
        label: 'Reset to Default',
        onTap: async () => {
            await Promise.all([
                stateManager.store('languages', null),
                stateManager.store('ratings', null),
                stateManager.store('data_saver', null),
                stateManager.store('skip_same_chapter', null),
                stateManager.store('homepage_thumbnail', null),
                stateManager.store('search_thumbnail', null),
                stateManager.store('manga_thumbnail', null)
            ]);
        }
    });
}
exports.resetSettings = resetSettings;
//# sourceMappingURL=VivicomiSettings.js.map