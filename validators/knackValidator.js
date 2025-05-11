const { z } = require('zod');

const knackSchema = z.object({
	name: z.string().min(1),
	value: z.number().min(0).max(5),
	description: z.string().optional(),
	skillId: z.string().min(1)
});

module.exports = { knackSchema };