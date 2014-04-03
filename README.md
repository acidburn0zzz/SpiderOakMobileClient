# Overview

[![Build Status](https://travis-ci.org/SpiderOak/SpiderOakMobileClient.png)](https://travis-ci.org/SpiderOak/SpiderOakMobileClient)

[SpiderOak](http://spideroak.com) is reimplementing its mobile client applications as a central, platform-independent HTML5 / Javascript / CSS core, hybridized with native extensions to fill functionality gaps. This will replace the preceeding, entirely native applications. We see many benefits to the html5 approach, including (if we're diligent) comprehensiblility as well as versatility.

There are many ways that access to our code can be useful. It can serve as guidance to people as examples for using our APIs. It can serve as a base for implementation of custom functionality that they need. It can provide the opportunity to contribute to and help grow this useful tool, itself. These and other reasons are why we make the code openly available, and the development process reasonably transparent.

Therefore, the code is officially available as free/open source software, under the terms of [the Apache 2.0 license](https://github.com/SpiderOak/SpiderOakMobileClient/blob/master/LICENSE), and we are conducting our development in a github [public repository](https://github.com/SpiderOak/SpiderOakMobileClient).

It's worth mentioning that this mobile client is extremely important to SpiderOak as a business. We are opening the source in order to make the development effort more immediately useful, in ways described above, as well as to leverage various collaboration opportunities that such openness affords. We will continue to devote core internal development resources to this effort.

## Requirements

- Cordova CLI - [https://github.com/apache/cordova-cli/](https://github.com/apache/cordova-cli/)
	- Cordova / PhoneGap command line interface
- Grunt - [http://gruntjs.com/](http://gruntjs.com/)
	- Build tool for minimising, running and tests
- Node and npm - [http://nodejs.org/](http://nodejs.org/)
	- Node package manager for Grunt Add-ons
- PhantomJS - [http://phantomjs.org/](http://phantomjs.org/)
	- Headless webkit for running tests
- FileViewerPlugin - [https://github.com/SpiderOak/FileViewerPlugin](https://github.com/SpiderOak/FileViewerPlugin)
	- Cordova plugin for viewing files on Android via Intents

## Getting started

- clone the project
- cd into the project folder
- `npm install`, which
  - installs node_modules and js/css components,
  - runs `bower install`, which installs some other stuff,
  - configures the project for the default brand ("SpiderOak"),
  - adds the default cordova platforms - android and ios.
- `npm run pluginstall` to install any plugins needed

## First test

To make sure everything is set up from the above, run your first tests

Run `grunt test` - This will lint the source (`grunt lint`), concat the source into a single js file (`grunt concat`) and finally run the headless Mocha tests (`grunt shell:mochaspec`).

## Workflow

JavaScript files are in `src`. They are kept out of the www tree so that they can be linted without trying to lint the concatenated and minified versions. However, the index.html should have a script tag only for the JavaScript files in either `components` (managed by Bower) or `www/js`.

Building and testing the project is normally done via the Grunt tasks below.

## Grunt tasks

`grunt jshint`

- runs JSHint on the src files `src/**/*.js``

`grunt concat`

- concatenates the src files in `src/models/*.js`, `src/collections/*.js`, `src/views/*.js` and `src/app.js` (in that order) into `www/js/<package-name-from-package.json>.js`
- concatenates the src files in `tests/models/*.js`, `tests/collections/*.js`, `tests/views/*.js` and `src/index.js` into `www/tests/<package-name-from-package.json>-tests.js`

`grunt min`

- minifies `www/js/<package-name-from-package.json>.js` into `www/js/<package-name-from-package.json>.min.js` (so should only be called after calling `grunt concat` above)

`grunt dot`

- compiles the DoT templates 

`grunt shell:mochaspec`

- runs Mocha tests in `www/tests/<package-name-from-package.json>-tests.js` based on the template `www/tests/index.html` and outputs via the Mocha "spec" reporter.

`grunt shell:mochadot`

- runs Mocha tests in `www/tests/<package-name-from-package.json>-tests.js` based on the template `www/tests/index.html` and outputs via the more minimalist Mocha "dot" reporter.

`grunt watch`

- starts watching the same files as `grunt concat:dist` as well as the files from `grunt concat:tests` and when changes are detected runs `jshint dot concat shell:mochadot`

#### Custom tasks

`grunt` (default tasks)

- runs `jshint dot concat shell:mochadot`

`grunt test`

- runs `jshint dot concat shell:mochaspec`

`grunt debug:ios`

- runs `jshint dot concat shell:debug_ios` to debug iOS platform on the simulator

`grunt debug:android`

- runs `jshint dot concat shell:debug_android` to debug Android platform on the emulator (or a plugged in device)

See the [Running, Testing, and Debugging section](https://github.com/SpiderOak/SpiderOakMobileClient/wiki/Home#wiki-Running_Testing_and_Debugging) of the wiki home page for more info.

#### Brand Customization

This package includes a simple build-time customization facility, described in [White label App Customization](https://github.com/SpiderOak/SpiderOakMobileClient/wiki/White-label-App-Customization).

## Binary Releases

The SpiderOak mobile client Android production release is available, via:

| Platform |    Venue        | Version |    For users...                    |
|:--------:|:---------------:|:-------:|:--------------------------------- |
| iOS      | Apple App Store | [Orange](http://www.amazon.com/SpiderOak-Inc/dp/B00DJBSD8I) | Regular users |
| iOS      | Apple App Store | Blue | _Pending store approval,_ Users with enterprise-specific servers |
| Android  | Google Play     | [Orange](https://play.google.com/store/apps/details?id=com.spideroak.android) | Regular users |
| Android  | Google Play     | [Blue](https://play.google.com/store/apps/details?id=com.spideroakblue.android) | Users with enterprise-specific servers |
| Android  | Amazon App Store | [Orange](https://play.google.com/store/apps/details?id=com.spideroak.android) | Regular users |
| Android  | Amazon App Store | [Orange](https://play.google.com/store/apps/details?id=com.spideroak.android) | Regular users |
| Android  | Amazon App Store | Blue | _Not yet released,_ Users with enterprise-specific servers |
| Android  | SpiderOak ShareRoom | [Orange](https://spideroak.com/browse/share/spideroak-html5/Recent) | __Sideload__ a recent release - see notes below |
| Android  | SpiderOak ShareRoom | [Blue](https://spideroak.com/browse/share/spideroak-html5/Recent) | __Sideload__ Enterprise version - see notes below |
| All  | _This repository_ | All | Build and install it yourself |

* Regarding android side-loadable .apk files, from our [recent Android builds ShareRoom](https://spideroak.com/browse/share/spideroak-html5/Recent)
  * You need to understand how to do sideloading in order to use this option.
  * If you do sideload one of these apks, subsequent use of the above online stores will recognize and present you with updates, when newer versions are available.
  * In the absence of any app stores, once you have the app installed, add the Recent releases ShareRoom, so you can fetch new copies easily, when they're available!
* Regarding building your own:
  * Apple doesn't provide for alternative stores or side loading, but you can clone this project project onto a Mac and, provided you have Apple's (free) developer environment installed, install your own, ad hoc builds onto iOS devices.
  * For Android, on various Unix-like platforms you can build and install with Googles Android developer SDK installed
