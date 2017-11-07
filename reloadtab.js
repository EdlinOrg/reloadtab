
var reloadTabTimer = null;

function changeHoverText(tab, reloadMins) {

    var currentDate = new Date();
    var hours = currentDate.getHours();
    var futureMins = currentDate.getMinutes() + reloadMins;
    var secs = currentDate.getSeconds();

    if (futureMins > 59){
        hours += 1;
        futureMins -= 60;
    }
    
    if (futureMins < 10) {
    	futureMins = "0" + futureMins;
    }

    if (hours > 23) {
        hours = 0;
    }

    if (hours < 10) {
    	hours = "0" + hours;
    }
    
    if (secs < 10) {
    	secs = "0" + secs;
    }
    
    var dateStr = hours + ":" + futureMins + ":" + secs;    
    
    browser.browserAction.setTitle(
    	{'title': 'Will reload at: ' + dateStr, 'tabId': tab.id}
    );
}

function activatedAddon(tab) {

    var reloadMins = 5;

    if (reloadTabTimer != null) {
        clearTimeout(reloadTabTimer);
        browser.browserAction.setIcon(
            {'path': 'icons/icon-38.png', 'tabId': tab.id}
        );
        browser.browserAction.setTitle(
            {'title': 'Reload this tab every ' + reloadMins + ' min', 'tabId': tab.id}
        );
        reloadTabTimer = null;
        return;
    }

    browser.browserAction.setIcon(
    	{'path': 'icons/icon-red-38.png', 'tabId': tab.id}
    );

    changeHoverText(tab, reloadMins);
        
    reloadTabTimer = setInterval(function() {
        browser.tabs.reload(tab.id, {'bypassCache': true});
        changeHoverText(tab, reloadMins);
    }, reloadMins * 60 * 1000);
}

browser.browserAction.onClicked.addListener(activatedAddon);
