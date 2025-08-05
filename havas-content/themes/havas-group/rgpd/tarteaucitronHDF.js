'use strict';

//surcharge de la fonction color pour retirer les border left
tarteaucitron.userInterface.color = function (key, status) {
    var gray = '#808080',
        greenDark = '#1B870B',
        greenLight = '#E6FFE2',
        redDark = '#9C1A1A',
        redLight = '#FFE2E2',
        yellowDark = '#FBDA26',
        c = 'tarteaucitron',
        nbDenied = 0,
        nbPending = 0,
        nbAllowed = 0,
        sum = tarteaucitron.job.length,
        index;

    document.getElementById(key + 'Line').querySelector('.tarteaucitronContainerRadio').style['opacity'] = 1;

    if (status === true) {
        //status === true === autoriser service
        // tarteaucitron.userInterface.css(key, 'backgroundColor', greenDark);
        // tarteaucitron.userInterface.css(key, 'backgroundColor', gray);

        document.getElementById(key + 'Line').classList.add('tarteaucitronIsAllowed');
        document.getElementById(key + 'Line').classList.remove('tarteaucitronIsDenied');
        document.getElementById(key + 'Line').querySelector('.tarteaucitronServiceInputCheckbox').checked = true;
    } else if (status === false) {
        //status === false === bloquer le service
        // tarteaucitron.userInterface.css(key + 'Allowed', 'backgroundColor', gray);
        // tarteaucitron.userInterface.css(key + 'Denied', 'backgroundColor', redDark);

        document.getElementById(key + 'Line').classList.remove('tarteaucitronIsAllowed');
        document.getElementById(key + 'Line').classList.add('tarteaucitronIsDenied');
        document.getElementById(key + 'Line').querySelector('.tarteaucitronServiceInputCheckbox').checked = false;
    }

    // check if all services are allowed
    for (index = 0; index < sum; index += 1) {
        if (tarteaucitron.state[tarteaucitron.job[index]] === false) {
            nbDenied += 1;
        } else if (tarteaucitron.state[tarteaucitron.job[index]] === undefined) {
            nbPending += 1;
        } else if (tarteaucitron.state[tarteaucitron.job[index]] === true) {
            nbAllowed += 1;
        }
    }

    // tarteaucitron.userInterface.css(c + 'DotGreen', 'width', ((100 / sum) * nbAllowed) + '%');
    // tarteaucitron.userInterface.css(c + 'DotYellow', 'width', ((100 / sum) * nbPending) + '%');
    // tarteaucitron.userInterface.css(c + 'DotRed', 'width', ((100 / sum) * nbDenied) + '%');

    if (nbDenied === 0 && nbPending === 0) {
        document.getElementById('tarteaucitronAll').checked = true;
        document.getElementById('tarteaucitronScrollbarAdjust').style['opacity'] = 1;
        // tarteaucitron.userInterface.css(c + 'AllAllowed', 'backgroundColor', greenDark);
        // tarteaucitron.userInterface.css(c + 'AllDenied', 'opacity', '0.4');
        // tarteaucitron.userInterface.css(c + 'AllAllowed', 'opacity', '1');
    } else if (nbAllowed === 0 && nbPending === 0) {
        document.getElementById('tarteaucitronAll').checked = false;
        document.getElementById('tarteaucitronScrollbarAdjust').style['opacity'] = 1;
        // tarteaucitron.userInterface.css(c + 'AllAllowed', 'opacity', '0.4');
        // tarteaucitron.userInterface.css(c + 'AllDenied', 'opacity', '1');
        // tarteaucitron.userInterface.css(c + 'AllDenied', 'backgroundColor', redDark);
    } 

    // close the alert if all service have been reviewed
    if (nbPending === 0) {
        tarteaucitron.userInterface.closeAlert();
    }

    if (tarteaucitron.services[key].cookies.length > 0 && status === false) {
        tarteaucitron.cookie.purge(tarteaucitron.services[key].cookies);
    }

    if (status === true) {
        if (document.getElementById('tacCL' + key) !== null) {
            document.getElementById('tacCL' + key).innerHTML = '...';
        }
        setTimeout(function () {
            tarteaucitron.cookie.checkCount(key);
        }, 2500);
    } else {
        tarteaucitron.cookie.checkCount(key);
    }
};

