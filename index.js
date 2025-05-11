const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuid } = require('uuid');
const { readData, writeData } = require('./utils/fileHandler');

const Skill = require('./models/skillModel');
const Knack = require('./models/knackModel');

const { skillSchema } = require('./validators/skillValidator');
const { knackSchema } = require('./validators/knackValidator');
const { rollSchema } = require('./validators/rollValidator');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const SKILLS_PATH = path.join(__dirname, 'data', 'skills.json');
const KNACKS_PATH = path.join(__dirname, 'data', 'knacks.json');

app.get('/skills', (req, res) => {
	const skills = readData(SKILLS_PATH);
	res.json(skills);
});

app.post('/skills', (req, res) => {
	const parsed = skillSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: 'Invalid skill input', issues: parsed.error.issues });
	}

	const skills = readData(SKILLS_PATH);
	const newSkill = new Skill({ id: uuid(), ...parsed.data });
	skills.push(newSkill);
	writeData(SKILLS_PATH, skills);
	res.status(201).json(newSkill);
});

app.get('/knacks', (req, res) => {
	const knacks = readData(KNACKS_PATH);
	res.json(knacks);
});

app.post('/knacks', (req, res) => {
	const parsed = knackSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: 'Invalid knack input', issues: parsed.error.issues });
	}

	const knacks = readData(KNACKS_PATH);
	const newKnack = new Knack({ id: uuid(), ...parsed.data });
	knacks.push(newKnack);
	writeData(KNACKS_PATH, knacks);
	res.status(201).json(newKnack);
});

app.post('/roll', (req, res) => {
	const parsed = rollSchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: 'Invalid roll input', issues: parsed.error.issues });
	}

	const { traitValue, knackId, difficultyValue } = parsed.data;
	const knacks = readData(KNACKS_PATH);
	const knack = knacks.find(k => k.id === knackId);
	if (!knack) return res.status(404).json({ error: 'Knack not found', knackId });

	const totalDice = traitValue + knack.value;
	const rolls = Array.from({ length: totalDice }, () => Math.floor(Math.random() * 10) + 1);

	rolls.sort((a, b) => b - a);
	const topRolls = rolls.slice(0, traitValue);
	const sum = topRolls.reduce((a, b) => a + b, 0);
	const success = sum >= difficultyValue;

	res.json({ rolls, topRolls, sum, difficultyValue, success });
});

app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
