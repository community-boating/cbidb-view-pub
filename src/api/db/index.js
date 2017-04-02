import oracledb from 'oracledb';
import fs from 'fs';
import ini from 'ini';

var connectionOptions = ini.parse(fs.readFileSync('./ini/private.ini', 'utf-8')).dbCredentials;

const createPool = function() {
	return new Promise((resolve, reject) => {
		oracledb.createPool(connectionOptions, (err, pool) => {
			if (err) reject(err);
			else resolve(pool);
		});
	});
};

export {
	createPool
};
