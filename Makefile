build:
	docker-compose build

start:
	docker-compose up -d

build-client:
	cd client && npm run build

start-local: build-client
	cd server && bin/www

deployment_branch = master
deploy:
	ansible-playbook -vv -i deployment/hosts deployment/deploy.yml -e deployment_branch=$(deployment_branch)
