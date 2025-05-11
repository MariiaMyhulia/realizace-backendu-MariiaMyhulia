const fs = require('fs');

function readData(path) {
	try {
		const data = fs.readFileSync(path, 'utf-8');
		return JSON.parse(data || '[]');
	} catch (err) {
		return [];
	}
}

function writeData(path, data) {
	fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };
