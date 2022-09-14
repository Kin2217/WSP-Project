import express from 'express'
import { client } from '../app'
import { checkPassword, hashPassword } from '../hash'
import fetch from 'cross-fetch'
import crypto from 'crypto'

export const userRoutes = express.Router()

userRoutes.get('/', async (req, res) => {
	let userResult = await client.query('select * from users')
	res.json(userResult.rows)
})

userRoutes.post('/register', async (req, res) => {
	try {
		const username = req.body.username
		const password = req.body.password

		if (!username || !password) {
			res.status(400).json({
				message: 'Invalid username or password'
			})
			return
		}

		let hashedPassword = await hashPassword(password)
		await client.query(
			`insert into users (username, password) values ($1, $2)`,
			[username, hashedPassword]
		)
		res.json({ message: 'User created' })
	} catch (error) {
		console.log(error)
		res.status(500).json({ message: 'Internal server error' })
	}
})

userRoutes.post('/login', async (req, res) => {
	const username = req.body.username
	const password = req.body.password
	console.log(req.body)

	if (!username || !password) {
		res.status(400).json({
			message: 'Invalid username or password (no text typed)'
		})
		return
	}

	let userResult = await client.query(
		`select * from users where username = $1`,
		[username]
	)
	let dbUser = userResult.rows[0]

	if (!dbUser) {
		res.status(400).json({
			message: 'Invalid username or password (no such user)'
		})
		return
	}

	// compare password



	let isMatched = await checkPassword(password, dbUser.password)

	if (!isMatched) {
		res.status(400).json({
			message: 'Invalid username or password (wrong pw)'
		})
		return
	}

	let {
		password: dbUserPassword,
		created_at,
		updated_at,
		...sessionUser
	} = dbUser
	console.log(username + ' is logged in')
	req.session['user'] = sessionUser
	req.session.username = username
	res.redirect('/lobby.html')
})

userRoutes.get('/logout', (req, res) => {
	console.log(req.session.username + ' is logged out')
	req.session.destroy(() => { })
	res.redirect('/login.html')
})

userRoutes.get('/me', (req, res) => {
	res.json({
		message: 'Success retrieve user',
		data: {
			user: req.session['user'] ? req.session['user'] : null
		}
	})
})


userRoutes.get('/login/google', loginGoogle);


async function loginGoogle(req: express.Request, res: express.Response) {
	const accessToken = req.session?.['grant'].response.access_token;
	console.log(accessToken)
	const fetchRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
		method: "get",
		headers: {
			"Authorization": `Bearer ${accessToken}`
		}
	});
	const googleProfile = await fetchRes.json();
	const users = (await client.query(`SELECT * FROM users WHERE users.username = $1`, [
		googleProfile.email])).rows;

	let user = users[0];

	console.log(googleProfile);

	if (!user) {
		// Create the user when the user does not exist
		const randomString = crypto.randomBytes(32).toString('hex');
		let hashedPassword = await hashPassword(randomString)
		user = (await client.query(`INSERT INTO users (username,password) 
                VALUES ($1,$2) RETURNING *`,
			[googleProfile.email, hashedPassword])).rows[0]
	}
	console.log(googleProfile.email + ' is logged in')
	if (req.session) {
		req.session['user'] = googleProfile
		req.session.username = googleProfile.email
	}
	return res.redirect('/lobby.html')
}

