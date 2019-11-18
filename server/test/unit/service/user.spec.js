const service = require('../../../src/service/user.js');
const repo = require('../../../src/repo/users.js');
const crypto = require('../../../src/util/crypto.js');

describe('service/user.js', () => {
	describe('doesPasswordMeetRequirements', () => {
		it('returns false for a null password', () => {
			expect(service.doesPasswordMeetRequirements(null)).toEqual(false);
		});

		it('returns false for an undefined password', () => {
			expect(service.doesPasswordMeetRequirements()).toEqual(false);
		});

		it('returns false for a password shorter than the min length', () => {
			expect(service.doesPasswordMeetRequirements('aS$3')).toEqual(false);
		});

		it('returns false for a password without number', () => {
			expect(service.doesPasswordMeetRequirements('aasdfS$asdf')).toEqual(false);
		});

		it('returns false for a password without special chars', () => {
			expect(service.doesPasswordMeetRequirements('ASDF12345asdf')).toEqual(false);
		});

		it('returns false for a password without upper-case chars', () => {
			expect(service.doesPasswordMeetRequirements('asdfasdf@#$234')).toEqual(false);
		});

		it('returns false for a password without lower-case chars', () => {
			expect(service.doesPasswordMeetRequirements('ASDF234@#$')).toEqual(false);
		});

		it('returns false for a password that meets 3 our of 4', () => {
			expect(service.doesPasswordMeetRequirements('asdf2134%#$@')).toEqual(false);
		});

		it('returns true for a valid password', () => {
			expect(service.doesPasswordMeetRequirements('ASDFasdf@#$5643')).toEqual(true);
		});
	});

	it('sanitizes a user object', () => {
		const original = {
			id: 62,
			username: 'test',
			passwordhash: 'nevershow',
			lastlogin: new Date(),
			failedattempts: 0,
			lastfailedattempt: null
		};
		const sanitized = service.sanitizeUser(original);
		expect(sanitized).not.toHaveProperty('passwordhash');
		expect(sanitized).not.toHaveProperty('lastlogin');
		expect(sanitized).not.toHaveProperty('failedattempts');
		expect(sanitized).not.toHaveProperty('lastfailedattempt');
		expect(sanitized.id).toEqual(original.id);
		expect(sanitized.username).toEqual(original.username);
	});

	describe('userLoginAsync', () => {
		const mockUser = {
			id: 55,
			username: 'testUser1',
			passwordhash: 'asdfJKLASDF',
			lastlogin: new Date(),
			failedattempts: 0,
			lastfailedattempt: null
		};
		const ipAddr = '127.0.0.1';

		beforeEach(() => {
			jest.resetAllMocks();
			jest.spyOn(repo, 'getByNameAsync');
			repo.getByNameAsync.mockImplementation(async (name) => {
				const res = name.toLowerCase() === mockUser.username.toLowerCase() ? Promise.resolve(mockUser) : Promise.resolve(null);
				return await res;
			});
			jest.spyOn(repo, 'updateLoginMetaAsync');
			repo.updateLoginMetaAsync.mockReturnValue(Promise.resolve());
			jest.spyOn(crypto, 'compareHashAsync');
			crypto.compareHashAsync.mockImplementation(async (plain, hash) => {
				const res = plain === hash;
				return await Promise.resolve(res);
			});
		});

		it('calls the compareHash function without a valid user', async () => {
			await service.userLoginAsync('junk', 'myPw', ipAddr);
			expect(crypto.compareHashAsync).toHaveBeenCalledTimes(1);
		});

		it('returns invalid user/pass with an invalid username', async () => {
			const result = await service.userLoginAsync('junk', 'myPw', ipAddr);
			expect(result.result).toEqual(service.loginResults.invalidUsernameOrPassword);
			expect(result.user).toBeNull();
		});

		it('returns invalid user/pass with an invalid password', async () => {
			const result = await service.userLoginAsync(mockUser.username, 'junk', ipAddr);
			expect(result.result).toEqual(service.loginResults.invalidUsernameOrPassword);
			expect(result.user).toBeNull();
		});

		it('returns lockout if the user is locked out', async () => {
			mockUser.failedattempts = 9;
			const result = await service.userLoginAsync(mockUser.username, mockUser.passwordhash, ipAddr);
			expect(result.result).toEqual(service.loginResults.lockedOut);
			expect(result.user).toBeNull();
			mockUser.failedattempts = 0; // eslint-disable-line require-atomic-updates
		});

		it('returns success and the user if a valid user/pass and not locked out', async () => {
			const result = await service.userLoginAsync(mockUser.username, mockUser.passwordhash, ipAddr);
			expect(result.result).toEqual(service.loginResults.success);
			expect(result.user).not.toBeNull();
		});

		it('locks out a user after reaching the maxLoginFailures', async () => {
			mockUser.failedattempts = 2;
			const result = await service.userLoginAsync(mockUser.username, 'bad', ipAddr);
			expect(result.result).toEqual(service.loginResults.lockedOut);
			expect(result.user).toBeNull();
			mockUser.failedattempts = 0; // eslint-disable-line require-atomic-updates
		});
	});
});
