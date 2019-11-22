const chai = require('chai');
const sinonChai = require('sinon-chai');

before(() => {
	chai.use(sinonChai);
});
