interface Verify {
	[key: string]: any;
}

/** Verifies that the data object has all of the keys in the required */
function verifyValues(data: Verify, required: string[], optional?: string[]) {
	const dataKeys = Object.keys(data);
	const allowed = optional ? required.concat(optional) : undefined;

	if (!required.every((x) => dataKeys.includes(x)))
		return {
			success: false,
			error: 'Data is missing required keys.',
		};

	if (optional && !dataKeys.every((x) => allowed?.includes(x)))
		return {
			success: false,
			error: 'Data has extra illegal keys.',
		};

	return {
		success: true,
	};
}

export default verifyValues;
