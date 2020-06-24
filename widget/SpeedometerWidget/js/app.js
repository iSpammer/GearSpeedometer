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

    var mywidget = {

        WARNING_SPEED: 70,
        DANGER_SPEED: 100,

        DEFAULT_BACKGROUND_COLOR: 'white',
        WARNING_BACKGROUND_COLOR: 'orange',
        DANGER_BACKGROUND_COLOR: 'red',

        // preference keys
        PREFERENCE_KEY_IS_RUNNING: 'isRunning',
        PREFERENCE_KEY_SPEED: 'speed',

        // mode
        STAND_ALONE_MODE: 'stand-alone-mode',
        COMPANION_MODE: 'companion-mode',

        // main page
        CONTENT_DEFAULT: 'content-default',
        CONTENT_LAUNCH_BUTTON: 'launch-button',
        CONTENT_SPEED: 'content-speed',
        CONTENT_SPEED_UNIT: 'content-speed-unit',

        application: {
            launch: {},
            isRunning: {},
            setStateChangeListener: {}
        },

        ui: {
            setMode: {},
            init: {},
            contentdefault: {},
            launchbutton: {},
            contentspeed: {},
            contentspeedunit: {},
            body: {}
        },

        isSpeedChangedListenerSet: false,
        setSpeedChangeListener: {},
        unsetSpeedChangeListener: {},

        onstatechange: {},
        onspeedchange: {}

    };

     var init = function () {

        var self = this;

        /**
         *  A listener for retrieving the application state change
         */
        self.onstatechange = function (data) {

            console.log('[mywidget] statechangelistener enter');

            if (data.value === true) {

                // the application is running
                self.setSpeedChangeListener(self.speedchangeiistener);
                self.ui.setMode(self.COMPANION_MODE);

            } else if (data.value === false) {

                // the application is not running
                self.unsetSpeedChangeListener();
                self.ui.setMode(self.STAND_ALONE_MODE);

            }

        };

        /**
         *  A listener for retrieving the speed change
         */
        self.onspeedchange = function (data) {

            console.log('[mywidget] speedchangeiistener enter');

            if (data.value < self.WARNING_SPEED) {

                self.ui.body.style.backgroundColor = self.DEFAULT_BACKGROUND_COLOR;

            } else if (data.value < self.DANGER_SPEED) {

                self.ui.body.style.backgroundColor = self.WARNING_BACKGROUND_COLOR;

            } else {

                self.ui.body.style.backgroundColor = self.DANGER_BACKGROUND_COLOR;

            }

            self.ui.contentspeed.textContent = data.value;

        };

        /**
         *  Sets Mode to change UI
         */
        self.ui.setMode = function (mode) {

            self.ui.body.style.backgroundColor = self.DEFAULT_BACKGROUND_COLOR;

            if (mode === self.STAND_ALONE_MODE) {

                self.ui.contentspeed.style.display = 'none';
                self.ui.contentspeedunit.style.display = 'none';
                self.ui.contentdefault.style.display = 'block';
                self.ui.launchbutton.style.display = 'block';

            } else if (mode === self.COMPANION_MODE) {

                self.ui.contentspeed.style.display = 'block';
                self.ui.contentspeedunit.style.display = 'block';
                self.ui.contentdefault.style.display = 'none';
                self.ui.launchbutton.style.display = 'none';

            }

        };

        /**
         *  Returns a DOM element for mywidget.ui.contentdefault .
         */
        self.ui.contentdefault = (function (id) {

            return document.getElementById(id);

        })(self.CONTENT_DEFAULT);

        /**
         *  Returns a DOM element for mywidget.ui.launchbutton .
         */
        self.ui.launchbutton = (function (id) {

            return document.getElementById(id);

        })(self.CONTENT_LAUNCH_BUTTON);

        /**
         *  Returns a DOM element for mywidget.ui.contentspeed .
         */
        self.ui.contentspeed = (function (id) {

            return document.getElementById(id);

        })(self.CONTENT_SPEED);

        /**
         *  Returns a DOM element for mywidget.ui.contentspeedunit .
         */
        self.ui.contentspeedunit = (function (id) {

            return document.getElementById(id);

        })(self.CONTENT_SPEED_UNIT);

        /**
         *  Returns a DOM element for mywidget.ui.backgroundcolor .
         */
        self.ui.body = (function (tag) {

            return document.getElementsByTagName(tag)[0];

        })('BODY');

        /**
         *  Launchs the application
         */
        self.application.launch = function () {

            console.log('[mywidget] application launch enter');

            var appId = tizen.application.getCurrentApplication().appInfo.id;
            tizen.application.launch(appId.replace('.Widget', ''), function () {

                console.log('[mywidget] application launched');

            });

        };

        /**
         *  Checks whether the application is running
         */
        self.application.isRunning = function () {

            // Checks the key mywidget.PREFERENCE_KEY_IS_RUNNING is set.
            // If not, set the key
            if (tizen.preference.exists(self.PREFERENCE_KEY_IS_RUNNING) === false) {

                tizen.preference.setValue(self.PREFERENCE_KEY_IS_RUNNING, false);
                return false;
            }

            // If the key was set by the application It can be used to check whether the application is running or not.
            return tizen.preference.getValue(self.PREFERENCE_KEY_IS_RUNNING);

        };

        /**
         *  Sets a listener for listening to changes in speed.
         */
        self.application.setStateChangeListener = function (listener) {

            console.log('[mywidget] application setStateChangeListener enter');
            // Checks the key mywidget.PREFERENCE_KEY_IS_RUNNING is set.
            // If not, set the key
            if (tizen.preference.exists(self.PREFERENCE_KEY_IS_RUNNING) === false) {

                console.log('[mywidget] the key, speed, does not exists');

                tizen.preference.setValue(self.PREFERENCE_KEY_IS_RUNNING, false);
            }

            // To get the information about whether the UI application is running or not.
            tizen.preference.setChangeListener(self.PREFERENCE_KEY_IS_RUNNING, listener);

        };

        /**
         *  Sets a listener for retrieving the change of the Speed.
         */
        self.setSpeedChangeListener = function (listener) {

            if (self.isSpeedChangedListenerSet === true) {

                return;

            }

            // Checks the key mywidget.PREFERENCE_KEY_SPEED is set.
            // If not, set the key
            if (tizen.preference.exists(self.PREFERENCE_KEY_SPEED) === false) {

                return;
            }

            // To get the current speed from the UI application.
            tizen.preference.setChangeListener(self.PREFERENCE_KEY_SPEED, listener);
            self.isSpeedChangedListenerSet = true;

        };

        /**
         *  Unsets a listener
         */
        self.unsetSpeedChangeListener = function () {

            console.log('[mywidget] application unsetSpeedChangeListener enter');

            if (self.isSpeedChangedListenerSet === false) {
                return;
            }

            // Checks the key was - mywidget.PREFERENCE_KEY_SPEED set.
            // If not, set the key
            if (tizen.preference.exists(self.PREFERENCE_KEY_SPEED) === false) {

                console.log('[mywidget] the key, speed, does not exists');

                return;
            }

            // Unsets the listener for the speed.
            tizen.preference.unsetChangeListener(self.PREFERENCE_KEY_SPEED);
            self.isSpeedChangedListenerSet = false;

        };

    };

    /**
     *  window.onload
     */
    window.onload = function() {

        init.call(mywidget);

        document.addEventListener('visibilitychange',
            function () {

                console.log('[mywidget] visibilityState: ' + document.visibilityState);

                if (document.visibilityState === 'visible') {

                    mywidget.setSpeedChangeListener(mywidget.onspeedchange);

                } else if(document.visibilityState === 'hidden') {

                    mywidget.unsetSpeedChangeListener();

                }

            }
        );

        /**
         *  To launch the UI application when clicking the launch button on Stand Alone Mode.
         */
        mywidget.ui.launchbutton.onclick = function () {

            mywidget.application.launch();

            // Navigates to Companion Mode
            mywidget.ui.setMode(mywidget.COMPANION_MODE);

        };

        /**
         *  To check if the UI application is running.
         */
        if (mywidget.application.isRunning() === true) {

            mywidget.setSpeedChangeListener(mywidget.onspeedchange);

            // Navigates to Companion Mode
            mywidget.ui.setMode(mywidget.COMPANION_MODE);

        } else {

            // Navigates to Stand Alone Mode
            mywidget.ui.setMode(mywidget.STAND_ALONE_MODE);

        }

        /**
         *  Sets a listener to get the state of the application
         */
        mywidget.application.setStateChangeListener(mywidget.onstatechange);

    };

})();
