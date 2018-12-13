
build:
	cd client && npm run build
start: build
	cd server && bin/www

deployment_branch = master
deploy:
	ansible-playbook -vv -i deployment/hosts deployment/deploy.yml -e deployment_branch=$(deployment_branch)
