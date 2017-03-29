var expect = require('chai').expect;
var voteTally = require('..');

describe('Utlities > getWinLose({method: "unanimous"})', function(){

	it('should calculate anomalous totals', function() {
		expect(voteTally.getWinLose({total: 0, method: 'unanimous'})).to.deep.equal({toWin: 0, toLose: 0, voters: 0});
	});

	it('should calculate small vote totals', function() {
		expect(voteTally.getWinLose({total: 1, method: 'unanimous'})).to.deep.equal({toWin: 1, toLose: 1, voters: 1});
		expect(voteTally.getWinLose({total: 2, method: 'unanimous'})).to.deep.equal({toWin: 2, toLose: 1, voters: 2});
		expect(voteTally.getWinLose({total: 3, method: 'unanimous'})).to.deep.equal({toWin: 3, toLose: 1, voters: 3});
	});

	it('should calculate variable vote totals', function() {
		expect(voteTally.getWinLose({total: 50, method: 'unanimous'})).to.deep.equal({toWin: 50, toLose: 1, voters: 50});
		expect(voteTally.getWinLose({total: 99, method: 'unanimous'})).to.deep.equal({toWin: 99, toLose: 1, voters: 99});
		expect(voteTally.getWinLose({total: 100, method: 'unanimous'})).to.deep.equal({toWin: 100, toLose: 1, voters: 100});
	});

	it('should calculate variable vote totals with abstains', function() {
		expect(voteTally.getWinLose({total: 50, abstain: 10, method: 'unanimous'})).to.deep.equal({toWin: 40, toLose: 1, voters: 40});
		expect(voteTally.getWinLose({total: 99, abstain: 20, method: 'unanimous'})).to.deep.equal({toWin: 79, toLose: 1, voters: 79});
		expect(voteTally.getWinLose({total: 100, abstain: 75, method: 'unanimous'})).to.deep.equal({toWin: 25, toLose: 1, voters: 25});
	});

});
