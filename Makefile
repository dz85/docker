.PHONY: git node

git:
	git add . && git commit -m "a" && git push origin main
node:
	node .script/get-matrix.mjs
test:
	docker run --rm --name=test -idt dz85/node:18-alpine-gitlab
	docker exec -it test sh
