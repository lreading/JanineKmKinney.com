const expect = require('chai').expect;

const validators = require('../../../src/util/validators.js');

describe('util/validators.js', () => {
	describe('validateFieldType', () => {
		it('validates a string with length', () => {
			expect(() => {
				validators.validateFieldType('asdf', 'test', 'string');
			}).not.to.throw();
		});

		it('validates an empty string', () => {
			expect(() => {
				validators.validateFieldType('', 'test', 'string');
			}).not.to.throw();
		});

		it('throws an error with an undefined string', () => {
			expect(() => {
				validators.validateFieldType(undefined, 'test', 'string');
			}).to.throw();
		});

		it('throws an error with a null string', () => {
			expect(() => {
				validators.validateFieldType(null, 'test', 'string');
			}).to.throw();
		});

		it('throws an error with a number when expecting string', () => {
			expect(() => {
				validators.validateFieldType(1, 'test', 'string');
			}).to.throw();
		});

		it('throws an error with an object when expecting string', () => {
			expect(() => {
				validators.validateFieldType({}, 'test', 'string');
			}).to.throw();
		});

		it('validates an integer number', () => {
			expect(() => {
				validators.validateFieldType(1, 'test', 'number');
			}).not.to.throw();
		});

		it('validates a decimal number', () => {
			expect(() => {
				validators.validateFieldType(1, 'test', 'number');
			}).not.to.throw();
		});

		it('validates a scientific number', () => {
			expect(() => {
				validators.validateFieldType(1e245, 'test', 'number');
			}).not.to.throw();
		});

		it('throws an error with an undefined number', () => {
			expect(() => {
				validators.validateFieldType(undefined, 'test', 'number');
			}).to.throw();
		});

		it('throws an error with a null number', () => {
			expect(() => {
				validators.validateFieldType(null, 'test', 'number');
			}).to.throw();
		});

		it('throws an error with a string when expecting number', () => {
			expect(() => {
				validators.validateFieldType('234', 'test', 'number');
			}).to.throw();
		});

		it('throws an error with an object when expecting number', () => {
			expect(() => {
				validators.validateFieldType({}, 'test', 'number');
			}).to.throw();
		});

		it('validates a javascript date', () => {
			expect(() => {
				validators.validateFieldType(new Date(), 'test', 'date');
			}).not.to.throw();
		});

		it('validates a numeric date', () => {
			expect(() => {
				validators.validateFieldType(1572835288825, 'test', 'date');
			}).not.to.throw();
		});

		it('does not validate a string, even if it looks like a date', () => {
			expect(() => {
				validators.validateFieldType('2019-11-04T02:41:58.816Z', 'test', 'date');
			}).to.throw();
		});

		it('throws an error with an undefined date', () => {
			expect(() => {
				validators.validateFieldType(undefined, 'test', 'date');
			}).to.throw();
		});

		it('throws an error with a null date', () => {
			expect(() => {
				validators.validateFieldType(null, 'test', 'date');
			}).to.throw();
		});

		it('throws an error with a string when expecting date', () => {
			expect(() => {
				validators.validateFieldType('asdf', 'test', 'date');
			}).to.throw();
		});

		it('throws an error with an object when expecting date', () => {
			expect(() => {
				validators.validateFieldType({}, 'test', 'date');
			}).to.throw();
		});
	});

	describe('validateRequiredString', () => {
		it('throws an error if the length is 0', () => {
			expect(() => {
				validators.validateRequiredString('', 'test');
			}).to.throw();
		});

		it('validates a string with more characters than the min', () => {
			expect(() => {
				validators.validateRequiredString('asdf', 'test', 3);
			}).not.to.throw();
		});

		it('throws an error if string is less than min length', () => {
			expect(() => {
				validators.validateRequiredString('1', 'test', 2);
			}).to.throw();
		});

		it('throws an error if string is more than max length', () => {
			expect(() => {
				validators.validateRequiredString('asdfasdfasdf', 'test', undefined, 3);
			}).to.throw();
		});

		it('validates a string with less than the max length', () => {
			expect(() => {
				validators.validateRequiredString('asdfasdf', 'test', undefined, 50);
			}).not.to.throw();
		});

		it('validates a string between the min and max lengths', () => {
			expect(() => {
				validators.validateRequiredString('asdfasdf', 'test', 5, 50);
			}).not.to.throw();
		});
	});
});
