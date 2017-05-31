module.exports = {
	/**
	* Collection of supported voting methods
	* @var {array}
	*/
	methods: [
		{
			id: 'simpleMajority',
			title: 'Simple Majority',
			description: 'Voting method employed on non-substantive matters in the UN - 50% + 1 vote passes',
		},
		{
			id: '2/3rds',
			title: 'Two-thirds majority',
			description: 'The common voting ratio used for substantive matters in the UN',
		},
		{
			id: '3/5ths',
			title: 'Three-fifths majority',
			description: 'Used by UN Youth Australia (UNYA) in the Model United Nations competition',
		},
		{
			id: 'unsc',
			title: 'UN Security Council (9/14ths)',
			description: 'Used by the UN Security Council in - abstentions do not count during vote counts',
		},
		{
			id: 'unanimous',
			title: 'Unanimous',
			description: 'All votes must be in favour, none must reject to pass',
		},
	],

	/**
	* Calculate Win/Lose ratios for various voting types
	* @param {Object} options Options to use
	* @param {string} options.method The vote method to use (see code for valid types)
	* @param {number} options.total The total number of votes
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

				var third = realTotal / 3;
				return {
					toWin: Math.ceil(third * 2),
					toLose: Math.floor(third) * 1 + 1,
					voters: realTotal,
				};
				break;
			case '3/5ths':
				if (realTotal == 0) return {toWin: 0, toLose: 0, voters: 0};
				if (realTotal == 1) return {toWin: 1, toLose: 1, voters: 1};
				if (realTotal == 2) return {toWin: 2, toLose: 1, voters: 2};
				if (realTotal == 3) return {toWin: 2, toLose: 2, voters: 3};
				if (realTotal == 4) return {toWin: 3, toLose: 2, voters: 4};

				var fifth = Math.ceil(realTotal / 5);
				return {
					toWin: fifth * 3,
					toLose: fifth * 2 + 1,
					voters: realTotal,
				};
				break;
			case 'unsc':
				realTotal = options.total; // Abstentions are ignored in the UNSC. Total SHOULD also be 14 but we're going to allow for more here

				var segment = realTotal / 14;
				return {
					toWin: Math.ceil(segment * 9),
					toLose: Math.ceil(segment * 5),
					voters: realTotal,
				};
				break;
			case 'unanimous':
				if (realTotal == 0) return {toWin: 0, toLose: 0, voters: 0};

				return {
					toWin: realTotal,
					toLose: 1,
					voters: realTotal,
				};
				break;
			case 'simpleMajority':
				if (realTotal == 0) return {toWin: 0, toLose: 0, voters: 0};
				if (realTotal == 1) return {toWin: 1, toLose: 1, voters: 1};

				return {
					toWin: Math.ceil(realTotal / 2) + 1,
					toLose: Math.ceil(realTotal / 2),
					voters: realTotal,
				};
				break;
			default:
				throw new Error('Unknown vote method: ' + options.method);
		}
	},
};
