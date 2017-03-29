vote-tally
==========
Simple UI widget to show and calculate vote tallies.


Installation
------------
NOTE: This module requires `angular-bs-tooltip`.


1. Grab the NPM

```shell
npm install --save @momsfriendlydevco/vote-tally
```


2. Install the required script + CSS somewhere in your build chain or include it in a HTML header:

```html
<script src="/libs/vote-tally/src/votetally.min.js"/>
<link href="/libs/vote-tally/vote-tally.min.css" rel="stylesheet" type="text/css"/>
```


3. Include the router in your main `angular.module()` call:

```javascript
var app = angular.module('app', ['angular-ui-vote-tally'])
```


4. Use somewhere in your template:

```html
<vote-tally total="100" approve="40" reject="20" abstain="10" method="2/3rds" summary="true"></vote-tally>
```


A demo is also available. To use this [follow the instructions in the demo directory](./demo/README.md).
