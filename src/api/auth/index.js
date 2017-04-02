import md5 from 'md5';
import ini from 'ini';
import fs from 'fs';

var salt = ini.parse(fs.readFileSync('./ini/private.ini', 'utf-8')).auth.hashSalt;

const hash = (userName, password) => {
	return md5(salt.substring(0,8) + userName.toUpperCase() + salt.substring(8, 18) + password + salt.substring(18));
};

export {
	hash
};
