const expect = require('chai').expect;
const sinon = require('sinon');
const request = require('request-promise-native');

const hibp = require('../../../src/service/hibp.js');
const secrets = require('../../../src/util/secrets.js');

describe('service/hibpw.js', () => {
	const badPassword = 'password123!';
	const badPasswordHash = 'ADDBD3AA5619F2932733104EB8CEEF08F6FD2693';

	let sandbox;
	let requestStub;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		requestStub = sandbox.stub(request, 'get').returns(Promise.resolve(`${badPasswordHash}:700`));
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('with feature enabled', () => {
		beforeEach(() => {
			sandbox.stub(secrets, 'get').withArgs('USE_HIBP').returns('true');
		});

		it('calls the pwnedpasswords API', async () => {
			await hibp.hasPasswordBeenPwned(badPassword);
			expect(requestStub.calledWith('https://api.pwnedpasswords.com/range/ADDBD')).to.be.true;
		});

		it('returns true when password has been compromised', async () => {
			const res = await hibp.hasPasswordBeenPwned(badPassword);
			expect(res).to.be.true;
		});

		it('returns false when password NOT compromised', async () => {
			const res = await hibp.hasPasswordBeenPwned('SomeAwesomePassword');
			expect(res).to.be.false;
		});
	});

	describe('with feature disabled', () => {
		beforeEach(() => {
			sandbox.stub(secrets, 'get').returns('false');
		});

		it('does not call the API', async () => {
			await hibp.hasPasswordBeenPwned(badPassword);
			expect(requestStub.called).to.be.false;
		});

		it('always returns false', async () => {
			const res = await hibp.hasPasswordBeenPwned(badPassword);
			expect(res).to.be.false;
		});
	});
});
