module.exports = async () => {
	process.env.CRYPTO_ROUNDS = 10;
	process.env.JWT_SECRET_KEY = 'This is a pretty awful key.';
	process.env.JWT_EXPIRATION = '12h';
	await Promise.resolve();
};
