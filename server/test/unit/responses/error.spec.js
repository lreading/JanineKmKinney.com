const errors = require('../../../src/responses/error.js');

describe('responses/error.js', () => {
	let mockRes;
	let resp;

	beforeEach(() => {
		mockRes = {
			status: (newStatus) => {
				mockRes.newStatus = newStatus;
				return mockRes;
			},
			json: (message) => {
				mockRes.sentMessage = message;
				return mockRes;
			}
		};
		resp = null;
	});

	describe('bad request', () => {
		beforeEach(() => {
			resp = errors.badRequest(mockRes);
		});

		it('sets a status of 400', () => {
			expect(resp.newStatus).toEqual(400);
		});

		it('sets an object as the message', () => {
			expect(typeof resp.sentMessage).toEqual('object');
		});

		it('sets a message.success parameter of false', () => {
			expect(resp.sentMessage.success).toEqual(false);
		});

		it('sets a message.status of 400', () => {
			expect(resp.sentMessage.status).toEqual(400);
		});

		it('sets a message.message of Bad Request', () => {
			expect(resp.sentMessage.message).toEqual('Bad Request');
		});

		it('sets a custom message.message', () => {
			const customMessage = 'Some bad val here';
			resp = errors.badRequest(mockRes, customMessage);
			expect(resp.sentMessage.message).toEqual(customMessage);
		});
	});

	describe('unauthorized', () => {
		beforeEach(() => {
			resp = errors.unauthorized(mockRes);
		});

		it('sets a status of 401', () => {
			expect(resp.newStatus).toEqual(401);
		});

		it('sets an object as the message', () => {
			expect(typeof resp.sentMessage).toEqual('object');
		});

		it('sets a message.success parameter of false', () => {
			expect(resp.sentMessage.success).toEqual(false);
		});

		it('sets a message.status of 401', () => {
			expect(resp.sentMessage.status).toEqual(401);
		});

		it('sets a message.message of Unauthorized', () => {
			expect(resp.sentMessage.message).toEqual('Unauthorized');
		});
	});

	describe('forbidden', () => {
		beforeEach(() => {
			resp = errors.forbidden(mockRes);
		});

		it('sets a status of 403', () => {
			expect(resp.newStatus).toEqual(403);
		});

		it('sets an object as the message', () => {
			expect(typeof resp.sentMessage).toEqual('object');
		});

		it('sets a message.success parameter of false', () => {
			expect(resp.sentMessage.success).toEqual(false);
		});

		it('sets a message.status of 403', () => {
			expect(resp.sentMessage.status).toEqual(403);
		});

		it('sets a message.message of Forbidden', () => {
			expect(resp.sentMessage.message).toEqual('Forbidden');
		});
	});

	describe('not found', () => {
		beforeEach(() => {
			resp = errors.notFound(mockRes);
		});

		it('sets a status of 404', () => {
			expect(resp.newStatus).toEqual(404);
		});

		it('sets an object as the message', () => {
			expect(typeof resp.sentMessage).toEqual('object');
		});

		it('sets a message.success parameter of false', () => {
			expect(resp.sentMessage.success).toEqual(false);
		});

		it('sets a message.status of 404', () => {
			expect(resp.sentMessage.status).toEqual(404);
		});

		it('sets a message.message of Not Found', () => {
			expect(resp.sentMessage.message).toEqual('Not Found');
		});
	});

	describe('internal server error', () => {
		beforeEach(() => {
			resp = errors.internalServerError(mockRes);
		});

		it('sets a status of 500', () => {
			expect(resp.newStatus).toEqual(500);
		});

		it('sets an object as the message', () => {
			expect(typeof resp.sentMessage).toEqual('object');
		});

		it('sets a message.success parameter of false', () => {
			expect(resp.sentMessage.success).toEqual(false);
		});

		it('sets a message.status of 500', () => {
			expect(resp.sentMessage.status).toEqual(500);
		});

		it('sets a message.message of Internal Server Error', () => {
			expect(resp.sentMessage.message).toEqual('Internal Server Error');
		});
	});
});