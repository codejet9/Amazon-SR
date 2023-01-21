function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function containerValid_Search(container_i){
    let t1=container_i.lastChild
    let t2=container_i.lastChild.classList;
    let t3=container_i.querySelector("a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style span.a-size-base.s-underline-text")
    let t4=container_i.querySelector("i.a-icon.a-icon-star-small.aok-align-bottom span.a-icon-alt")

    if(container_i!==undefined 
        && t1!==undefined 
        && t1!==null
        && t2!==undefined
        && t2!==null
        && t3!==null
        && t3!==undefined
        && t4!==null
        && t4!==undefined
    ) return true;
    else return false;
}

function containerValid_Product(container_i){
    let t1=container_i.querySelector("#acrCustomerReviewText")
    let t2=container_i.querySelector("i.a-icon.a-icon-star span.a-icon-alt")

    if(container_i!==undefined 
        && t1!==undefined 
        && t1!==null
        && t2!==undefined
        && t2!==null
    ) return true;
    else return false;
}

function numValid(reviewCount,rating){
    if(
        reviewCount!==undefined
        && rating!==undefined
        && reviewCount.replace(/,/g, '')!==''
    ) return true;
    else return false;
}



(() => {
    chrome.runtime.onMessage.addListener((obj,sender,response) => {
        let enableValue;
        chrome.storage.local.get(["enabled"]).then((result) => {
            enableValue=result.enabled;
            if(enableValue===undefined) enableValue=true;

            if(obj.message==="s?k" && enableValue){
                //insert on search page
                loadSR_search();
            }
            else{
                loadSR_product();
            }
        });

        
    });

    const loadSR_search = () => {
        const insertSR = () =>{
            //collect all rating, reviews containers
            let container=document.querySelectorAll("div.a-section.a-spacing-none.a-spacing-top-micro div.a-row.a-size-small")

            //calculate SR by iterating on rating elements
            for(let i=0;i<container.length;i++){
                //check if container
                if(!containerValid_Search(container[i])) continue;

                //get corresponding rating and reviewCount
                let reviewCount=container[i].querySelector("a.a-link-normal.s-underline-text.s-underline-link-text.s-link-style span.a-size-base.s-underline-text").innerText;
                let rating=container[i].querySelector("i.a-icon.a-icon-star-small.aok-align-bottom span.a-icon-alt").innerText.substr(0,3);

                //check validity of numbers/strings
                if(!numValid(reviewCount,rating)) continue;

                let totalVotes=parseFloat(reviewCount.replace(/,/g, ''));
                let positivePercent=(rating)/5.0;

                let positiveVotes=positivePercent*totalVotes;
                let sr=(positiveVotes+1)/(totalVotes+2);
                sr=sr*100; sr=String(sr); sr=sr.substr(0,5);
                
                let srLabel=document.createElement('span');
                srLabel.innerHTML=sr+ "%";
                srLabel.style="background-color:teal; color:white; font-size:1.2em; font-weight:bold; padding:3px; border-radius:5px"
                srLabel.className = "sr-added";

                if(!container[i].lastChild.classList.contains("sr-added")) container[i].appendChild(srLabel);
            }
        }


        //calculate no.of search results per page
        let Count_scriptTag=document.querySelector('#search > script:nth-child(9)');
        let Count_scriptTag_Text=Count_scriptTag.innerText;
        let asinOnPageCount=Count_scriptTag_Text.split('"')[4].split(':')[1].split(',')[0];
        asinOnPageCount=parseFloat(asinOnPageCount.replace(/,/g, ''));

        //list to collect all products
        let data_asinCollect=[]
        
        
        //loop until fetches all search results
        const fetchAndInsert = () => {
            async function fetch() {
                let i=0,maxIt=50;
                
                while(data_asinCollect.length<asinOnPageCount && i<maxIt){
                    data_asinCollect=document.querySelectorAll('div[data-asin]')
                    insertSR();
                    i++;

                    // console.log(data_asinCollect.length);
                    
                    await sleep(3000);
                }
                // console.log("done fetching");
            }
            fetch();
        }
        fetchAndInsert();        
    }



    const loadSR_product = () => {
        //collect all rating, reviews containers
        let container=document.querySelectorAll("#averageCustomerReviews");

        //calculate SR by iterating on rating elements
        for(let i=0;i<container.length;i++){
            //check if container
            if(!containerValid_Product(container[i])){
                console.log("INvalid COntainer");
                continue;
            }

            //get corresponding rating and reviewCount
            let reviewCount=container[i].querySelector("#acrCustomerReviewText").innerText.split(' ')[0];
            let rating=container[i].querySelector("i.a-icon.a-icon-star span.a-icon-alt").innerText.substr(0,3);

            //check validity of numbers/strings
            if(!numValid(reviewCount,rating)) continue;

            let totalVotes=parseFloat(reviewCount.replace(/,/g, ''));
            let positivePercent=(rating)/5.0;

            let positiveVotes=positivePercent*totalVotes;
            let sr=(positiveVotes+1)/(totalVotes+2);
            sr=sr*100; sr=String(sr); sr=sr.substr(0,5);
            
            let srLabel=document.createElement('span');
            srLabel.innerHTML=sr+ "%";
            srLabel.style="background-color:teal; color:white; font-size:1em; font-weight:bold; padding:2px; border-radius:5px"
            srLabel.className = "sr-added";

            if(
                (container[i].lastChild.classList==undefined) 
                || (!container[i].lastChild.classList.contains("sr-added"))
            ) container[i].appendChild(srLabel);
        }
    }

})();