const backgroundWindow = chrome.extension.getBackgroundPage();
//let getLoginUrl = 'https://localhost:3000/bzz:/getlogin.eth/';
let getLoginUrl = 'https://swarm-gateways.net/bzz:/getlogin.eth/';
//let redirectUrl = chrome.identity.getRedirectURL();
let redirectUrl = 'https://example.com/';
let accessToken = null;

const appId = 3;
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

function prepareUrl(url) {
    let resultUrl = url;
    const youtubeUrls = ['https://youtube.com/', 'https://www.youtube.com/', 'https://youtu.be/', 'https://www.youtu.be/'];
    const isYoutube = !!youtubeUrls.find(item => url.indexOf(item) === 0);
    const youtubeId = getYoutubeId(url);
    if (isYoutube && youtubeId) {
        resultUrl = `youtube:${youtubeId}`;
    }

    console.log('result url', resultUrl);

    return resultUrl;
}

function getYoutubeId(url) {
    var regExp = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[1].length == 11) ? match[1] : false;
}

async function updateUrlInfo(url) {
    url = prepareUrl(url);
    console.log('Url', url)
    if (timeout) {
        clearTimeout(timeout);
    }

    resetBadge();

    if (!url || url === 'chrome://newtab/') {
        console.log('Empty url. Cancel receiving info')
        return;
    }

    const urlHash = await backgroundWindow.getLoginApi.keccak256(url);
    console.log('urlHash', urlHash);
    const data = await backgroundWindow.getLoginApi.callContractMethod(likeLogicAddress, 'getUserStatisticsUrl', userInfo.usernameHash, urlHash);
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

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.tabs.get(tabId, function (tab) {
        console.log('Updated tab', tab);
        onReceiveUrlInfo(tab.url, tabId);
    });
});

chrome.extension.onMessage.addListener(async function (message, messageSender, sendResponse) {
    console.log(message, messageSender, sendResponse);
    const type = message.type;
    if (type === TYPE_RESET_ACCESS_TOKEN) {
        chrome.storage.sync.set({accessToken: null, userId: null});
        isGetLoginLoaded = false;
        isWaitAccessToken = true;
        resetBadge();
        setStatus(STATUS_APP_NOT_ALLOWED, {url: backgroundWindow.getLoginApi.getAuthorizeUrl()});
    } else if (type === TYPE_TOGGLE_LIKE && message.url) {
        const url = prepareUrl(message.url);
        if (!url || url === 'chrome://newtab/') {
            console.log('Empty url. Like canceled');
            return;
        }

        setState({...state, currentPageInfo: {isLiked: !state.currentPageInfo.isLiked}});
        const urlHash = await backgroundWindow.getLoginApi.keccak256(url);
        //console.log('Like url', url, 'hash', urlHash);
        const data = await backgroundWindow.getLoginApi.callContractMethod(likeLogicAddress, 'getUserStatisticsUrl', userInfo.usernameHash, urlHash);
        let response = {};
        if (data.isLiked) {
            response = await backgroundWindow.getLoginApi.sendTransaction(likeLogicAddress, 'unlikeUrl', [urlHash], {resolveMethod: 'mined'})
        } else {
            response = await backgroundWindow.getLoginApi.sendTransaction(likeLogicAddress, 'likeUrl', [urlHash, '0x0000000000000000000000000000000000000000'], {resolveMethod: 'mined'})
        }
        console.log('response', response);
    } else if (type === TYPE_GET_STATE) {
        setState(state);
    }
});

setStatus(STATUS_WAIT_GETLOGIN);
