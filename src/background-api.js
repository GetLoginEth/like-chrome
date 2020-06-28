import {
    STATUS_APP_NOT_ALLOWED,
    STATUS_APP_ALLOWED,
    STATUS_WAIT_GETLOGIN,
    TYPE_GET_STATE,
    TYPE_RESET_ACCESS_TOKEN,
    TYPE_TOGGLE_LIKE,
    TYPE_UPDATE_STATE
} from "./consts";

import likeLogic from '@getlogin/like/web/LikeLogicAbi.json';
import likeStorage from '@getlogin/like/web/LikeStorageAbi.json';

const backgroundWindow = chrome.extension.getBackgroundPage();
//const getLoginUrl = 'https://swarm-gateways.net/bzz:/getlogin.eth/';
const getLoginUrl = 'https://localhost:3000/bzz:/getlogin.eth/';
const redirectUrl = 'https://example.com/';
const youtubeResourceTypeId = 1;
const appId = 3;
const likeLogicAbi = likeLogic.abi;
const likeStorageAbi = likeStorage.abi;
const likeStorageAddress = likeStorage.address;
const emptyHash = '0x000000000000000000000000000000000000000000000000000000';
const emptyWallet = '0x0000000000000000000000000000000000000000';

let accessToken = null;
let likeLogicAddress = null;
let timeout = null;
let userInfo = {};
let state = {
    currentPageInfo: {}
};
// for preventing double loading while one url loaded
let currentUrl = '';

function resetBadge() {
    chrome.browserAction.setIcon({path: "img/heart-wait.png"});
    chrome.browserAction.setBadgeText({text: ''});
}

function isBadUrl(url) {
    return !url || url === 'chrome://newtab/';
}

function isYoutubeUrl(url) {
    const youtubeUrls = ['https://youtube.com/', 'https://www.youtube.com/', 'https://youtu.be/', 'https://www.youtu.be/'];
    return !!youtubeUrls.find(item => url.indexOf(item) === 0) && getYoutubeId(url);
}

function getYoutubeId(url) {
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[1].length == 11) ? match[1] : false;
}

async function updateUrlInfo(url) {
    //url = prepareUrl(url);
    const getLoginApi = backgroundWindow.getLoginApi;
    if (!getLoginApi.isReady()) {
        console.log('getLogin not ready');
        return;
    }

    console.log('Url', url)
    if (timeout) {
        clearTimeout(timeout);
    }

    resetBadge();

    if (isBadUrl(url)) {
        console.log('Empty url. Cancel receiving info')
        return;
    }

    let data;
    let usernameHash;
    if (getStatus() === STATUS_APP_ALLOWED && userInfo.usernameHash) {
        usernameHash = userInfo.usernameHash
    } else if (getStatus() === STATUS_APP_NOT_ALLOWED) {
        usernameHash = emptyHash;
    } else {
        console.log('App status is not correct to receive like info', getStatus());
        return;
    }

    const urlHash = await getLoginApi.keccak256(url);
    console.log('urlHash', urlHash);
    getLoginApi.setClientAbi(likeLogicAbi);
    if (isYoutubeUrl(url)) {
        const id = getYoutubeId(url);
        const idHash = await getLoginApi.keccak256(id);
        console.log('youtube id hash', id, idHash);
        data = await getLoginApi.callContractMethod(likeLogicAddress, 'getUserStatisticsResource', usernameHash, youtubeResourceTypeId, idHash);
    } else {
        data = await getLoginApi.callContractMethod(likeLogicAddress, 'getUserStatisticsUrl', usernameHash, urlHash);
    }

    console.log(data);
    setState({
        ...state,
        currentPageInfo: {
            isLiked: data.isLiked,
            reactions: Number(data.resourceStatistics.reactions)
        }
    });
    chrome.browserAction.setIcon({path: data.isLiked ? "img/heart-liked.png" : "img/heart.png"});
    chrome.browserAction.setBadgeText({text: String(data.resourceStatistics.reactions)});
    /*getLoginApi.getAccessTokenBalance().then(balance => {
        console.log('balance', balance);
    });*/
}

function setStatus(status, data = {}) {
    setState({...state, status, status_data: data});
}

function getStatus() {
    return state.status;
}

function setState(newState) {
    state = newState;
    chrome.runtime.sendMessage({type: TYPE_UPDATE_STATE, data: state});
}

function parseAndSetAccessToken(fullUrl) {
    const url = new URL(fullUrl);
    const params = new URLSearchParams(url.hash.replace('#', ''));
    accessToken = params.get('access_token');
    const userId = params.get('user_id');
    if (accessToken && accessToken.length === 66) {
        console.log('Set access_token', accessToken);
        chrome.storage.sync.set({accessToken, userId});
    } else {
        throw new Error('Access token incorrect size');
    }
}

function checkAndStoreAccessToken(url, tabId) {
    if (getStatus() === STATUS_APP_NOT_ALLOWED && url.indexOf(redirectUrl) === 0) {
        console.log('onReceiveUrlInfo - url', url)
        try {
            parseAndSetAccessToken(url);
            try {
                //console.log('Try to remove tab', tabId);

                /*function callback(entry) {
                    console.log('remove callback', entry, chrome.runtime.lastError);
                    if (chrome.runtime.lastError) {
                        console.log(chrome.runtime.lastError.message);
                    } else {
                        // Tab exists
                    }
                }*/

                chrome.tabs.remove(tabId/*, callback*/);
            } catch (e) {

            }

            getLoginInit()
                .then(_ => {
                    console.log('tab query here');
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        if (tabs.length === 0) {
                            return;
                        }

                        const url = tabs[0].url;
                        updateUrlInfo(url).then();
                    });
                });
        } catch (e) {
            console.error(e);
        }

        return true;
    }

    return false;
}

