vote-tally
==========
Simple UI widget to show and calculate vote tallies.

![Screenshot](./docs/shot.png)

[Demo](https://momsfriendlydevco.github.io/vote-tally)


Installation
------------
NOTE: This module requires `angular-bs-tooltip`.


1. Grab the NPM

```shell
npm install --save @momsfriendlydevco/vote-tally
```


2. Install the required script + CSS somewhere in your build chain or include it in a HTML header:

```html
<script src="/libs/vote-tally/dist/votetally.min.js"/>
<link href="/libs/vote-tally/dist/vote-tally.min.css" rel="stylesheet" type="text/css"/>
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


API
===
vote-tally exposes two main components: a generic service library which provides a list of voting schemas supported and information on voting methods and the UI component itself.

Within Node the API is accessed as an object:

```javascript
var voteTally = require('@momsfriendlydevco/vote-tally');

// Calculate 2/3rds majority voting method with 100 people and 10 abstaining
var ratio = voteTally.getWinLose({
	method: '2/3rds',
	total: 100,
	abstain: 10,
});
```

Within AngularJS this is accessed as a service:

```javascript
angular
	.module('app')
	.component('myController', {
		controller: function(VoteTally) {
			VoteTally.getWinLose(...);
		},
	});
```

methods
-------
An array of objects for all supported voting methods.
Each item will contain an `id` as well as a human readable `title` and a brief `description`.


getWinLose()
------------
Calculate the ratios for a given voting method given the total number of voters and an optional number of voters abstaining.


```javascript
// Calculate 2/3rds majority voting method with 100 people and 10 abstaining
var ratio = voteTally.getWinLose({
	method: '2/3rds',
	total: 100,
	abstain: 10,
});
```


UI Component
------------
The UI widget is a AngularJS component which is declared as:

```html
<vote-tally total="100" approve="30" reject="20" abstain="5" method="simpleMajority" summary="true" tooltips="hover"></vote-tally>
```

The following options are accepted:

| Option           | Type       | Default            | Description                                                                                                           |
|------------------|------------|--------------------|-----------------------------------------------------------------------------------------------------------------------|
| `method`         | `string`   | `"simpleMajority"` | The voting method used to calculate the target votes. This can be any ID supported in the `methods` collection        |
| `total`          | `number`   | `100`              | The total number of voters                                                                                            |
| `approve`        | `number`   | `0`                | The number of voters who accept the motion                                                                            |
| `reject`         | `number`   | `0`                | The number of voters who reject the motion                                                                            |
| `abstain`        | `number`   | `0`                | The number of voters who are abstaining                                                                               |
| `summary`        | `boolean`  | `false`            | Whether to show the summary area at the bottom of the widget                                                          |
| `tooltips`       | `string`   | `"hover"`          | When to display tooltips. Values supported: `"never"`, `"hover"` (default), `"always"`                                |
| `onClickPass`    | `function` | `undefined`        | A function to fire when the user clicks on the `X / Y to pass` summary pane or the far left progress bar              |
| `onClickReject`  | `function` | `undefined`        | A function to fire when the user clicks on the `X / Y to reject` summary pane or the second to far right progress bar |
| `onClickAbstain` | `function` | `undefined`        | A function to fire when the user clicks on the `X abstaining` summary pane or the far right progress bar              |
| `onClickWaiting` | `function` | `undefined`        | A function to fire when the user clicks on the `X to vote` summary pane or the remaining area of the progress bar     |

