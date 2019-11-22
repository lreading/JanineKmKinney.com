const expect = require('chai').expect;
const sinon = require('sinon');

const connectionFactory = require('../../../src/db/connection-factory.js');
const pageSection = require('../../../src/repo/page-section.js');
const repo = require('../../../src/repo/repo.js');

describe('repo/page-section.js', () => {
	const ps = {
		name: 'name',
		createdAt: new Date(),
		createdByUserId: 1,
		title: 'title',
		subtitle: 'sub',
		content: 'content',
		pageId: 2
	};
	let sandbox;
	let getSingleOrNullSpy, queryAsyncSpy, queryMultipleAsyncSpy;

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		sandbox.stub(connectionFactory, 'get').returns({
			query: () => { return { rows:  [] }; }
		});
		getSingleOrNullSpy = sandbox.spy(repo, 'getSingleOrNull');
		queryAsyncSpy = sandbox.spy(repo, 'queryAsync');
		queryMultipleAsyncSpy = sandbox.spy(repo, 'queryMultipleAsync');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('adds a new page section', async () => {
		const expectedSql = `
INSERT INTO Page_Section (Name, CreatedAt, CreatedByUserId, Title, Subtitle, Content, PageId)
VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING Id`;
		const expectedArgs = [
			ps.name,
			ps.createdAt,
			ps.createdByUserId,
			ps.title,
			ps.subtitle,
			ps.content,
			ps.pageId
		];
		await pageSection.addAsync(ps);
		expect(getSingleOrNullSpy.calledWith(expectedSql, expectedArgs)).to.be.true;
	});

	it('gets a page section by page id', async () => {
		const expectedSql = 'SELECT * FROM Page_Section WHERE PageId = $1';
		await (pageSection.getByPageIdAsync(1));
		expect(queryMultipleAsyncSpy.calledWith(expectedSql, [1])).to.be.true;
	});

	it('updates a page section', async () => {
		const expectedSql = `
UPDATE Page_Section (Name, Title, Subtitle, Content)
VALUES ($1, $2, $3, $4)
WHERE Id = $5`;
		const expectedArgs = [ps.name, ps.title, ps.subtitle, ps.content, ps.id];
		await pageSection.updateAsync(ps);
		expect(queryAsyncSpy.calledWith(expectedSql, expectedArgs)).to.be.true;
	});
});