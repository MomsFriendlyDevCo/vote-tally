var expect = require('chai').expect;
var voteTally = require('..');

describe('Utlities > getWinLose({method: "simpleMajority"})', function(){

	it('should calculate anomalous totals', function() {
		expect(voteTally.getWinLose({total: 0, method: 'simpleMajority'})).to.deep.equal({toWin: 0, toLose: 0, voters: 0});
	});

	it('should calculate small vote totals', function() {
		expect(voteTally.getWinLose({total: 1, method: 'simpleMajority'})).to.deep.equal({toWin: 1, toLose: 1, voters: 1});
		expect(voteTally.getWinLose({total: 2, method: 'simpleMajority'})).to.deep.equal({toWin: 2, toLose: 1, voters: 2});
		expect(voteTally.getWinLose({total: 3, method: 'simpleMajority'})).to.deep.equal({toWin: 3, toLose: 2, voters: 3});
	});

	it('should calculate variable vote totals', function() {
		expect(voteTally.getWinLose({total: 50, method: 'simpleMajority'})).to.deep.equal({toWin: 26, toLose: 25, voters: 50});
		expect(voteTally.getWinLose({total: 99, method: 'simpleMajority'})).to.deep.equal({toWin: 51, toLose: 50, voters: 99});
		expect(voteTally.getWinLose({total: 100, method: 'simpleMajority'})).to.deep.equal({toWin: 51, toLose: 50, voters: 100});
	});

	it('should calculate variable vote totals with abstains', function() {
		expect(voteTally.getWinLose({total: 50, abstain: 10, method: 'simpleMajority'})).to.deep.equal({toWin: 21, toLose: 20, voters: 40});
		expect(voteTally.getWinLose({total: 99, abstain: 20, method: 'simpleMajority'})).to.deep.equal({toWin: 41, toLose: 39, voters: 79});
		expect(voteTally.getWinLose({total: 100, abstain: 75, method: 'simpleMajority'})).to.deep.equal({toWin: 14, toLose: 12, voters: 25});
	});

});
