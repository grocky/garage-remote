build:
	cd client && npm run build
start: build
	cd server && bin/www
