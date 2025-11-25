ifneq (,$(wildcard .env))
	include .env
	export $(shell sed 's/=.*//' .env)
endif

.PHONY: dev prisma-generate prisma-migrate

prisma-generate:
	@npx prisma generate

prisma-migrate:
	@npx prisma migrate dev --name init

dev:
	@yarn dev
