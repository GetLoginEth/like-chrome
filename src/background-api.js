import {
    STATUS_APP_NOT_ALLOWED,
    STATUS_READY,
    STATUS_WAIT_GETLOGIN,
    TYPE_GET_STATE,
    TYPE_RESET_ACCESS_TOKEN,
    TYPE_TOGGLE_LIKE,
    TYPE_UPDATE_STATE
} from "./consts";

import likeLogic from '@getlogin/like/web/LikeLogicAbi.json';
import likeStorage from '@getlogin/like/web/LikeStorageAbi.json';

const backgroundWindow = chrome.extension.getBackgroundPage();
const getLoginUrl = 'https://swarm-gateways.net/bzz:/getlogin.eth/';
const redirectUrl = 'https://example.com/';
const youtubeResourceTypeId = 1;
const appId = 3;
const likeLogicAbi = likeLogic.abi;
const likeStorageAbi = likeStorage.abi;
const likeStorageAddress = likeStorage.address;

let accessToken = null;
let likeLogicAddress = null;
let isGetLoginLoaded = false;
let timeout = null;
let isWaitAccessToken = false;
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
    console.log('Url', url)
    if (timeout) {
        clearTimeout(timeout);
    }

    resetBadge();

    if (isBadUrl(url)) {
        console.log('Empty url. Cancel receiving info')
        return;
    }

    const urlHash = await backgroundWindow.getLoginApi.keccak256(url);
    console.log('urlHash', urlHash);
    let data;
    if (isYoutubeUrl(url)) {
        const id = getYoutubeId(url);
        const idHash = await backgroundWindow.getLoginApi.keccak256(id);
        console.log('youtube id hash', id, idHash);
        data = await backgroundWindow.getLoginApi.callContractMethod(likeLogicAddress, 'getUserStatisticsResource', userInfo.usernameHash, youtubeResourceTypeId, idHash);
    } else {
        data = await backgroundWindow.getLoginApi.callContractMethod(likeLogicAddress, 'getUserStatisticsUrl', userInfo.usernameHash, urlHash);
    }

    console.log(data);
    setState({...state, currentPageInfo: {isLiked: data.isLiked}});
    if (data.isLiked) {
        chrome.browserAction.setIcon({path: "img/heart-liked.png"});
    } else {
        chrome.browserAction.setIcon({path: "img/heart.png"});
    }

    chrome.browserAction.setBadgeText({text: String(data.resourceStatistics.reactions)});
}

function setStatus(status, data = {}) {
    setState({...state, status, status_data: data});
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

async function onKeyValueReceived() {
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
    if (data.is_client_allowed) {
        setStatus(STATUS_READY);
    } else {
        isWaitAccessToken = true;
        setStatus(STATUS_APP_NOT_ALLOWED, {url: data.authorize_url});

        return;
    }

    instance.setClientAbi(likeStorageAbi);
    likeLogicAddress = await instance.callContractMethod(likeStorageAddress, 'logicAddress');
    instance.setClientAbi(likeLogicAbi);
    console.log('likeLogicAddress', likeLogicAddress);
    isGetLoginLoaded = true;
    userInfo = await instance.getUserInfo();
}

function onReceiveUrlInfo(url, tabId) {
    if (currentUrl === url) {
        console.log('Current url the same. Cancel receiving info');
        return;
    }

    currentUrl = url;
    if (isWaitAccessToken && url.indexOf(redirectUrl) === 0) {
        console.log('onReceiveUrlInfo - url', url)
        try {
            parseAndSetAccessToken(url);
            try {
                chrome.tabs.remove(tabId);
            } catch (e) {

            }

            onKeyValueReceived()
                .then(_ => {
                    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
                        if (tabs.length === 0) {
                            return;
                        }

                        const url = tabs[0].url;
                        updateUrlInfo(url);
                    });
                });
        } catch (e) {
            console.error(e);
        }
    }

    if (isGetLoginLoaded) {
        updateUrlInfo(url);
    } else {
        console.log('Getlogin deactivated');
    }
}

function resetAccessToken() {
    chrome.storage.sync.set({accessToken: null, userId: null});
    isGetLoginLoaded = false;
    isWaitAccessToken = true;
    resetBadge();
    setStatus(STATUS_APP_NOT_ALLOWED, {url: backgroundWindow.getLoginApi.getAuthorizeUrl()});
}

async function toggleLike(message) {
    const url = message.url;
    if (isBadUrl(url)) {
        console.log('Empty url. Like canceled');
        return;
    }

    setState({...state, currentPageInfo: {isLiked: !state.currentPageInfo.isLiked}});
    const urlHash = await backgroundWindow.getLoginApi.keccak256(url);
    let data;
    let response = {};

    if (isYoutubeUrl(url)) {
        const id = getYoutubeId(url);
        const idHash = await backgroundWindow.getLoginApi.keccak256(id);
        data = await backgroundWindow.getLoginApi.callContractMethod(likeLogicAddress, 'getUserStatisticsResource', userInfo.usernameHash, youtubeResourceTypeId, idHash);
        if (data.isLiked) {
            response = await backgroundWindow.getLoginApi.sendTransaction(likeLogicAddress, 'unlike', [youtubeResourceTypeId, idHash], {resolveMethod: 'mined'})
        } else {
            response = await backgroundWindow.getLoginApi.sendTransaction(likeLogicAddress, 'like', [youtubeResourceTypeId, idHash, '0x0000000000000000000000000000000000000000'], {resolveMethod: 'mined'})
        }
    } else {
        data = await backgroundWindow.getLoginApi.callContractMethod(likeLogicAddress, 'getUserStatisticsUrl', userInfo.usernameHash, urlHash);
        if (data.isLiked) {
            response = await backgroundWindow.getLoginApi.sendTransaction(likeLogicAddress, 'unlikeUrl', [urlHash], {resolveMethod: 'mined'})
        } else {
            response = await backgroundWindow.getLoginApi.sendTransaction(likeLogicAddress, 'likeUrl', [urlHash, '0x0000000000000000000000000000000000000000'], {resolveMethod: 'mined'})
        }
    }

    console.log('response', response);
}

backgroundWindow._onGetLoginApiLoaded = async (instance) => {
    backgroundWindow.getLoginApi = instance;
    chrome.storage.sync.get(['accessToken'], function (result) {
        console.log(result);
        accessToken = result.accessToken;
        console.log('accessToken', accessToken);
        onKeyValueReceived();
    });
};

chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
        console.log('Activated tab', tab);
        onReceiveUrlInfo(tab.url, tab.id);
    });
});

chrome.tabs.onUpdated.addListener(function (tabId) {
    chrome.tabs.get(tabId, function (tab) {
        if (!tab) {
            return;
        }

        console.log('Updated tab', tab);
        onReceiveUrlInfo(tab.url, tabId);
    });
});

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
