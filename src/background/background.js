var tabDatafinal;
var countchanges  = 0;
var limit = 0;
// background.js


  chrome.tabs.query({ currentWindow: true }, function(tabs) {
    
    limit = 5;
    console.log("before backend call", limit);
  });


// Function to get all open tabs
var tabDatafinal = [];

import axios from "axios";




chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setToken') {
    console.log('Token received and stored in background.');
    chrome.storage.local.set({ 'token69': request.token69 }, () => {
      console.log('Token received and stored in background.');
    });
  }
  if(request.action === 'removeToken'){
    chrome.storage.local.remove(['token69'], () => {
    console.log('authToken removed from local storage');
    });
  }

  if(request.action === 'removesavedtabs'){
    chrome.storage.local.remove(['laststore'], () => {
    console.log('laststore removed from local storage');
    });
  }

  if(request.action === 'deleteHistory'){
    chrome.storage.local.remove(['laststore'], () => {
    console.log('laststore removed from local storage');
    });
  }

  if(request.action === 'addtabs'){
    // chrome.storage.local.get(['laststore'], () => {
    // console.log('laststore removed from local storage');
    // });
    chrome.storage.local.get(['laststore'], (result)=>{
      if(result.laststore){
        var lasttabs = JSON.parse(result.laststore);
        var newtabs = request.newtabs
        const uniqueTabs = newtabs.filter((newTab) => {
          return !lasttabs.some(
            (lastTab) => lastTab.tabid === newTab.tabid || lastTab.url === newTab.url
          );
        });
  
        // Combine the arrays
        const updatedTabs = [...lasttabs, ...uniqueTabs];
  
        // Store the updated array back in local storage
        chrome.storage.local.set({ laststore: JSON.stringify(updatedTabs) }, () => {
          console.log('Unique tabs added to local storage:', updatedTabs);
        });
      }else{
        var newtabs = request.newtabs
        chrome.storage.local.set({ laststore: JSON.stringify(newtabs) }, () => {
          console.log('Tabs updated in local storage:', newtabs);
          });
      }
      
    })

  }
});




let debounceTimer = null;


function getAllTabs() {
  console.log(countchanges);
  //console.log(tabDatafinal);
  countchanges = countchanges+1;
  const today = new Date().toISOString();
  //console.log(countchanges);
  chrome.tabs.query({}, (tabs) => {
    const tabData = tabs.map(tab => ({
      url: tab.url,
      title: tab.title,
      tabid: tab.id,
      favIconUrl: tab.favIconUrl,
      type:1,
      date:today
    }));

    // Compare and update tabDatafinal
    tabData.forEach(currentTab => {
      const existingTab = tabDatafinal.find(tab => tab.tabid === currentTab.tabid);

      if (!existingTab && currentTab.favIconUrl) {
        // If tab with this ID doesn't exist in tabDatafinal, add it
        tabDatafinal.push(currentTab);
      } else if (existingTab &&currentTab.url && existingTab.title && existingTab.url&& currentTab.title && (existingTab.title !== currentTab.title || existingTab.url !== currentTab.url)) {
        // If tab with this ID exists but title or URL has changed, update it
        existingTab.title = currentTab.title;
        existingTab.url = currentTab.url;
      }
    });
    //console.log(limit);
    if(countchanges>limit){
      //tablen = tablen+5;
      countchanges = 0;
      limit = 5;
      if (!debounceTimer) {
        // Call getAllTabs immediately
        sendTabsToBackend(tabDatafinal); 
        // Set a timer to block subsequent calls for 500ms
        debounceTimer = setTimeout(() => {
          debounceTimer = null; // Reset the timer after 500ms
        }, 1700);
      }
      
    }
  });
}

