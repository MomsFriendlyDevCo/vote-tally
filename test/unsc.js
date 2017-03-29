var expect = require('chai').expect;
var voteTally = require('..');

describe('Utlities > getWinLose({method: "unsc"})', function(){

	it('should calculate anomalous totals', function() {
		expect(voteTally.getWinLose({total: 0, method: 'unsc'})).to.deep.equal({toWin: 0, toLose: 0, voters: 0});
	});

	it('should calculate small vote totals', function() {
		expect(voteTally.getWinLose({total: 1, method: 'unsc'})).to.deep.equal({toWin: 1, toLose: 1, voters: 1});
		expect(voteTally.getWinLose({total: 2, method: 'unsc'})).to.deep.equal({toWin: 2, toLose: 1, voters: 2});
		expect(voteTally.getWinLose({total: 3, method: 'unsc'})).to.deep.equal({toWin: 2, toLose: 2, voters: 3});
	});

	it('should calculate variable vote totals', function() {
		expect(voteTally.getWinLose({total: 14, method: 'unsc'})).to.deep.equal({toWin: 9, toLose: 5, voters: 14});
		expect(voteTally.getWinLose({total: 50, method: 'unsc'})).to.deep.equal({toWin: 32, toLose: 17, voters: 50});
		expect(voteTally.getWinLose({total: 99, method: 'unsc'})).to.deep.equal({toWin: 66, toLose: 34, voters: 99});
		expect(voteTally.getWinLose({total: 100, method: 'unsc'})).to.deep.equal({toWin: 66, toLose: 34, voters: 100});
	});

	it('should calculate variable vote totals with abstains', function() {
		expect(voteTally.getWinLose({total: 14, abstain: 3, method: 'unsc'})).to.deep.equal({toWin: 9, toLose: 5, voters: 14});
		expect(voteTally.getWinLose({total: 50, abstain: 10, method: 'unsc'})).to.deep.equal({toWin: 32, toLose: 17, voters: 50});
		expect(voteTally.getWinLose({total: 99, abstain: 20, method: 'unsc'})).to.deep.equal({toWin: 66, toLose: 34, voters: 99});
		expect(voteTally.getWinLose({total: 100, abstain: 75, method: 'unsc'})).to.deep.equal({toWin: 66, toLose: 34, voters: 100});
	});

});

