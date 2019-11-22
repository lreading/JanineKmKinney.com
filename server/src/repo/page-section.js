/**
 * @name page-section.js
 * @description Page Section repository
 */
const repo = require('./repo.js');

/**
 * Creates a new PageSection record
 * @param {object} pageSection
 * @returns {number}
 */
const addAsync = async (pageSection) => {
	const sql = `
INSERT INTO Page_Section (Name, CreatedAt, CreatedByUserId, Title, Subtitle, Content, PageId)
VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING Id`;
	const args = [
		pageSection.name,
		pageSection.createdAt,
		pageSection.createdByUserId,
		pageSection.title,
		pageSection.subtitle,
		pageSection.content,
		pageSection.pageId
	];

	const res = await repo.getSingleOrNull(sql, args);
	return res ? res.id : -1;
};

/**
 * Updates a page section
 * @param {object} pageSection
 * @returns {Promise}
 */
const updateAsync = async (pageSection) => {
	const sql = `
UPDATE Page_Section (Name, Title, Subtitle, Content)
VALUES ($1, $2, $3, $4)
WHERE Id = $5`;
	const args = [
		pageSection.name,
		pageSection.title,
		pageSection.subtitle,
		pageSection.content,
		pageSection.id
	];
	await repo.queryAsync(sql, args);
};

/**
 * Gets all page sections associated with a given page id
 * @param {number} pageId
 * @returns {object[]}
 */
const getByPageIdAsync = async (pageId) => {
	const sql = 'SELECT * FROM Page_Section WHERE PageId = $1';
	const args = [pageId];
	return await repo.queryMultipleAsync(sql, args);
};

module.exports = {
	addAsync,
	getByPageIdAsync,
	updateAsync
};
