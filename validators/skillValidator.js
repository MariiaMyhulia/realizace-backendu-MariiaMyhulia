const { z } = require('zod');

const skillSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional()
});

module.exports = { skillSchema };
