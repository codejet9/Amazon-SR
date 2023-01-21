chrome.tabs.onUpdated.addListener((tabId,changeInfo,tab) => {
    if(tab.url && changeInfo.status === "complete" && (tab.url.includes("amazon.in") || tab.url.includes("amazon.com"))){
        if(tab.url.includes("amazon.in")){
            let msg=tab.url.split("https://www.amazon.in/")[1].substr(0,3);
            chrome.tabs.sendMessage(tabId,{
                message:msg
            });
        }
        else{
            let msg=tab.url.split("https://www.amazon.com/")[1].substr(0,3);
            chrome.tabs.sendMessage(tabId,{
                message:msg
            });
        }
        
    }
})


// FOR TAB SWITCH

// chrome.tabs.onActivated.addListener((activeInfo) => {
//     chrome.tabs.get(activeInfo.tabId, (tab) => {
//         console.log(tab.url);
//         if(tab.url && (tab.url.includes("amazon.in") || tab.url.includes("amazon.com"))){
//             if(tab.url.includes("amazon.in")){
//                 let msg=tab.url.split("https://www.amazon.in/")[1].substr(0,3);
//                 console.log(msg);
//                 chrome.tabs.sendMessage(activeInfo.tabId,{
//                     message:msg
//                 });
//             }
//             else{
//                 let msg=tab.url.split("https://www.amazon.com/")[1].substr(0,3);
//                 chrome.tabs.sendMessage(activeInfo.tabId,{
//                     message:msg
//                 });
//             }
//         }
//     });
// });