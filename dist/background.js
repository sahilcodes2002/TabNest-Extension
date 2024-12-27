(()=>{"use strict";function o(o){return function(o){if(Array.isArray(o))return e(o)}(o)||function(o){if("undefined"!=typeof Symbol&&null!=o[Symbol.iterator]||null!=o["@@iterator"])return Array.from(o)}(o)||function(o,t){if(o){if("string"==typeof o)return e(o,t);var n={}.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(o):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?e(o,t):void 0}}(o)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function e(o,e){(null==e||e>o.length)&&(e=o.length);for(var t=0,n=Array(e);t<e;t++)n[t]=o[t];return n}var t=0,n=0;chrome.tabs.query({currentWindow:!0},(function(o){n=5,console.log("before backend call",n)}));var r=[];chrome.runtime.onMessage.addListener((function(e,t,n){"setToken"===e.action&&(console.log("Token received and stored in background."),chrome.storage.local.set({token69:e.token69},(function(){console.log("Token received and stored in background.")}))),"removeToken"===e.action&&chrome.storage.local.remove(["token69"],(function(){console.log("authToken removed from local storage")})),"removesavedtabs"===e.action&&chrome.storage.local.remove(["laststore"],(function(){console.log("laststore removed from local storage")})),"deleteHistory"===e.action&&chrome.storage.local.remove(["laststore"],(function(){console.log("laststore removed from local storage")})),"addtabs"===e.action&&chrome.storage.local.get(["laststore"],(function(t){if(t.laststore){var n=JSON.parse(t.laststore),r=(a=e.newtabs).filter((function(o){return!n.some((function(e){return e.tabid===o.tabid||e.url===o.url}))})),s=[].concat(o(n),o(r));chrome.storage.local.set({laststore:JSON.stringify(s)},(function(){console.log("Unique tabs added to local storage:",s)}))}else{var a=e.newtabs;chrome.storage.local.set({laststore:JSON.stringify(a)},(function(){console.log("Tabs updated in local storage:",a)}))}}))}));var s=null;function a(){console.log(t),t+=1;var o=(new Date).toISOString();chrome.tabs.query({},(function(e){e.map((function(e){return{url:e.url,title:e.title,tabid:e.id,favIconUrl:e.favIconUrl,type:1,date:o}})).forEach((function(o){var e=r.find((function(e){return e.tabid===o.tabid}));!e&&o.favIconUrl?r.push(o):e&&o.url&&e.title&&e.url&&o.title&&(e.title!==o.title||e.url!==o.url)&&(e.title=o.title,e.url=o.url)})),t>n&&(t=0,n=5,s||(console.log("sendTabsToBackend"),chrome.storage.local.get(["laststore"],(function(o){if(!o.laststore||o.laststore&&JSON.parse(o.laststore)!=r)try{var e,t=[];if(o.laststore){var n=JSON.parse(o.laststore);r.forEach((function(o){var e=n.find((function(e){return e.tabid===o.tabid})),r=n.find((function(e){return e.url===o.url})),s=null;if(e?s=e:(console.log("mil gya |||||||||||"),s=r),!s&&o.favIconUrl)t.push(o),console.log("adding tab "+o.title+" "+o.tabid);else if(s&&o.url&&s.title&&s.url&&o.title&&s.url!==o.url){var a=s.url.split("."),l=o.url.split(".");a[0]!=l[0]||a[1]!=l[1]?(console.log(a,"and",l),t.push(o),console.log("adding tab broo"+o.title+" "+o.tabid+" "+o.url+" "+o.favIconUrl)):s.title=o.title}}))}else t=r,console.log("else here");chrome.storage.local.get(["token69"],(function(o){o.token69&&t.length>0&&(e=o.token69,console.log(e+"           CALLING BACKENDDDDDD"),chrome.storage.local.set({laststore:JSON.stringify(r)},(function(){console.log("Token received and stored in background.")})),fetch("https://extensionbackend.hamdidcarel.workers.dev/savetabs",{method:"POST",headers:{Authorization:"Bearer ".concat(e),"Content-Type":"application/json"},body:JSON.stringify({tabs:t})}).then((function(o){return o.json()})).then((function(o){console.log("Tabs successfully stored in the backend:",o),chrome.storage.local.set({laststore:JSON.stringify(r)},(function(){console.log("Token received and stored in background.")}))})).catch((function(o){console.error("Error storing tabs in the backend:",o)})))}))}catch(o){console.log(o)}})),s=setTimeout((function(){s=null}),1700)))}))}chrome.runtime.onInstalled.addListener((function(){})),chrome.action.onClicked.addListener((function(o){a()})),chrome.tabs.onCreated.addListener((function(o){})),chrome.tabs.onUpdated.addListener((function(o,e,t){console.log("updatessssssssssssssssssssssssssssssssssss"),a()})),chrome.tabs.onRemoved.addListener((function(o){var e=o,t=r.find((function(o){return o.id===e}));t&&(t.type=3)}))})();