/*chrome.webNavigation.onCompleted.addListener(function(details) {
    console.log("HI");
    if (window.location.href.indexOf("google.com") != -1) {
        chrome.storage.sync.get("timesGoogle", function(n) {
            chrome.storage.sync.set({"timesGoogle": n ? n+1 : 1});
            console.log(n);
        })
    }
});

setInterval(function() {
    console.log(3.14);
}, 1000)*/

var SM = (function () {

     var my = {};

     my.get = function (key) {
         return localStorage.getItem(key);
     }
     my.put = function (key, value) {
         return localStorage.setItem(key, value);
     }
     my.delete = function (key) {
         return localStorage.removeItem(key);
     }

     return my;

 }());

 var PB = (function (SM) {

     var my = {};
     var visits = 0;
     var currentState;

     my.blockTheseSites = {


         "https://ps01.bergen.org/*/*": "Powerschool"


     }

     if (!SM.get("blocklist")) {

         SM.put("blocklist", JSON.stringify(my.blockTheseSites));
     }

     my.setWatchThisInstead = function (value) {
         return 'stressrelief.html';
     }

     my.getWatchThisInstead = function () {
         return 'stressrelief.html';
     }

     my.getBlockedSites = function () {
         return JSON.parse(SM.get("blocklist"));
     }

     my.addBlockedSite = function (site) {
         my.blockedSites = JSON.parse(SM.get("blocklist"));
         my.blockedSites[site] = "Powerschool";
         SM.put("blocklist", JSON.stringify(my.blockedSites));
     };

     my.removeBlockedSite = function (site) {
         my.blockedSites = JSON.parse(SM.get("blocklist"));
         delete my.blockedSites[site];
         SM.put("blocklist", JSON.stringify(my.blockedSites));
     }




     return my;
     return visits;

 }(SM));

 //figure out how to store this w/ cookies

 function updateVisits() {
     if (!SM.get("visits")) {
         visits = 1;
         SM.put("visits", visits);


     } else {

         visits += 1;
         SM.put("visits", visits);


     }
 }




 function initialize() {

     chrome.tabs.onUpdated.addListener(function (tabId, changedInfo, tab) {

         var site;

         for (site in PB.getBlockedSites()) {
             if (tab.url.match(site)) {
                 chrome.tabs.update(tabId, {
                     "url": PB.getWatchThisInstead()
                 }, function () {});
                 localStorage.visits += 1;
             }
         }
     });

     chrome.tabs.onCreated.addListener(function (tab) {
         var site;
         for (site in PB.getBlockedSites()) {
             if (tab.url.match(site)) {
                 chrome.tabs.update(tab.id, {
                     "url": PB.getWatchThisInstead()
                 }, function () {});
                 localStorage.visits += 1;
             }
         }
     });
 }


window.addEventListener('load', initialize);



