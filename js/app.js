/*
 * Copyright (c) 2016 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function () {

    var myapp = {

        SECOND_TO_MILLISECOND: 1000,

        // preference keys
        PREFERENCE_KEY_IS_RUNNING: 'isRunning',
        PREFERENCE_KEY_SPEED: 'speed',

        // main page
        MAIN_PAGE: 'main-page',
        MAIN_SPEED: 'content-speed',
        MAIN_SPEED_UNIT: 'content-speed-unit',
        MAIN_SETTINGS_BUTTON: 'settings-button',

        // settings page
        SETTINGS_PAGE: 'settings-page',
        SETTINGS_SAMPLE_INTERVAL: 'content-sample-interval-value',
        SETTINGS_CALLBACK_INTERVAL: 'content-callback-interval-value',
        SETTINGS_SLIDER_FOR_SAMPLE_INTERVAL: 'content-sample-interval',
        SETTINGS_SLIDER_FOR_CALLBACK_INTERVAL: 'content-callback-interval',
        SETTINGS_SET_INTERVAL_BUTTON: 'set-interval-button',

        // error popup
        ERROR_POPUP: 'error-popup',
        ERROR_POPUP_BUTTON: 'error-popup-button',
        ERROR_POPUP_MESSAGE: 'error-popup-message',

        // information popup
        INFORMATION_POPUP: 'information-popup',
        INFORMATION_POPUP_BUTTON: 'information-popup-button',

        data: {
            speed: 0,                    // default speed
            speedUnit: 'km/h',           // default speed unit
            sampleInterval: 1,           // default sample-interval
            callbackInterval: 150        // default callback-interval
        },

        ui: {
            mainpage: {
                speed: {},
                speedunit: {},
                settingsbutton: {}
            },
            settingspage: {
                sampleinterval: {},                // display the current sample interval to be set
                callbackinterval: {},              // display the current callback interval to be set
                sliderforsampleinterval: {},
                sliderforcallbackinterval: {}
            },
            errorpopup: {
                message: {},
                button: {}
            },
            informationpopup: {
                button: {}
            }
        },

        speedchangelistener: {
            set: {},
            onchange: {},
        },

        onerror: {},
        exit: {}

    };

    var init = function () {

        var self = this;

        /**
         *  Saves self.PREFERENCE_KEY_IS_RUNNING as false and exits this application.
         *  @private
         */
        self.exit = function () {

            try {
                tizen.preference.setValue(self.PREFERENCE_KEY_IS_RUNNING, false);
                tizen.application.getCurrentApplication().exit();
            } catch (ignore) {}

        };

        /**
         *  Returns an element for myapp.ui.mainpage.speed .
         *  @private
         */
        self.ui.mainpage.speed = (function (id) {

            return document.getElementById(id);

        })(self.MAIN_SPEED);

        /**
         *  Returns an element for myapp.ui.mainpage.speedunit .
         *  @private
         */
        self.ui.mainpage.speedunit = (function (id) {

            return document.getElementById(id);

        })(self.MAIN_SPEED_UNIT);

        /**
         *  Returns an element for myapp.ui.mainpage.settingsbutton .
         *  @private
         */
        self.ui.mainpage.settingsbutton = (function (id) {

            return document.getElementById(id);

        })(self.MAIN_SETTINGS_BUTTON);

        /**
         *  Returns an element for myapp.ui.settingspage.sampleinterval .
         *  @private
         */
        self.ui.settingspage.sampleinterval = (function (id) {

            return document.getElementById(id);

        })(self.SETTINGS_SAMPLE_INTERVAL);

        /**
         *  Returns an element for myapp.ui.settingspage.callbackinterval .
         *  @private
         */
        self.ui.settingspage.callbackinterval = (function (id) {

            return document.getElementById(id);

        })(self.SETTINGS_CALLBACK_INTERVAL);

        /**
         *  Returns an element for myapp.ui.settingspage.sliderforsampleinterval .
         *  @private
         */
        self.ui.settingspage.sliderforsampleinterval = (function (id) {

            return document.getElementById(id);

        })(self.SETTINGS_SLIDER_FOR_SAMPLE_INTERVAL);

        /**
         *  Returns an element for myapp.ui.settingspage.sliderforcallbackinterval .
         *  @private
         */
        self.ui.settingspage.sliderforcallbackinterval = (function (id) {

            return document.getElementById(id);

        })(self.SETTINGS_SLIDER_FOR_CALLBACK_INTERVAL);

        /**
         *  Returns an element for myapp.ui.settingspage.setintervalbutton .
         *  @private
         */
        self.ui.settingspage.setintervalbutton = (function (id) {

            return document.getElementById(id);

        })(self.SETTINGS_SET_INTERVAL_BUTTON);

        /**
         *  Returns an element for myapp.ui.errorpopup.message .
         *  @private
         */
        self.ui.errorpopup.message = (function (id) {

            return document.getElementById(id);

        })(self.ERROR_POPUP_MESSAGE);

        /**
         *  Returns an element for myapp.ui.errorpopup.button .
         *  @private
         */
        self.ui.errorpopup.button = (function (id) {

            return document.getElementById(id);

        })(self.ERROR_POPUP_BUTTON);

        /**
         *  Returns an element for myapp.ui.informationpopup.button .
         *  @private
         */
        self.ui.informationpopup.button = (function (id) {

            return document.getElementById(id);

        })(self.INFORMATION_POPUP_BUTTON);

        /**
         *  This function is for handling ERROR.
         *  @private
         *  @param {Tizen.WebAPIError} error - the error object to handle.
         */
        self.onerror = function (error) {

            self.ui.errorpopup.message.innerHTML = error.name;
            tau.openPopup('#' + self.ERROR_POPUP);

        };

        /**
         *  Get the current speed of the device periodically.
         *  @private
         *  @param {Number} sampleInterval - the interval to set in seconds.
         *  @param {Number} callbackInterval - the interval to set in seconds.
         */
        self.speedchangelistener.set = function (sampleInterval, callbackInterval) {

            try {

                var options = {};
                options.sampleInterval = sampleInterval * self.SECOND_TO_MILLISECOND;
                options.callbackInterval = callbackInterval * self.SECOND_TO_MILLISECOND;
                tizen.humanactivitymonitor.start('GPS', self.speedchangelistener.onchange, self.onerror, options);

            } catch (error) {

                self.onerror(error);

            }

        };

        /**
         *  A change callback to handle every time the current speed of the device is updated.
         *  In the handler function, the current speed of the device will be shared with the widget application
         *  by storing the data as myapp.PREFERENCE_KEY_SPEED using the Preference API.
         */
        self.speedchangelistener.onchange = function (info) {

            for (var idx = 0; idx < info.gpsInfo.length; ++idx) {

                self.data.speed = info.gpsInfo[idx].speed;
                self.ui.mainpage.speed.textContent = self.data.speed;

                try {

                    tizen.preference.setValue(self.PREFERENCE_KEY_SPEED, self.data.speed);

                } catch (error) {

                    self.onerror(error);

                }

            }

        };

    };

    /**
     *  Sets a function for window.onload .
     */
    window.onload = function () {

        init.call(myapp);

        window.addEventListener('tizenhwkey', function (ev) {

            if (ev.keyName === "back") {
                var page = document.getElementsByClassName( 'ui-page-active' )[0],
                    pageid = page ? page.id : "";
                if (pageid === myapp.MAIN_PAGE) {
                    myapp.exit();
                } else {
                    window.history.back();
                }
            }

        });

        /**
         *  This handler function will be called by clicking the Settings button on main-page.
         */
        myapp.ui.mainpage.settingsbutton.onclick = function () {

            // Navigates to myapp.SETTINGS_PAGE and opens myapp.INFORMATION_POPUP.
            tau.changePage(myapp.SETTINGS_PAGE);
            tau.openPopup('#' + myapp.INFORMATION_POPUP);

        };

        /**
         *  This handler function will be called by clicking the Set button on settings-page.
         */
        myapp.ui.settingspage.setintervalbutton.onclick = function () {

            // Using myapp.speedchangelistener.set() method the selected intervals will be updated for the listener.
            myapp.speedchangelistener.set(myapp.data.sampleInterval, myapp.data.callbackInterval);

        };

        /**
         *  This handler function will be called every time the selected value for Sample Interval is changed.
         *  The selected interval will be stored in myapp.data.sampleInterval
         *  and set it for minimum value for callbackinterval by clicking Set button on settings page.
         */
        myapp.ui.settingspage.sliderforsampleinterval.onchange = function () {

            myapp.data.sampleInterval = myapp.ui.settingspage.sliderforsampleinterval.value;
            myapp.ui.settingspage.sampleinterval.textContent = myapp.data.sampleInterval;
            myapp.ui.settingspage.sliderforcallbackinterval.min = myapp.data.sampleInterval;

            if (Number(myapp.data.callbackInterval) < Number(myapp.ui.settingspage.sliderforcallbackinterval.min)) {
                myapp.data.callbackInterval = myapp.ui.settingspage.sliderforcallbackinterval.min;
                myapp.ui.settingspage.callbackinterval.textContent = myapp.data.callbackInterval;
            }

        };

        /**
         *  This handler function will be called every time a selected value changed for Callback Interval.
         *  The selected interval will be stored in myapp.data.callbackInterval .
         */
        myapp.ui.settingspage.sliderforcallbackinterval.onchange = function () {

            myapp.data.callbackInterval = myapp.ui.settingspage.sliderforcallbackinterval.value;
            myapp.ui.settingspage.callbackinterval.textContent = myapp.data.callbackInterval;

        };

        /**
         *  This handler function will be called by clicking the OK button on error-popup.
         */
        myapp.ui.errorpopup.button.onclick = function () {

            tau.closePopup();

        };

        /**
         *  This handler function will be called by clicking the OK button on information-popup.
         */
        myapp.ui.informationpopup.button.onclick = function () {

            tau.closePopup();

        };

        /**
         *  Sets a flag to share the information about whether the UI application is running with a widget application.
         *  The flag is saved as myapp.PREFERENCE_KEY_IS_RUNNING in application preferences.
         */
        tizen.preference.setValue(myapp.PREFERENCE_KEY_IS_RUNNING, true);

        /**
         *  Sets a listener to retrieve the current speed of the device.
         */
        myapp.speedchangelistener.set(myapp.data.sampleInterval, myapp.data.callbackInterval);

    };

})();
