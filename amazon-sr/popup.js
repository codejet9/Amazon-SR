let toggleBtn=document.getElementById('toggle');

chrome.storage.local.get(["enabled"]).then((result) => {
    enableValue=result.enabled;
    if(enableValue===undefined) enableValue=true;

    if(enableValue) toggleBtn.innerHTML="Disable"
    else toggleBtn.innerHTML="Enable";
});

toggleBtn.addEventListener('click',function(){
    let enableValue;

    chrome.storage.local.get(["enabled"]).then((result) => {
        enableValue=result.enabled;
        if(enableValue===undefined) enableValue=true;

        enableValue=!enableValue;
        chrome.storage.local.set({ enabled: enableValue }).then(() => {
            console.log("Extension set to"+enableValue);
            if(enableValue) toggleBtn.innerHTML="Disable"
            else toggleBtn.innerHTML="Enable";
        });
    });
})

async function checkTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);

    if(!tab.url.includes('amazon.in') && !tab.url.includes('amazon.com')){
        let notAmznTab=document.querySelector("#curTab");
        notAmznTab.innerHTML="You are not on Amazon Page :("
        notAmznTab.style="background-color: #f8d7da; color:#721c24; font-size:1em; padding: 0.5rem; display: inline-block; border-radius: 0.25rem;"
    }
}
checkTab();


document.querySelector("#about").addEventListener("click", function () {
    window.open("https://github.com/codejet9/amazon-sr");
});