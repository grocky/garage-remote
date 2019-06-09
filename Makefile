GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
BLUE   := $(shell tput -Txterm setaf 4)
WHITE  := $(shell tput -Txterm setaf 7)
NC     := $(shell tput -Txterm sgr0)

.PHONY: help
help: ## Print this help messag
	@awk -F ':|##' '/^[^\t].+?:.*?##/ { printf "${BLUE}%-20s${NC}%s\n", $$1, $$NF }' $(MAKEFILE_LIST) | \
	sort

build: ## build docker containers
	docker-compose build

start: ## start docker environment
	docker-compose up -d

build-client: ## build web client
	cd client && npm run build

start-local: build-client ## start local web server
	cd server && bin/www

deployment_branch = master
deploy: ## deploy to deployment_branch
	ansible-playbook -vv -i deployment/hosts deployment/deploy.yml -e deployment_branch=$(deployment_branch)
