/**
 * @name validators.js
 * @description Validation methods for expected types and conditions
 */

/**
 * Validates that the value is a valid date
 * @param {string} name
 * @param {Date} date
 */
const validateDate = (name, date) => {
	if (!date || (Object.prototype.toString.call(date) !== '[object Date]'
        && isNaN(date))) {
		throw new Error(`${name} is not a valid date.`);
	}
};

/**
 * Validates the expected type of the field.
 * Throws an error if they type does not match
 * @param {object} value
 * @param {string} name
 * @param {string} expectedType
 */
const validateFieldType = (value, name, expectedType) => {
	if (expectedType === 'date') {
		return validateDate(name, value);
	}
	if (typeof value !== expectedType) {
		throw new Error(`${name} field is invalid.`);
	}
};

/**
 * Validates a string for type and length
 * @param {string} value
 * @param {string} name
 * @param {number?} min
 * @param {number?} max
 */
const validateRequiredString = (value, name, min, max) => {
	validateFieldType(value, name, 'string');
	if (value.length === 0) {
		throw new Error(`${name} is required.`);
	}

	if (min && value.length < min) {
		throw new Error(`${name} is too short.  Min length: ${min}`);
	}

	if (max && value.length > max) {
		throw new Error(`${name} is too long.  Max Length: ${max}`);
	}
};

module.exports = {
	validateFieldType,
	validateRequiredString
};