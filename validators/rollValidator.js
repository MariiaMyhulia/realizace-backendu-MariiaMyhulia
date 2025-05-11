const { z } = require('zod');

const rollSchema = z.object({
	traitValue: z.number().min(1),
	knackId: z.string(),
	difficultyValue: z.number().min(1)
});

module.exports = { rollSchema };
