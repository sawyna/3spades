var randomNumber = require('random-number');

var commonUtil = {};

commonUtil.isFunction = function(fn) {
	return fn && {}.toString.call(fn) === '[object Function]';
}

commonUtil.choose = function(from, to) {
	var options = {
		min: from,
		max: to,
		integer: true
	};

	return randomNumber(options);
};

commonUtil.swap = function(i, j, arr) {
	var temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
};

commonUtil.createARandomArray = function createARandomArray(temp, n, iterations) {
	if(iterations === 0)
		return;

	var pos = -1;
	for(let i = n - 1; i > 0; i--) {
		pos = commonUtil.choose(0, i - 1);
		commonUtil.swap(i, pos, temp);
	}

	createARandomArray(temp, n, --iterations);
};

module.exports = commonUtil;