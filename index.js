module.exports = {
	/**
	* Collection of supported voting methods
	* @var {array}
	*/
	methods: [
		{id: '2/3rds', title: 'Two-thirds majority'},
		{id: '50/50', title: '50% wins'},
	],

	/**
	* Calculate Win/Lose ratios for various voting types
	* @param {Object} options Options to use
	* @param {number} options.total The total number of votes
	* @param {string} options.method The vote method to use (see code for valid types)
	* @param {number} options.abstain Optional number of the number of abstentions
	* @return {Object} New structure containing voters, toWin, toLose
	*/
	getWinLose: function(options) {
		var realTotal = options.total - (options.abstain || 0);
		switch (options.method) {
			case '2/3rds':
				if (realTotal == 0) return {toWin: 0, toLose: 0, voters: 0};
				if (realTotal == 1) return {toWin: 1, toLose: 1, voters: 1};
				if (realTotal == 2) return {toWin: 2, toLose: 1, voters: 2};

				var third = Math.floor(realTotal / 3);
				return {
					toWin: third * 2,
					toLose: third * 1 + 1,
					voters: realTotal,
				};
				break;
			case '50/50':
				return {
					toWin: Math.ceil(realTotal / 2),
					toLose: Math.ceil(realTotal / 2),
					voters: realTotal,
				};
				break;
			default:
				throw new Error('Unknown vote method: ' + options.method);
		}
	},
};
