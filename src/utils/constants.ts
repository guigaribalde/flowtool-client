const URI =
	process.env.NODE_ENV === 'development'
		? 'ws://localhost:3001'
		: 'wss://movie-app-server.up.railway.app';

// eslint-disable-next-line
export { URI };
