const { promisify } = require('util');
const path = require("path");
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);
const existsAsync = promisify(fs.exists);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

const storagePath = path.join(__dirname, '../../../Storage/Files/');

const preparePath = (key) => {
	return path.join(storagePath, `${key}.cache`);
}
class FileSystemCache {

	static async get(key) {
		const keyPath = preparePath(key);
		const exists = await existsAsync(keyPath);
		if (exists) {
			return await readFileAsync(keyPath, "utf8");
		} else {
			return false;
		}
	}

	static async set(key, value) {
		const keyPath = preparePath(key);
		return await writeFileAsync(keyPath, value, "utf8");
	}

	static async remove(key) {
		const keyPath = preparePath(key);
		const exists = await existsAsync(keyPath);
		if (exists) {
			return await unlinkAsync(keyPath);
		}
		return true;

	}
}

module.exports = FileSystemCache;