import { Response } from 'express';

export default (res: Response, error: string) =>
	res.send({
		success: false,
		error,
	});