//surcharge fonction addservice pour modifier les boutons des services en input checkbox
tarteaucitron.addService = function (serviceId) {
    "use strict";

    var html = '',
        s = tarteaucitron.services,
        service = s[serviceId],
        cookie = tarteaucitron.cookie.read(),
        hostname = document.location.hostname,
        hostRef = document.referrer.split('/')[2],
        isNavigating = hostRef === hostname && window.location.href !== tarteaucitron.parameters.privacyUrl ? true : false,
        isAutostart = !service.needConsent ? true : false,
        isWaiting = cookie.indexOf(service.key + '=wait') >= 0 ? true : false,
        isDenied = cookie.indexOf(service.key + '=false') >= 0 ? true : false,
        isAllowed = cookie.indexOf(service.key + '=true') >= 0 ? true : false,
        isResponded = cookie.indexOf(service.key + '=false') >= 0 || cookie.indexOf(service.key + '=true') >= 0 ? true : false,
        isDNTRequested = navigator.doNotTrack === "1" || navigator.doNotTrack === "yes" || navigator.msDoNotTrack === "1" || window.doNotTrack === "1" ? true : false,
        inputChecked = isAllowed === true ? "checked" : "";

    if (tarteaucitron.added[service.key] !== true) {
        tarteaucitron.added[service.key] = true;

        html += '<div id="' + service.key + 'Line" class="tarteaucitronLine">';
        html += '   <div class="tarteaucitronName">';
        html += '       <span class="tarteaucitronH3" role="heading" aria-level="4">' + service.name + '</span>';
        // html += '       <span id="tacCL' + service.key + '" class="tarteaucitronListCookies"></span><br/>';
        if (tarteaucitron.parameters.moreInfoLink == true) {
            html += '       <a href="https://opt-out.ferank.eu/service/' + service.key + '/" target="_blank" rel="noopener" title="' + tarteaucitron.lang.services[service.key].readmore + ' ' + tarteaucitron.lang.newWindow + '">';
            html += '           ' + tarteaucitron.lang.more;
            html += '       </a>';
            html += ' - '
            html += '       <a href="' + service.uri + '" target="_blank" rel="noopener" title="' + tarteaucitron.lang.services[service.key].website + ' ' + tarteaucitron.lang.newWindow + '">';
            html += '           ' + tarteaucitron.lang.source;
            html += '       </a>';
        }
        html += '   </div>';
        html += '   <div class="tarteaucitronAsk">';
        html += '       <div class="tarteaucitronContainerRadio"><input ' + inputChecked + ' type="checkbox" role="switch" id="' + service.key + '" class="tarteaucitronServiceInputCheckbox" onclick="tarteaucitron.radioBtService(this)">';
        html += '           <label class="tarteaucitronLabelCheckBox" for="' + service.key + '" title="' + service.name + '"><span aria-hidden="true" class="allowTxt">' + tarteaucitron.lang.allow + '</span><span aria-hidden="true" class="denyTxt">';
        html += '           ' + tarteaucitron.lang.deny + '</span><span class="tarteaucitronCheckBoxBt"></span></label>';
        html += '       </input></div>';
        html += '   </div>';
        html += '</div>';

        tarteaucitron.userInterface.css('tarteaucitronServicesTitle_' + service.type, 'display', 'block');

        if (document.getElementById('tarteaucitronServices_' + service.type) !== null) {
            document.getElementById('tarteaucitronServices_' + service.type).innerHTML += html;
        }

        tarteaucitron.userInterface.order(service.type);
    }

    // allow by default for non EU
    if (isResponded === false && tarteaucitron.user.bypass === true) {
        isAllowed = true;
        tarteaucitron.cookie.create(service.key, true);
    }

    if (!isResponded && (isAutostart || isNavigating && isWaiting) && !tarteaucitron.highPrivacy || isAllowed) {
        if (!isAllowed) {
            tarteaucitron.cookie.create(service.key, true);
        }
        if (tarteaucitron.launch[service.key] !== true) {
            tarteaucitron.launch[service.key] = true;
            service.js();
        }
        tarteaucitron.state[service.key] = true;
        tarteaucitron.userInterface.color(service.key, true);
    } else if (isDenied) {
        if (typeof service.fallback === 'function') {
            service.fallback();
        }
        tarteaucitron.state[service.key] = false;
        tarteaucitron.userInterface.color(service.key, false);
    } else if (!isResponded && isDNTRequested && tarteaucitron.handleBrowserDNTRequest) {
        tarteaucitron.cookie.create(service.key, 'false');
        if (typeof service.fallback === 'function') {
            service.fallback();
        }
        tarteaucitron.state[service.key] = false;
        tarteaucitron.userInterface.color(service.key, false);
    } else if (!isResponded) {
        tarteaucitron.cookie.create(service.key, 'wait');
        if (typeof service.fallback === 'function') {
            service.fallback();
        }
        tarteaucitron.userInterface.color(service.key, 'wait');
        tarteaucitron.userInterface.openAlert();
    }

    tarteaucitron.cookie.checkCount(service.key);
};

