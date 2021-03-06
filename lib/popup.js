// Generated by CoffeeScript 1.6.3
(function() {
  var dom, getCurrentZoomLevel, parseChromeData, showError;

  dom = {
    zoomInButton: $('.zoomInButton'),
    zoomOutButton: $('.zoomOutButton'),
    zoomResetButton: $('.zoomResetButton'),
    currentZoom: $('.currentZoom'),
    optionsLink: $('.optionsLink'),
    zoomBox: $('.zoomBox'),
    errorMsgBox: $('.errorMsgBox')
  };

  showError = function(msg) {
    dom.zoomBox.hide();
    return dom.errorMsgBox.removeClass('hidden').text(msg);
  };

  parseChromeData = function(cb) {
    return function(data) {
      return cb(data != null ? data[0] : null);
    };
  };

  getCurrentZoomLevel = function() {
    return chrome.tabs.executeScript({
      code: "util.getFromLocalStorage('zoomLevel');"
    }, parseChromeData(function(data) {
      data = data || 0;
      return dom.currentZoom.text("" + ((Math.round(data * 10) * 10 + 100).toFixed()) + "%");
    }));
  };

  _.each(['in', 'out', 'reset'], function(type) {
    return dom["zoom" + (util.capitalize(type)) + "Button"].click(function() {
      return chrome.extension.sendMessage({
        key: util.KEYS["ZOOM_" + (type.toUpperCase()) + "_KEY"]
      }, function(res) {
        return chrome.tabs.executeScript({
          code: "Mousetrap.trigger('" + res.key + "');"
        }, function() {
          return getCurrentZoomLevel();
        });
      });
    });
  });

  chrome.tabs.executeScript({
    code: 'window.zoomTextOnlyLoaded'
  }, function(data) {
    if (data != null) {
      data = data[0];
      if (data) {
        return getCurrentZoomLevel();
      } else {
        return showError('Reload page first');
      }
    } else {
      return showError("Can't zoom on this page");
    }
  });

  dom.optionsLink.click(function() {
    var optionsUrl;
    optionsUrl = chrome.extension.getURL('lib/options.html');
    return chrome.tabs.query({}, function(extensionTabs) {
      var found, i;
      found = false;
      i = 0;
      while (i < extensionTabs.length) {
        if (optionsUrl === extensionTabs[i].url) {
          found = true;
          chrome.tabs.update(extensionTabs[i].id, {
            selected: true
          });
        }
        i++;
      }
      if (!found) {
        return chrome.tabs.create({
          url: optionsUrl
        });
      }
    });
  });

}).call(this);