function onReceiveUrlInfo(url, tabId) {
    if (currentUrl === url) {
        console.log('Current url the same. Cancel receiving info');
        return;
    }

    currentUrl = url;
    if (checkAndStoreAccessToken(url, tabId)) {
        return;
    }

    updateUrlInfo(url).then();
}

function resetAccessToken() {
    chrome.storage.sync.set({accessToken: null, userId: null});
    resetBadge();
    setStatus(STATUS_APP_NOT_ALLOWED, {url: backgroundWindow.getLoginApi.getAuthorizeUrl()});
}

async function toggleLike(message) {
    const getLoginApi = backgroundWindow.getLoginApi;
    const url = message.url;
    if (isBadUrl(url)) {
        console.log('Empty url. Like canceled');
        return;
    }

    const isLiked = !state.currentPageInfo.isLiked;
    const newCurrentPageInfo = {...state.currentPageInfo, isLiked};
    setState({...state, currentPageInfo: newCurrentPageInfo});
    chrome.browserAction.setIcon({path: isLiked ? "img/heart-liked.png" : "img/heart.png"});
    const reactions = state.currentPageInfo.reactions ? state.currentPageInfo.reactions : 0;
    if (isLiked) {
        chrome.browserAction.setBadgeText({text: String(reactions + 1)});
    } else {
        chrome.browserAction.setBadgeText({text: String(reactions > 0 ? reactions - 1 : 0)});
    }
    const urlHash = await getLoginApi.keccak256(url);
    let data;
    let response = {};

    if (isYoutubeUrl(url)) {
        const id = getYoutubeId(url);
        const idHash = await getLoginApi.keccak256(id);
        data = await getLoginApi.callContractMethod(likeLogicAddress, 'getUserStatisticsResource', userInfo.usernameHash, youtubeResourceTypeId, idHash);
        if (data.isLiked) {
            response = await getLoginApi.sendTransaction(likeLogicAddress, 'unlike', [youtubeResourceTypeId, idHash], {resolveMethod: 'mined'})
        } else {
            response = await getLoginApi.sendTransaction(likeLogicAddress, 'like', [youtubeResourceTypeId, idHash, emptyWallet], {resolveMethod: 'mined'})
        }
    } else {
        data = await getLoginApi.callContractMethod(likeLogicAddress, 'getUserStatisticsUrl', userInfo.usernameHash, urlHash);
        if (data.isLiked) {
            response = await getLoginApi.sendTransaction(likeLogicAddress, 'unlikeUrl', [urlHash], {resolveMethod: 'mined'})
        } else {
            response = await getLoginApi.sendTransaction(likeLogicAddress, 'likeUrl', [urlHash, emptyWallet], {resolveMethod: 'mined'})
        }
    }

    console.log('response', response);
}

async function getLoginInit() {
    const instance = backgroundWindow.getLoginApi;
    if (!instance) {
        console.log('GetLogin instance not found');
        return;
    }

    if (!accessToken) {
        accessToken = null;
    }

    instance.resetInit();
    const data = (await instance.init(appId, getLoginUrl, redirectUrl, accessToken)).data;
    console.log('init response', data);
    instance.setClientAbi(likeStorageAbi);
    likeLogicAddress = await instance.callContractMethod(likeStorageAddress, 'logicAddress');
    instance.setClientAbi(likeLogicAbi);
    console.log('likeLogicAddress', likeLogicAddress);
    userInfo = await instance.getUserInfo();

    if (data.is_client_allowed) {
        setStatus(STATUS_APP_ALLOWED);
    } else {
        setStatus(STATUS_APP_NOT_ALLOWED, {url: data.authorize_url});
    }
}

// when GetLogin loaded, but not init
backgroundWindow._onGetLoginApiLoaded = async (instance) => {
    backgroundWindow.getLoginApi = instance;
    chrome.storage.sync.get(['accessToken'], function (result) {
        console.log(result);
        accessToken = result.accessToken;
        console.log('accessToken', accessToken);
        getLoginInit();
    });
};

// todo check why info updated when not active tab updated (for example, yandex music)
// fires when the active tab in a window changes
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        console.log('Activated tab', tab);
        onReceiveUrlInfo(tab.url, tab.id);
    });
});

// when a tab is updated
chrome.tabs.onUpdated.addListener(function (tabId) {
    chrome.tabs.get(tabId, function (tab) {
        if (!tab) {
            return;
        }

        console.log('Updated tab', tab);
        onReceiveUrlInfo(tab.url, tabId);
    });
});

// receive messages from UI
chrome.extension.onMessage.addListener(async function (message, messageSender, sendResponse) {
    console.log(message, messageSender, sendResponse);
    const type = message.type;
    if (type === TYPE_RESET_ACCESS_TOKEN) {
        resetAccessToken();
    } else if (type === TYPE_TOGGLE_LIKE && message.url) {
        toggleLike(message);
    } else if (type === TYPE_GET_STATE) {
        setState(state);
    }
});

setStatus(STATUS_WAIT_GETLOGIN);
