const backgroundWindow = chrome.extension.getBackgroundPage();
//let getLoginApiUrl = "https://localhost:3000/api/last.js";
let getLoginUrl = 'https://localhost:3000/bzz:/getlogin.eth/';
//let redirectUrl = 'https://localhost:1234/token.html';
let redirectUrl = chrome.identity.getRedirectURL();
// todo how to correct save access_token? Also catch token from https://pengmpaobalodomoomdghgbpneidhgln.chromiumapp.org/#access_token=0x61bbdf2ce3c1f2ab014df87e2d6e7d396b532c7fff53ef3ee593e1ae7b2520e7&user_id=0x79f83765412a9277d8e547b789add1c2c4f861218677fc27d9bfb4e9c77a1b82
let accessToken = localStorage.getItem('access_token');
console.log('accessToken', accessToken);

const likeLogicAbi = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "title",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "description",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "url",
                "type": "string"
            }
        ],
        "name": "createResourceType",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "resourceTypeId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "resourceIdHash",
                "type": "bytes32"
            },
            {
                "internalType": "address payable",
                "name": "donateAddress",
                "type": "address"
            }
        ],
        "name": "like",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "urlHash",
                "type": "bytes32"
            },
            {
                "internalType": "address payable",
                "name": "donateAddress",
                "type": "address"
            }
        ],
        "name": "likeUrl",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract GetLoginStorage",
                "name": "_storageAddress",
                "type": "address"
            }
        ],
        "name": "setGLStorage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract LikeStorage",
                "name": "_storageAddress",
                "type": "address"
            }
        ],
        "name": "setLikeStorage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "setOwner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "contract LikeStorage",
                "name": "_likeStorage",
                "type": "address"
            },
            {
                "internalType": "contract GetLoginStorage",
                "name": "_GLStorage",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "resourceTypeId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "resourceIdHash",
                "type": "bytes32"
            }
        ],
        "name": "unlike",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "urlHash",
                "type": "bytes32"
            }
        ],
        "name": "unlikeUrl",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_address",
                "type": "address"
            }
        ],
        "name": "getGLUsernameHash",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "resourceTypeId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "resourceIdHash",
                "type": "bytes32"
            }
        ],
        "name": "getResourceIdKey",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "resourceTypeId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "resourceIdHash",
                "type": "bytes32"
            }
        ],
        "name": "getResourceIdStatistics",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "resourceTypeId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "resourceIdHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "urlHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "reactions",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "donates",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    }
                ],
                "internalType": "struct LikeStorage.ResourceIdStatistics",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "urlHash",
                "type": "bytes32"
            }
        ],
        "name": "getResourceIdStatisticsUrl",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "resourceTypeId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "resourceIdHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "urlHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint256",
                        "name": "reactions",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "donates",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    }
                ],
                "internalType": "struct LikeStorage.ResourceIdStatistics",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "urlHash",
                "type": "bytes32"
            }
        ],
        "name": "getUrlHashKey",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "resourceTypeId",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "resourceIdHash",
                "type": "bytes32"
            }
        ],
        "name": "getUserLikeResourceKey",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "urlHash",
                "type": "bytes32"
            }
        ],
        "name": "getUserLikeUrlKey",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "usernameHash",
                "type": "bytes32"
            },
            {
                "internalType": "bytes32",
                "name": "urlHash",
                "type": "bytes32"
            }
        ],
        "name": "getUserStatisticsUrl",
        "outputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "resourceTypeId",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "resourceIdHash",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "bytes32",
                                "name": "urlHash",
                                "type": "bytes32"
                            },
                            {
                                "internalType": "uint256",
                                "name": "reactions",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "donates",
                                "type": "uint256"
                            },
                            {
                                "internalType": "bool",
                                "name": "isActive",
                                "type": "bool"
                            }
                        ],
                        "internalType": "struct LikeStorage.ResourceIdStatistics",
                        "name": "resourceStatistics",
                        "type": "tuple"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "usernameHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bool",
                        "name": "isLiked",
                        "type": "bool"
                    }
                ],
                "internalType": "struct LikeLogic.UserStatistics",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "GLStorage",
        "outputs": [
            {
                "internalType": "contract GetLoginStorage",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "likeStorage",
        "outputs": [
            {
                "internalType": "contract LikeStorage",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "key",
                "type": "uint256"
            }
        ],
        "name": "validateGetResourceType",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "description",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "url",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "reactions",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "donates",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "ownerUsernameHash",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "bool",
                        "name": "isActive",
                        "type": "bool"
                    }
                ],
                "internalType": "struct LikeStorage.ResourceType",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const likeStorageAddress = '0x6A7c14bD5384e2eb8515a5B7298cF1ec5d63aD59';
let likeLogicAddress = null;
let activeUrl = '';
let isGetLoginLoaded = false;
let timeout = null;
let status = '';
let userInfo = {};
let cache = {};

async function updateUrlInfo(url) {
    if (timeout) {
        clearTimeout(timeout);
    }

    if (cache[url]) {
        // todo get cache info
    }

    const urlHash = await instance.keccak256(url);
    // todo check cached likes info
    // todo get url hash for not youtube ang receive info
    const data = await backgroundWindow.getLoginApi.callContractMethod(this.likeLogicAddress, 'getUserStatisticsUrl', userInfo.usernameHash, urlHash);
    console.log(data);

    chrome.browserAction.setIcon({path: "img/heart-wait.png"});
    chrome.browserAction.setBadgeText({text: ''});
    timeout = setTimeout(_ => {
        chrome.browserAction.setIcon({path: "img/heart-liked.png"});
        chrome.browserAction.setBadgeText({text: String(0)});
    }, 1000);
}

function setStatus(appStatus) {
    status = appStatus;
    window._like_status = status;
}

setStatus('wait_getlogin');
chrome.tabs.onActivated.addListener(function (activeInfo) {
    if (!isGetLoginLoaded) {
        return;
    }

    chrome.tabs.get(activeInfo.tabId, function (tab) {
        activeUrl = tab.url;
        updateUrlInfo(activeUrl);
    });
});


backgroundWindow._onGetLoginApiLoaded = async (instance) => {
    backgroundWindow.getLoginApi = instance;
    // todo check is authorized. Open auth window, store access_token
    const data = (await instance.init(3, getLoginUrl, redirectUrl, accessToken)).data;
    console.log('init response', data);
    if (data.is_client_allowed) {
        setStatus('ready');
    } else {
        window._like_authorize_url = data.authorize_url;
        setStatus('app_not_allowed');
        return;
    }
    console.log(data);
    likeLogicAddress = await instance.callContractMethod(likeStorageAddress, 'logicAddress');
    console.log('likeLogicAddress', likeLogicAddress);
    instance.setClientAbi(likeLogicAbi);
    isGetLoginLoaded = true;
    userInfo = await instance.getUserInfo();
    updateUrlInfo(activeUrl);
};
/*
console.log('back api');
console.log(window);
setInterval(_ => {
    chrome.runtime.sendMessage({msg: 'hello from back ' + Math.random()});
}, 1000)

chrome.extension.onMessage.addListener(function (message, messageSender, sendResponse) {
    console.log(message, messageSender, sendResponse);

    // message is the message you sent, probably an object
    // messageSender is an object that contains info about the context that sent the message
    // sendResponse is a function to run when you have a response
});
*/
