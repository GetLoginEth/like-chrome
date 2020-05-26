console.log("Hello from your Chrome extension!");
// todo get url. If youtube - parse id. If not youtube - save the same
console.log(window.location.href);
//console.log(chrome.identity.getRedirectURL('test'));

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "log") {
            console.log(request);
        }
    }
);
