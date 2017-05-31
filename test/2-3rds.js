var expect = require('chai').expect;
var voteTally = require('..');

describe('Utlities > getWinLose({method: "2/3rds"})', function(){

	it('should calculate anomalous totals', function() {
		expect(voteTally.getWinLose({total: 0, method: '2/3rds'})).to.deep.equal({toWin: 0, toLose: 0, voters: 0});
	});

	it('should calculate small vote totals', function() {
		expect(voteTally.getWinLose({total: 1, method: '2/3rds'})).to.deep.equal({toWin: 1, toLose: 1, voters: 1});
		expect(voteTally.getWinLose({total: 2, method: '2/3rds'})).to.deep.equal({toWin: 2, toLose: 1, voters: 2});
		expect(voteTally.getWinLose({total: 3, method: '2/3rds'})).to.deep.equal({toWin: 2, toLose: 2, voters: 3});
	});

	it('should calculate variable vote totals', function() {
		expect(voteTally.getWinLose({total: 50, method: '2/3rds'})).to.deep.equal({toWin: 34, toLose: 17, voters: 50});
		expect(voteTally.getWinLose({total: 99, method: '2/3rds'})).to.deep.equal({toWin: 66, toLose: 34, voters: 99});
		expect(voteTally.getWinLose({total: 100, method: '2/3rds'})).to.deep.equal({toWin: 67, toLose: 34, voters: 100});
	});

	it('should calculate variable vote totals with abstains', function() {
		expect(voteTally.getWinLose({total: 50, abstain: 10, method: '2/3rds'})).to.deep.equal({toWin: 27, toLose: 14, voters: 40});
		expect(voteTally.getWinLose({total: 99, abstain: 20, method: '2/3rds'})).to.deep.equal({toWin: 53, toLose: 27, voters: 79});
		expect(voteTally.getWinLose({total: 100, abstain: 75, method: '2/3rds'})).to.deep.equal({toWin: 17, toLose: 9, voters: 25});
	});

});

