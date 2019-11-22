const expect = require('chai').expect;
const sinon = require('sinon');

const crypto = require('../../../src/util/crypto.js');
const repo = require('../../../src/repo/users.js');
const service = require('../../../src/service/user.js');

describe('service/user.js', () => {
	describe('doesPasswordMeetRequirements', () => {
		it('returns false for a null password', () => {
			expect(service.doesPasswordMeetRequirements(null)).to.eql(false);
		});

		it('returns false for an undefined password', () => {
			expect(service.doesPasswordMeetRequirements()).to.eql(false);
		});

		it('returns false for a password shorter than the min length', () => {
			expect(service.doesPasswordMeetRequirements('aS$3')).to.eql(false);
		});

		it('returns false for a password without number', () => {
			expect(service.doesPasswordMeetRequirements('aasdfS$asdf')).to.eql(false);
		});

		it('returns false for a password without special chars', () => {
			expect(service.doesPasswordMeetRequirements('ASDF12345asdf')).to.eql(false);
		});

		it('returns false for a password without upper-case chars', () => {
			expect(service.doesPasswordMeetRequirements('asdfasdf@#$234')).to.eql(false);
		});

		it('returns false for a password without lower-case chars', () => {
			expect(service.doesPasswordMeetRequirements('ASDF234@#$')).to.eql(false);
		});

		it('returns false for a password that meets 3 our of 4', () => {
			expect(service.doesPasswordMeetRequirements('asdf2134%#$@')).to.eql(false);
		});

		it('returns true for a valid password', () => {
			expect(service.doesPasswordMeetRequirements('ASDFasdf@#$5643')).to.eql(true);
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
		expect(sanitized).not.to.have.property('passwordhash');
		expect(sanitized).not.to.have.property('lastlogin');
		expect(sanitized).not.to.have.property('failedattempts');
		expect(sanitized).not.to.have.property('lastfailedattempt');
		expect(sanitized.id).to.eql(original.id);
		expect(sanitized.username).to.eql(original.username);
	});

	describe('userLoginAsync', () => {
		let sandbox;
		let compareHashStub;

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
			sandbox = sinon.createSandbox();
			sandbox.stub(repo, 'getByNameAsync').callsFake(async (name) => {
				const res = name.toLowerCase() === mockUser.username.toLowerCase() ? Promise.resolve(mockUser) : Promise.resolve(null);
				return await res;
			});
			sandbox.stub(repo, 'updateLoginMetaAsync').returns(Promise.resolve());
			compareHashStub = sandbox.stub(crypto, 'compareHashAsync').callsFake(async (plain, hash) => {
				const res = plain === hash;
				return await Promise.resolve(res);
			});
		});

		afterEach(() => {
			sandbox.restore();
		});

		it('calls the compareHash function without a valid user', async () => {
			await service.userLoginAsync('junk', 'myPw', ipAddr);
			expect(compareHashStub.calledOnce).to.be.true;
		});

		it('returns invalid user/pass with an invalid username', async () => {
			const result = await service.userLoginAsync('junk', 'myPw', ipAddr);
			expect(result.result).to.eql(service.loginResults.invalidUsernameOrPassword);
			expect(result.user).to.be.null;
		});

		it('returns invalid user/pass with an invalid password', async () => {
			const result = await service.userLoginAsync(mockUser.username, 'junk', ipAddr);
			expect(result.result).to.eql(service.loginResults.invalidUsernameOrPassword);
			expect(result.user).to.be.null;
		});

		it('returns lockout if the user is locked out', async () => {
			mockUser.failedattempts = 9;
			const result = await service.userLoginAsync(mockUser.username, mockUser.passwordhash, ipAddr);
			expect(result.result).to.eql(service.loginResults.lockedOut);
			expect(result.user).to.be.null;
			mockUser.failedattempts = 0; // eslint-disable-line require-atomic-updates
		});

		it('returns success and the user if a valid user/pass and not locked out', async () => {
			const result = await service.userLoginAsync(mockUser.username, mockUser.passwordhash, ipAddr);
			expect(result.result).to.eql(service.loginResults.success);
			expect(result.user).not.to.be.null;
		});

		it('locks out a user after reaching the maxLoginFailures', async () => {
			mockUser.failedattempts = 2;
			const result = await service.userLoginAsync(mockUser.username, 'bad', ipAddr);
			expect(result.result).to.eql(service.loginResults.lockedOut);
			expect(result.user).to.be.null;
			mockUser.failedattempts = 0; // eslint-disable-line require-atomic-updates
		});
	});
});
