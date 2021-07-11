import { Response } from 'express';
export default function Error(res: Response) {
	return (error: string) => {
		res.send({
			success: false,
			error,
		});
	};
}
