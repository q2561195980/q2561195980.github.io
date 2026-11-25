(function () {
  var ua = navigator.userAgent
  var matchResult
  var chromiumVersion = null
  var browserName = ''
  var isIE = /MSIE\s\d/.test(ua) || /Trident\//.test(ua)

  if (isIE) {
    browserName = 'Internet Explorer'
  } else if ((matchResult = ua.match(/Edg\/(\d+)/))) {
    browserName = 'Edge'
    chromiumVersion = parseInt(matchResult[1], 10)
  } else if ((matchResult = ua.match(/OPR\/(\d+)/))) {
    browserName = 'Opera'
    var chromeMatch = ua.match(/Chrome\/(\d+)/)
    chromiumVersion = chromeMatch ? parseInt(chromeMatch[1], 10) : parseInt(matchResult[1], 10)
  } else if ((matchResult = ua.match(/Chrome\/(\d+)/))) {
    browserName = 'Chrome'
    chromiumVersion = parseInt(matchResult[1], 10)
  } else if ((matchResult = ua.match(/Chromium\/(\d+)/))) {
    browserName = 'Chromium'
    chromiumVersion = parseInt(matchResult[1], 10)
  }

  var shouldBlock = isIE || (chromiumVersion !== null && chromiumVersion < 119)

  if (shouldBlock) {
    var logoSrc = isIE ? '/assets/logos/browsers/internet-explorer.svg' : '/assets/logos/browsers/chrome.svg'
    var logoAlt = isIE ? 'Internet Explorer' : 'Chrome'
    var logoTag = '<img src="' + logoSrc + '" alt="' + logoAlt + '" width="64" height="64" style="margin:0 auto 16px;display:block;" />'

    var renderOverlay = function (texts) {
      var desc = isIE
        ? texts.desc
        : texts.desc.replace('{browser}', browserName).replace('{version}', chromiumVersion)
      var overlayMarkup =
     '<div id="browser-unsupported-overlay" style="position:fixed;top:0;left:0;right:0;bottom:0;background:#F6F7F9;color:#232835;z-index:999999;font-family:system-ui,-apple-system,sans-serif;text-align:center;padding:24px;">' +
      '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);max-width:480px;width:100%;">' +
        logoTag +
        '<h1 style="font-size:22px;margin:0 0 12px;color:#151922;">' + texts.title + '</h1>' +
        '<p style="font-size:15px;line-height:1.6;margin:0 0 16px;color:#556079;">' + desc + '<br><br>' + texts.hint + '</p>' +
        '<a href="https://www.google.cn/chrome/" target="_blank" style="display:inline-block;background:#00DC82;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-size:14px;">' + texts.btn + '</a>' +
        '</div></div>'

      var injectOverlay = function () {
        var container = document.createElement('div')
        container.innerHTML = overlayMarkup
        document.body.appendChild(container.firstChild)
      }

      if (document.body) {
        injectOverlay()
      } else {
        document.addEventListener('DOMContentLoaded', injectOverlay)
      }
    }

    var browserLang = (navigator.language || 'en').toLowerCase()
    var browserType = isIE ? 'internet-explorer' : 'chromium'
    var fallbackTexts = { title: 'Browser Not Supported', desc: 'Your browser is not supported. Please use a modern browser.', hint: 'Please upgrade your browser and try again.', btn: 'Download Chrome' }

    var xhr = new XMLHttpRequest()
    xhr.open('GET', '/browser-check-i18n.json', true)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          try {
            var i18n = JSON.parse(xhr.responseText)
            var normalized = {}
            for (var lang in i18n) {
              normalized[lang.toLowerCase()] = i18n[lang]
            }
            var locale = normalized[browserLang] || normalized[browserLang.split('-')[0]] || normalized['en-us']
            var texts = (locale && locale[browserType]) || (normalized['en-us'] && normalized['en-us'][browserType]) || fallbackTexts
            renderOverlay(texts)
          } catch (e) {
            renderOverlay(fallbackTexts)
          }
        } else {
          renderOverlay(fallbackTexts)
        }
      }
    }
    xhr.send()
  }
})()