//modifs des boutons "autoriser tous les services" ou "interdire tous les services" par un checkbox
tarteaucitron.load = function (ele) {
    var cdn = tarteaucitron.cdn,
        language = tarteaucitron.getLanguage(),
        pathToLang = cdn + 'lang/tarteaucitron.' + language + '.js?v=' + tarteaucitron.version,
        pathToServices = cdn + 'tarteaucitron.services.js?v=' + tarteaucitron.version,
        linkElement = document.createElement('link'),
        defaults = {
            "adblocker": false,
            "hashtag": '#tarteaucitron',
            "cookieName": 'tarteaucitron',
            "highPrivacy": false,
            "orientation": "top",
            "removeCredit": false,
            "showAlertSmall": true,
            "cookieslist": true,
            "handleBrowserDNTRequest": false,
            "AcceptAllCta": false,
            "moreInfoLink": true,
            "privacyUrl": "",
            "cookieUrl": "",
            "useExternalCss": false
        },
        params = tarteaucitron.parameters;

    // Step 0: get params
    if (params !== undefined) {

        for (var k in defaults) {
            if (!tarteaucitron.parameters.hasOwnProperty(k)) {
                tarteaucitron.parameters[k] = defaults[k];
            }
        }
    }

    // global
    tarteaucitron.orientation = tarteaucitron.parameters.orientation;
    tarteaucitron.hashtag = tarteaucitron.parameters.hashtag;
    tarteaucitron.highPrivacy = tarteaucitron.parameters.highPrivacy;
    tarteaucitron.handleBrowserDNTRequest = tarteaucitron.parameters.handleBrowserDNTRequest;

    // Step 1: load css
    if (!tarteaucitron.parameters.useExternalCss) {
        linkElement.rel = 'stylesheet';
        linkElement.type = 'text/css';
        linkElement.href = cdn + 'css/tarteaucitron.css?v=' + tarteaucitron.version;
        document.getElementsByTagName('head')[0].appendChild(linkElement);
    }
    // Step 2: load language and services
    tarteaucitron.addScript(pathToLang, 'rgpd-lang', function () {

        if (tarteaucitronCustomText !== '') {
            tarteaucitron.lang = tarteaucitron.AddOrUpdate(tarteaucitron.lang, tarteaucitronCustomText);
        }
        tarteaucitron.addScript(pathToServices, 'rgpd-services', function () {

            var body = document.body,
                div = document.createElement('div'),
                html = '',
                index,
                orientation = 'Top',
                cat = ['ads', 'analytic', 'api', 'comment', 'social', 'support', 'video', 'other'],
                i;

            // cat = cat.sort(function (a, b) {
            //     if (tarteaucitron.lang[a].title > tarteaucitron.lang[b].title) {
            //         return 1;
            //     }
            //     if (tarteaucitron.lang[a].title < tarteaucitron.lang[b].title) {
            //         return -1;
            //     }
            //     return 0;
            // });

            // Step 3: prepare the html
            html += '<div id="tarteaucitronPremium"></div>';
            html += '<button id="tarteaucitronBack" onclick="tarteaucitron.userInterface.closePanel();" aria-label="' + tarteaucitron.lang.close + '"></button>';
            html += '<div id="tarteaucitron" role="dialog" aria-labelledby="dialogTitle">';
            html += '       <button id="tarteaucitronClosePanel" onclick="tarteaucitron.userInterface.closePanel();">';
            html += '       <span class="sr-only">' + tarteaucitron.lang.close + '</span>';
            html += '       </button>';
            html += '   <div id="tarteaucitronServices">';
            html += '      <div class="tarteaucitronLine tarteaucitronMainLine" id="tarteaucitronMainLineOffset">';
            html += '         <span class="tarteaucitronH1" aria-level="1" role="heading" id="dialogTitle">' + tarteaucitron.lang.title + '</span>';
            html += '         <div id="tarteaucitronInfo" class="tarteaucitronInfoBox">';
            html += '         ' + tarteaucitron.lang.intro;
            if (tarteaucitron.parameters.privacyUrl !== "") {
                html += '   <br/><br/>';
                html += '   <button role="link" id="tarteaucitronPrivacyUrl" onclick="document.location = tarteaucitron.parameters.privacyUrl">';
                html += '       ' + tarteaucitron.lang.privacyUrl;
                html += '   </button>';
            }
            html += '         </div>';
            html += '         <div class="tarteaucitronDefaults">'           
            html += '            <div>'
            html += '                <div class="tarteaucitronTitle">'               
            html += '                   <span class="tarteaucitronH2" role="heading" aria-level="2">' + tarteaucitron.lang.noConsentTitle + '</span>'           
            html += '                 </div>'           
            html += '                 <div class="tarteaucitronAsk">'             
            html += '                   <div class="tarteaucitronContainerRadio"><input role="switch" type="checkbox" id="tarteaucitronDefault" checked="checked" class="tarteaucitronServiceInputCheckbox" disabled>';
            html += '                       <label title="' + tarteaucitron.lang.noConsentTitle + '" class="tarteaucitronLabelCheckBox" for="tarteaucitronDefault"><span aria-hidden="true" class="allowTxt">' + tarteaucitron.lang.allow + '</span><span aria-hidden="true" class="denyTxt">';
            html += '                       ' + tarteaucitron.lang.deny + '</span><span class="tarteaucitronCheckBoxBt"></span></label>';
            html += '                   </input></div>';         
            html += '                 </div>'
            html += '             </div>'           
            html += '             <div class="tarteaucitronDetails">'            
            html += '                <p>' + tarteaucitron.lang.noConsentDetails + '</p>'               
            html += '             </div>'        
            html += '          </div>'
            html += '         <div class="tarteaucitronName">';
            html += '            <span class="tarteaucitronH2" role="heading" aria-level="2">' + tarteaucitron.lang.all + '</span>';
            html += '         </div>';
            html += '         <div class="tarteaucitronAsk" id="tarteaucitronScrollbarAdjust">';
            html += '       <div class="tarteaucitronContainerRadio"><input type="checkbox" role="switch" id="tarteaucitronAll" class="tarteaucitronServiceInputCheckbox" onclick="tarteaucitron.radioBtAllService(this)">';
            html += '           <label title="' + tarteaucitron.lang.all + '" class="tarteaucitronLabelCheckBox" for="tarteaucitronAll"><span aria-hidden="true" class="allowTxt">' + tarteaucitron.lang.allow + '</span><span aria-hidden="true" class="denyTxt">';
            html += '           ' + tarteaucitron.lang.deny + '</span><span class="tarteaucitronCheckBoxBt"></span></label>';
            html += '       </input></div>';
            // html += '            <button id="tarteaucitronAllAllowed" class="tarteaucitronAllow" onclick="tarteaucitron.userInterface.respondAll(true);">';
            // html += '               &#10003; ' + tarteaucitron.lang.allowAll;
            // html += '            </button> ';
            // html += '            <button id="tarteaucitronAllDenied" class="tarteaucitronDeny" onclick="tarteaucitron.userInterface.respondAll(false);">';
            // html += '               &#10007; ' + tarteaucitron.lang.denyAll;
            // html += '            </button>';
            html += '         </div>';
            html += '      </div>';
            html += '      <div class="tarteaucitronBorder">';
            html += '         <div class="clear"></div><div>';
            for (i = 0; i < cat.length; i += 1) {
                html += '         <div id="tarteaucitronServicesTitle_' + cat[i] + '" class="tarteaucitronHidden">';
                html += '            <div class="tarteaucitronTitle" role="heading" aria-level="3">';
                html += '               ' + tarteaucitron.lang[cat[i]].title;
                html += '            </div>';
                html += '            <div id="tarteaucitronDetails' + cat[i] + '" class="tarteaucitronDetails tarteaucitronInfoBox">';
                html += '               ' + tarteaucitron.lang[cat[i]].details;
                html += '            </div>';
                html += '         <div id="tarteaucitronServices_' + cat[i] + '"></div></div>';
            }
            html += '         </div>';
            //html += '         <div class="tarteaucitronHidden" id="tarteaucitronScrollbarChild" style="height:20px;display:block"></div>';
            html += '         <div id="tarteaucitronBottomButtons"><button id="tarteaucitronBottomButtonsClose" onclick="tarteaucitron.userInterface.respondNone();tarteaucitron.userInterface.closePanel();">' + tarteaucitron.lang.save + '<span class="sr-only">' + tarteaucitron.lang.srSave +'</span>' + '</button></div>';
            if (tarteaucitron.parameters.removeCredit === false) {
                html += '     <a class="tarteaucitronSelfLink" href="https://opt-out.ferank.eu/" rel="nofollow noopener" target="_blank" title="tarteaucitron ' + tarteaucitron.lang.newWindow + '">ðŸ‹ ' + tarteaucitron.lang.credit + '</a>';
            }
            html += '       </div>';
            html += '   </div>';
            html += '</div>';

            if (tarteaucitron.parameters.orientation === 'bottom') {
                orientation = 'Bottom';
            }

            if (tarteaucitron.parameters.highPrivacy && !tarteaucitron.parameters.AcceptAllCta) {
                html += '<div id="tarteaucitronAlertBig" class="tarteaucitronAlertBig' + orientation + '">';
                html += '   <span id="tarteaucitronDisclaimerAlert">';
                html += '       ' + tarteaucitron.lang.alertBigPrivacy;
                html += '   </span>';
                html += '   <button id="tarteaucitronPersonalize" onclick="tarteaucitron.userInterface.openPanel(); tarteaucitron.userInterface.closeAlert();">';
                html += '       ' + tarteaucitron.lang.personalize;
                html += '   </button>';

                if (tarteaucitron.parameters.privacyUrl !== "") {
                    html += '   <button role="link" id="tarteaucitronPrivacyUrl" onclick="document.location = tarteaucitron.parameters.privacyUrl">';
                    html += '       ' + tarteaucitron.lang.privacyUrl;
                    html += '   </button>';
                }

                html += '</div>';
            } else {
                html += '<div id="tarteaucitronAlertBig" class="tarteaucitronAlertBig' + orientation + '">';
                html += '   <div id="tarteaucitronAlertBigContent">';
                if(tarteaucitron.lang.alertBigPrivacyTitle) {
                    html += '   <h1 id="tarteaucitronDisclaimerAlertTitle">'+tarteaucitron.lang.alertBigPrivacyTitle+'</h1>';
                }
                html += '   <span id="tarteaucitronDisclaimerAlert">';

                if (tarteaucitron.parameters.highPrivacy) {
                    html += ' ' + tarteaucitron.lang.alertBigPrivacy;
                    if(tarteaucitron.parameters.cookieUrl) {
                        html += ' <a href="'+tarteaucitron.parameters.cookieUrl+'" target="_blank">' + tarteaucitron.lang.cookieUrl+'</a>';
                    }
                    if(tarteaucitron.parameters.cookieUrl && tarteaucitron.parameters.privacyUrl) {
                        html += ' ' + tarteaucitron.lang.liaisonUrl
                    }
                    if(tarteaucitron.parameters.privacyUrl) {
                        html += ' <a href="'+tarteaucitron.parameters.privacyUrl+'" target="_blank">' + tarteaucitron.lang.privacyUrl+'</a>';
                    }
                } else {
                    html += '       ' + tarteaucitron.lang.alertBigClick + ' ' + tarteaucitron.lang.alertBig;
                }

                html += '   </span>';

                html += '   <ul id="tarteaucitronAlertButtons">';
                html += '         <li><button id="tarteaucitronCloseAlert" onclick="tarteaucitron.userInterface.respondAll(true);">';
                html += '            ' + tarteaucitron.lang.acceptAll;
                html += '         </button></li>';
                html += '         <li><button id="tarteaucitronDenyAll" onclick="tarteaucitron.userInterface.respondAll(false);">';
                html += '            ' + tarteaucitron.lang.denyAll;
                html += '         </button></li>';
                html += '         <li><button id="tarteaucitronPersonalize" onclick="tarteaucitron.userInterface.openPanel(); tarteaucitron.userInterface.closeAlert();">';
                html += '             ' + tarteaucitron.lang.personalize;
                html += '         </button></li>';



                html += '   </ul>';

                // if (tarteaucitron.parameters.privacyUrl !== "") {
                //     html += '   <button id="tarteaucitronPrivacyUrl" onclick="document.location = tarteaucitron.parameters.privacyUrl">';
                //     html += '       ' + tarteaucitron.lang.privacyUrl;
                //     html += '   </button>';
                // }

                html += '</div>';
                html += '</div>';

                html += '<div id="tarteaucitronPercentage"></div>';
            }

            if (tarteaucitron.parameters.showAlertSmall === true) {
                html += '<div id="tarteaucitronAlertSmall" class="tarteaucitronAlertSmall' + orientation + '">';
                html += '   <button id="tarteaucitronManager" onclick="tarteaucitron.userInterface.openPanel();">';
                html += '       ' + tarteaucitron.lang.alertSmall;
                html += '       <span id="tarteaucitronDot">';
                html += '           <span id="tarteaucitronDotGreen"></span>';
                html += '           <span id="tarteaucitronDotYellow"></span>';
                html += '           <span id="tarteaucitronDotRed"></span>';
                html += '       </span>';
                if (tarteaucitron.parameters.cookieslist === true) {
                    html += '   </button><!-- @whitespace';
                    html += '   --><button id="tarteaucitronCookiesNumber" onclick="tarteaucitron.userInterface.toggleCookiesList();">0</button>';
                    html += '   <div id="tarteaucitronCookiesListContainer">';
                    html += '       <button id="tarteaucitronClosePanelCookie" onclick="tarteaucitron.userInterface.closePanel();">';
                    html += '           ' + tarteaucitron.lang.close;
                    html += '       </button><span class="tarteaucitronClosePanel-close">Ã—</span>';
                    html += '       <div class="tarteaucitronCookiesListMain" id="tarteaucitronCookiesTitle">';
                    html += '            <span class="tarteaucitronH2" role="heading"  id="tarteaucitronCookiesNumberBis">0 cookie</span>';
                    html += '       </div>';
                    html += '       <div id="tarteaucitronCookiesList"></div>';
                    html += '    </div>';
                } else {
                    html += '   </div>';
                }
                html += '</div>';
            }

            tarteaucitron.addScript(tarteaucitron.cdn + 'advertising.js?v=' + tarteaucitron.version, '', function () {
                if (tarteaucitronNoAdBlocker === true || tarteaucitron.parameters.adblocker === false) {

                    // create a wrapper container at the same level than tarteaucitron so we can add an aria-hidden when tarteaucitron is opened
                    /*var wrapper = document.createElement('div');
                    wrapper.id = "contentWrapper";
                     while (document.body.firstChild)
                    {
                        wrapper.appendChild(document.body.firstChild);
                    }
                     // Append the wrapper to the body
                    document.body.appendChild(wrapper);*/

                    div.id = 'tarteaucitronRoot';
                    body.appendChild(div, body);
                    div.innerHTML = html;

                    if (tarteaucitron.job !== undefined) {
                        tarteaucitron.job = tarteaucitron.cleanArray(tarteaucitron.job);
                        for (index = 0; index < tarteaucitron.job.length; index += 1) {
                            tarteaucitron.addService(tarteaucitron.job[index]);
                        }
                    } else {
                        tarteaucitron.job = [];
                    }

                    tarteaucitron.isAjax = true;

                    tarteaucitron.job.push = function (id) {

                        // ie <9 hack
                        if (typeof tarteaucitron.job.indexOf === 'undefined') {
                            tarteaucitron.job.indexOf = function (obj, start) {
                                var i,
                                    j = this.length;
                                for (i = start || 0; i < j; i += 1) {
                                    if (this[i] === obj) {
                                        return i;
                                    }
                                }
                                return -1;
                            };
                        }

                        if (tarteaucitron.job.indexOf(id) === -1) {
                            Array.prototype.push.call(this, id);
                        }
                        tarteaucitron.launch[id] = false;
                        tarteaucitron.addService(id);
                    };

                    if (document.location.hash === tarteaucitron.hashtag && tarteaucitron.hashtag !== '') {
                        tarteaucitron.userInterface.openPanel();
                    }

                    tarteaucitron.cookie.number();
                    setInterval(tarteaucitron.cookie.number, 60000);
                }
            }, tarteaucitron.parameters.adblocker);

            if (tarteaucitron.parameters.adblocker === true) {
                setTimeout(function () {
                    if (tarteaucitronNoAdBlocker === false) {
                        html = '<div id="tarteaucitronAlertBig" class="tarteaucitronAlertBig' + orientation + '" style="display:block" role="alert" aria-live="polite">';
                        html += '   <p id="tarteaucitronDisclaimerAlert">';
                        html += '       ' + tarteaucitron.lang.adblock + '<br/>';
                        html += '       <strong>' + tarteaucitron.lang.adblock_call + '</strong>';
                        html += '   </p>';
                        html += '   </div id="tarteaucitronAlertButtons">';
                        html += '   <button id="tarteaucitronPersonalize" onclick="location.reload();">';
                        html += '       ' + tarteaucitron.lang.reload;
                        html += '   </button>';
                        html += '   </div>';
                        html += '</div>';
                        html += '<div id="tarteaucitronPremium"></div>';

                        // create wrapper container
                        /*var wrapper = document.createElement('div');
                        wrapper.id = "contentWrapper";
                         while (document.body.firstChild)
                        {
                            wrapper.appendChild(document.body.firstChild);
                        }
                         // Append the wrapper to the body
                        document.body.appendChild(wrapper);*/

                        div.id = 'tarteaucitronRoot';
                        body.appendChild(div, body);
                        div.innerHTML = html;
                        tarteaucitron.pro('!adblocker=true');
                    } else {
                        tarteaucitron.pro('!adblocker=false');
                    }
                }, 1500);
            }
        });
    });

    if (tarteaucitron.events.load) {
        tarteaucitron.events.load();
        // tarteaucitron.bandeauPos();
    }
};

//gestion des inputs checkboxs des services
tarteaucitron.radioBtService = function (ele) {
    if (ele.checked) {
        tarteaucitron.userInterface.respond(ele, true);
    } else {
        tarteaucitron.userInterface.respond(ele, false);
    }
};

//gestion des inputs checkboxs de "all services"
tarteaucitron.radioBtAllService = function (ele) {
    document.getElementById('tarteaucitronScrollbarAdjust').style['opacity'] = 1;
    if (ele.checked) {
        tarteaucitron.userInterface.respondAll(true);
    } else {
        tarteaucitron.userInterface.respondAll(false);
    }
};

// gestion du positionnement d'un bandeau fixe avec tarteaucitron
tarteaucitron.bandeauPos = function () {
    setTimeout(function () {
        var bandeau = document.getElementById('bandeau');
        var cookieBar = document.getElementById('tarteaucitronAlertBig');
        if (cookieBar) {
            var cookieBar_height = cookieBar.clientHeight;
            if (bandeau) bandeau.style.bottom = cookieBar_height + "px";
        }
        else bandeau.style.bottom = "0";
    }, 200);
};