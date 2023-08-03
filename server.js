const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const nodeMailer = require('nodemailer');
const { google } = require('googleapis');

const app = express();

app.use(bodyParser.json());

//This allow requests from the frontend
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from // mayo 2022 cambiado a "*" por problemas de CORS que aparecieron en diciembre de 2021
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

const oAuth2Client = new google.auth.OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	process.env.REDIRECT_URI,
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

app.get('/', (req, res) => {
	console.log(process.env.CLIENT_SECRET);
	res.send('hola mundo!');
});

app.post('/contact', async function (req, res) {
	try {
		if (req.body.form.name.value) {
			const emailText =
				'Name: ' +
				req.body.form.name.value +
				'\n' +
				'Email: ' +
				req.body.form.email.value +
				'\n' +
				'Tel: ' +
				req.body.form.tel.value +
				'\n' +
				'Message: ' +
				req.body.form.message.value;

			const accessToken = await oAuth2Client.getAccessToken();

			const transport = nodeMailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAuth2',
					user: process.env.USER,
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					refreshToken: process.env.REFRESH_TOKEN,
					accessToken: accessToken,
				},
			});
			const mailOptions = {
				from: process.env.USER,
				to: 'ggtrotteyn@gmail.com',
				subject: 'Mail from Patavans web-site form',
				text: emailText,
			};

			transport.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});
			res.status(201);
			res.json({ emailText });
		} else {
			res.status(401);
		}
	} catch (error) {
		return error;
	}
});

app.post('/preconversion', async function (req, res) {
	try {
		if (req.body.form.firstName.value) {
			const emailText =
				'Firs Name: ' +
				req.body.form.firstName.value +
				'\n' +
				'Last Name: ' +
				req.body.form.lastName.value +
				'\n' +
				'Email: ' +
				req.body.form.email.value +
				'\n' +
				'Tel: ' +
				req.body.form.tel.value +
				'\n' +
				'Have a Van?: ' +
				req.body.form.haveVan.value +
				'\n' +
				'Van Details: ' +
				req.body.form.vanDetails.value +
				'\n' +
				'Conversion Option Chosen: ' +
				req.body.form.convertionOption.value +
				'\n' +
				'Ideal date for start conversion: ' +
				req.body.form.idealDate.value +
				'\n' +
				'Primary use of the Van: ' +
				req.body.form.primaryUse.value +
				'\n' +
				'Aditional message: ' +
				req.body.form.message.value;

			const accessToken = await oAuth2Client.getAccessToken();

			const transport = nodeMailer.createTransport({
				service: 'gmail',
				auth: {
					type: 'OAuth2',
					user: process.env.USER,
					clientId: process.env.CLIENT_ID,
					clientSecret: process.env.CLIENT_SECRET,
					refreshToken: process.env.REFRESH_TOKEN,
					accessToken: accessToken,
				},
			});
			const mailOptions = {
				from: process.env.USER,
				to: 'ggtrotteyn@gmail.com',
				subject: 'Mail from Patavans web-site preconversion form',
				text: emailText,
			};

			transport.sendMail(mailOptions, function (error, info) {
				if (error) {
					console.log(error);
				} else {
					console.log('Email sent: ' + info.response);
				}
			});
			res.status(201);
			res.json(req.body.form);
		} else {
			res.status(401);
		}
	} catch (error) {
		return error;
	}
});

app.listen(process.env.PORT || 3000, () => {
	console.log('server running!');
});
