const request = require('request-promise-native');
const hibp = require('../../../src/service/hibp.js');

describe('service/hibpw.js', () => {
	const badPassword = 'password123!';
	const badPasswordHash = 'ADDBD3AA5619F2932733104EB8CEEF08F6FD2693';

	beforeEach(() => {
		jest.resetAllMocks();
		jest.spyOn(request, 'get');
		request.get.mockReturnValue(Promise.resolve(`${badPasswordHash}:700`));
	});

	describe('with feature enabled', () => {
		beforeEach(() => {
			process.env.USE_HIBP = 'true';
		});

		afterEach(() => {
			process.env.USE_HIBP = false;
		});

		it('calls the pwnedpasswords API', async () => {
			await hibp.hasPasswordBeenPwned(badPassword);
			expect(request.get).toHaveBeenCalledWith('https://api.pwnedpasswords.com/range/ADDBD');
		});

		it('returns true when password has been compromised', async () => {
			const res = await hibp.hasPasswordBeenPwned(badPassword);
			expect(res).toEqual(true);
		});

		it('returns false when password NOT compromised', async () => {
			const res = await hibp.hasPasswordBeenPwned('SomeAwesomePassword');
			expect(res).toEqual(false);
		});
	});

	describe('with feature disabled', () => {
		beforeEach(() => {
			process.env.USE_HIBP = false;
		});

		it('does not call the API', async () => {
			await hibp.hasPasswordBeenPwned(badPassword);
			expect(request.get).not.toHaveBeenCalled();
		});

		it('always returns false', async () => {
			const res = await hibp.hasPasswordBeenPwned(badPassword);
			expect(res).toEqual(false);
		});
	});
});
