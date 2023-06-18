build:
	docker build --tag projeto-agenda --no-cache .

start:
	docker run -d --name projeto-agenda --env-file ./.env -p 3000:3000 projeto-agenda

stop:
	docker stop projeto-agenda

remove:
	docker container rm projeto-agenda

logs: 
	docker logs -f projeto-agenda
