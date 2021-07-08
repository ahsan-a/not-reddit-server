interface Verify {
	[key: string]: any;
}

function verifyValues(data: Verify, required: string[], optional?: string[]) {
	const dataKeys = Object.keys(data);
	const allowed = optional ? required.concat(optional) : undefined;
	if (!dataKeys.every((x) => required.includes(x)))
		return {
			verified: false,
		};

	// if (!dataKeys.every((x)))
}

export { verifyValues };