// Send tabs data to your backend API
function sendTabsToBackend(tabData) {
   console.log("sendTabsToBackend");
   chrome.storage.local.get(['laststore'], (result)=>{
    if(!result.laststore || (result.laststore && JSON.parse(result.laststore) != tabDatafinal )){
      
      try {
        
        var newtabs=[];
        if(result.laststore){
          var lasttabs = JSON.parse(result.laststore);
          //console.log(result.laststore);
          //console.log(lasttabs+" "+ lasttabs.length);
        
        //console.log(lasttabs[0]);
        tabDatafinal.forEach(currentTab => {
          // const existingTab = lasttabs.find(tab => (tab.tabid === currentTab.tabid || tab.title === currentTab.title || tab.favIconUrl === currentTab.favIconUrl || tab.url === currentTab.url));
          const existingTab2 = lasttabs.find(tab => 
            tab.tabid === currentTab.tabid);
            const existingTab1 = lasttabs.find(tab => 
            tab.url === currentTab.url);
            //console.log(currentTab.url);
            
            var existingTab = null;
            if(existingTab2){
              existingTab = existingTab2;
            }else{
              console.log("mil gya |||||||||||");
              existingTab = existingTab1;
            }

          if (!existingTab && currentTab.favIconUrl ) {
            // If tab with this ID doesn't exist in tabDatafinal, add it
            newtabs.push(currentTab);
            console.log("adding tab "+ currentTab.title+ " "+currentTab.tabid);
          } else if (existingTab &&currentTab.url && existingTab.title && existingTab.url&& currentTab.title &&  existingTab.url !== currentTab.url) {
            // If tab with this ID exists but title or URL has changed, update it
            const t1 = existingTab.url.split('.');
            const t2 = currentTab.url.split('.');
            if(t1[0]!=t2[0] || t1[1]!=t2[1] ){
              console.log(t1,"and",t2)
              newtabs.push(currentTab);
              console.log("adding tab broo"+ currentTab.title+ " "+currentTab.tabid+" "+currentTab.url+" "+currentTab.favIconUrl);
            }else{
              existingTab.title = currentTab.title;
            }
            
          }
        });
        }else{
          newtabs = tabDatafinal;
          console.log("else here")
        }
        var token;
        chrome.storage.local.get(['token69'], (result) => {
          if(result.token69 && newtabs.length>0){
            token = result.token69
            console.log(token+ "           CALLING BACKENDDDDDD") 
            chrome.storage.local.set({ 'laststore': JSON.stringify(tabDatafinal) }, () => {
                    console.log('Token received and stored in background.');
                  });  
            fetch('https://extensionbackend.hamdidcarel.workers.dev/savetabs', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ tabs: newtabs }),
            })
              .then(response => response.json())
              .then(data => {
                console.log('Tabs successfully stored in the backend:', data);
                chrome.storage.local.set({ 'laststore': JSON.stringify(tabDatafinal) }, () => {
                  console.log('Token received and stored in background.');
                });
              })
              .catch(error => {
                console.error('Error storing tabs in the backend:', error);
              });
          }
        });
  
      
        
      } catch (err) {
        console.log(err);
      }
    }
   })
    
      
    
}

// Listen for extension installation or manual trigger to fetch all tabs
chrome.runtime.onInstalled.addListener(() => {
  //getAllTabs(); 
});

// Trigger fetching tabs on the extension icon click
chrome.action.onClicked.addListener((tab) => {
  getAllTabs();
});

// Listen for new tabs being created
chrome.tabs.onCreated.addListener((tab) => {
  //getAllTabs();
});

function getTabData(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (tab) {
      const tabData = {
        url: tab.url,
        title: tab.title,
        id: tab.id,
        favIconUrl: tab.favIconUrl,
      };
      // Send the updated tab data to the backend or process it
      sendTabsToBackend([tabData]);
    }
  });
}
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("updatessssssssssssssssssssssssssssssssssss")
//   console.log(tab.title+" "+ tab.url+" "+tab.id+" "+tabId);
 getAllTabs();

});


chrome.tabs.onRemoved.addListener((tab) => {
    const tabId = tab;
    const existingTab = tabDatafinal.find(tab => tab.id === tabId);
    
    if (!existingTab) {
      
    } else{
      // If tab with this ID exists but title or URL has changed, update it
      existingTab.type = 3;
    }
  
});






// chrome.runtime.onSuspend.addListener(() => {
//   getAllTabs();
  
// });


