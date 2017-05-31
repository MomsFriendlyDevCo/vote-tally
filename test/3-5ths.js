var expect = require('chai').expect;
var voteTally = require('..');

describe('Utlities > getWinLose({method: "3/5ths"})', function(){

	it('should calculate anomalous totals', function() {
		expect(voteTally.getWinLose({total: 0, method: '3/5ths'})).to.deep.equal({toWin: 0, toLose: 0, voters: 0});
	});

	it('should calculate small vote totals', function() {
		expect(voteTally.getWinLose({total: 1, method: '3/5ths'})).to.deep.equal({toWin: 1, toLose: 1, voters: 1});
		expect(voteTally.getWinLose({total: 2, method: '3/5ths'})).to.deep.equal({toWin: 2, toLose: 1, voters: 2});
		expect(voteTally.getWinLose({total: 3, method: '3/5ths'})).to.deep.equal({toWin: 2, toLose: 2, voters: 3});
		expect(voteTally.getWinLose({total: 4, method: '3/5ths'})).to.deep.equal({toWin: 3, toLose: 2, voters: 4});
		expect(voteTally.getWinLose({total: 5, method: '3/5ths'})).to.deep.equal({toWin: 3, toLose: 3, voters: 5});
	});

	it('should calculate variable vote totals', function() {
		expect(voteTally.getWinLose({total: 50, method: '3/5ths'})).to.deep.equal({toWin: 30, toLose: 21, voters: 50});
		expect(voteTally.getWinLose({total: 99, method: '3/5ths'})).to.deep.equal({toWin: 60, toLose: 41, voters: 99});
		expect(voteTally.getWinLose({total: 100, method: '3/5ths'})).to.deep.equal({toWin: 60, toLose: 41, voters: 100});
	});

	it('should calculate variable vote totals with abstains', function() {
		expect(voteTally.getWinLose({total: 50, abstain: 10, method: '3/5ths'})).to.deep.equal({toWin: 24, toLose: 17, voters: 40});
		expect(voteTally.getWinLose({total: 99, abstain: 20, method: '3/5ths'})).to.deep.equal({toWin: 48, toLose: 33, voters: 79});
		expect(voteTally.getWinLose({total: 100, abstain: 75, method: '3/5ths'})).to.deep.equal({toWin: 15, toLose: 11, voters: 25});
	});

});

