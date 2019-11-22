const expect = require('chai').expect;

const audit = require('../../../src/util/audit.js');

describe('util/audit.js', () => {
	describe('getIpAddress', () => {
		const ipAddr = '10.14.3.7';
        
		it('gets the ip from the proxy header', () => {
			const req = {
				headers: {
					'x-forwarded-for': ipAddr
				}
			};
			const res = audit.getIpAddress(req);
			expect(res).to.eql(ipAddr);
		});

		it('gets the ip from the connection', () => {
			const req = {
				connection: {
					remoteAddress: ipAddr
				}
			};
			const res = audit.getIpAddress(req);
			expect(res).to.eql(ipAddr);
		});

		it('handles null requests', () => {
			const res = audit.getIpAddress(null);
			expect(res).to.eql('');
		});

		it('handles undefined requests', () => {
			const res = audit.getIpAddress(undefined);
			expect(res).to.eql('');
		});

		it('returns an empty string when no addresses are found', () => {
			const req = {};
			const res = audit.getIpAddress(req);
			expect(res).to.eql('');
		});
	});
});
