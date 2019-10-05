import { Pak } from './PakFormat';
import fs from 'fs';
import path from 'path';
import request from 'request';
const download = require('download-file');

request(
	'https://nexus.inpureprojects.info/ModLoader64/update/update.json',
	(error, response, body) => {
		if (!error && response.statusCode === 200) {
			if (fs.existsSync('./ModLoader.pak')) {
				let pak: Pak = new Pak('./ModLoader.pak');
				pak.extractAll('./');
				fs.unlinkSync('./ModLoader.pak');
				process.exit(1852400485);
			}
			const fbResponse = JSON.parse(body);
			console.log('Got a response: ', fbResponse);
			let version = 'Nothing';
			console.log(path.resolve("./update.json"));
			if (fs.existsSync('./update.json')) {
				version = JSON.parse(fs.readFileSync('./update.json').toString())
					.version;
			}
			let options = {
				directory: './',
				filename: 'ModLoader.pak',
			};
			if (version !== fbResponse.version) {
				fs.writeFileSync('./update.json', JSON.stringify(fbResponse));
				download(
					'https://nexus.inpureprojects.info/ModLoader64/update/ModLoader.pak',
					options,
					function (err: any) {
						if (err) throw err;
						if (fs.existsSync('./ModLoader.pak')) {
							let pak: Pak = new Pak('./ModLoader.pak');
							pak.extractAll('./');
							fs.unlinkSync('./ModLoader.pak');
						}
					}
				);
			} else {
				if (fs.existsSync('./ModLoader.pak')) {
					let pak: Pak = new Pak('./ModLoader.pak');
					pak.extractAll('./');
					fs.unlinkSync('./ModLoader.pak');
				}
			}
		} else {
			console.log(
				'Got an error: ',
				error,
				', status code: ',
				response.statusCode
			);
		}
	}
);
