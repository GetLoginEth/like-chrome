const backgroundWindow = chrome.extension.getBackgroundPage();
//let getLoginApiUrl = "https://localhost:3000/api/last.js";
let getLoginUrl = 'https://localhost:3000/bzz:/getlogin.eth/';
//let redirectUrl = 'https://localhost:1234/token.html';
let redirectUrl = chrome.identity.getRedirectURL();
let accessToken = null;

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
const likeStorageAbi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "resourceType",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "resourceIdHash",
                "type": "bytes32"
            }
        ],
        "name": "EventLikeResource",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "urlHash",
                "type": "bytes32"
            }
        ],
        "name": "EventLikeUrl",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "decrementResourceId",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "resourceType",
                "type": "uint256"
            },
            {
                "internalType": "bytes32",
                "name": "resourceIdHash",
                "type": "bytes32"
            }
        ],
        "name": "emitEventLikeResource",
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
        "name": "emitEventLikeUrl",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "key",
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
                "internalType": "uint256",
                "name": "key",
                "type": "uint256"
            }
        ],
        "name": "getResourceType",
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
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "key",
                "type": "bytes32"
            }
        ],
        "name": "getUserLike",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "incrementResourceId",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "logicAddress",
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
        "inputs": [],
        "name": "newResourceId",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
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
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "resourceIdStatistics",
        "outputs": [
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
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "resources",
        "outputs": [
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
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_logicAddress",
                "type": "address"
            }
        ],
        "name": "setLogicAddress",
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
                "internalType": "bytes32",
                "name": "key",
                "type": "bytes32"
            },
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
                "name": "value",
                "type": "tuple"
            }
        ],
        "name": "setResourceIdStatistics",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "key",
                "type": "uint256"
            },
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
                "name": "value",
                "type": "tuple"
            }
        ],
        "name": "setResourceType",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "key",
                "type": "bytes32"
            },
            {
                "internalType": "bool",
                "name": "value",
                "type": "bool"
            }
        ],
        "name": "setUserLike",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "userLike",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
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
let isWaitAccessToken = false;
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

    chrome.browserAction.setIcon({path: "img/heart-wait.png"});
    chrome.browserAction.setBadgeText({text: ''});
    const urlHash = await backgroundWindow.getLoginApi.keccak256(url);
    console.log('urlHash', urlHash)
    // todo check cached likes info
    // todo get url hash for not youtube ang receive info
    // todo is youtube - check by youtube id
    const data = await backgroundWindow.getLoginApi.callContractMethod(likeLogicAddress, 'getUserStatisticsUrl', userInfo.usernameHash, urlHash);
    console.log(data);

    if (data.isLiked) {
        chrome.browserAction.setIcon({path: "img/heart-liked.png"});
    } else {
        chrome.browserAction.setIcon({path: "img/heart.png"});
    }

    chrome.browserAction.setBadgeText({text: String(data.resourceStatistics.reactions)});
}

function setStatus(appStatus) {
    status = appStatus;
    window._like_status = status;
}

function parseAndSetAccessToken(fullUrl) {
    const url = new URL(fullUrl);
    const params = new URLSearchParams(url.hash.replace('#', ''));
    const accessToken = params.get('access_token');
    const userId = params.get('user_id');
    if (accessToken && accessToken.length === 66) {
        chrome.storage.sync.set({accessToken, userId});
    } else {
        throw new Error('Access token incorrect size');
    }
}

async function onKeyValueReceived() {
    const instance = backgroundWindow.getLoginApi;
    if (!accessToken) {
        accessToken = null;
    }

    const data = (await instance.init(3, getLoginUrl, redirectUrl, accessToken)).data;
    console.log('init response', data);
    if (data.is_client_allowed) {
        setStatus('ready');
    } else {
        window._like_authorize_url = data.authorize_url;
        isWaitAccessToken = true;
        setStatus('app_not_allowed');
        return;
    }

    instance.setClientAbi(likeStorageAbi);
    likeLogicAddress = await instance.callContractMethod(likeStorageAddress, 'logicAddress');
    instance.setClientAbi(likeLogicAbi);
    console.log('likeLogicAddress', likeLogicAddress);
    isGetLoginLoaded = true;
    userInfo = await instance.getUserInfo();
    //updateUrlInfo(activeUrl);
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
        activeUrl = tab.url;

        if (isWaitAccessToken && activeUrl.indexOf(redirectUrl) === 0) {
            try {
                parseAndSetAccessToken(activeUrl);
                try {
                    chrome.tabs.remove(tab.id);
                } catch (e) {

                }
            } catch (e) {
                console.error(e);
            }
        }

        if (isGetLoginLoaded) {
            updateUrlInfo(activeUrl);
        }
    });
});

chrome.extension.onMessage.addListener(async function (message, messageSender, sendResponse) {
    console.log(message, messageSender, sendResponse);
    if (message.type === 'reset_access_token') {
        chrome.storage.sync.set({accessToken: null, userId: null});
        window._like_authorize_url = backgroundWindow.getLoginApi.getAuthorizeUrl();
        setStatus('app_not_allowed');
    } else if (message.type === 'toggle_like' && message.url) {
        const url = message.url;
        const urlHash = await backgroundWindow.getLoginApi.keccak256(url);
        console.log('Like url', url, 'hash', urlHash);
        const response = await backgroundWindow.getLoginApi.sendTransaction(likeLogicAddress, 'likeUrl', [urlHash, '0x0000000000000000000000000000000000000000'], {resolveMethod: 'mined'})
        console.log('response', response);
    }
});

setStatus('wait_getlogin');
