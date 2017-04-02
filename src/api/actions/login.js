import { hash } from '../auth';

export default function(conn, session, params) {
	var { userName, password } = params;
	return new Promise((resolve, reject) => {
		let pwHash = hash(userName, password);
		conn.execute(
			"select 1 from users where upper(user_name) = :userName and pw_hash = :pwHash",
			{userName: userName.toUpperCase(), pwHash: pwHash.toUpperCase()},
			(err, results) => {
				if (err) reject(err);
				else {
					console.log(results);
					if (results.rows.length > 0) {
						resolve({
							userID : 1,
							userName : 'jcole'
						});
					} else {
						resolve(false);
					}
				}
			}
		);
	});
}
