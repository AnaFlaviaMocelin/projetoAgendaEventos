build:
	docker build -t projeto-agenda --tag projeto-agenda .

start:
	docker run -d --name projeto-agenda --env-file ./.env -p 3000:3000 projeto-agenda

remove:
	docker container rm projeto-agenda

logs: 
	docker logs -f projeto-agenda