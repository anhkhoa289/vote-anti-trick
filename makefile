ifneq (,$(wildcard .env))
	include .env
	export $(shell sed 's/=.*//' .env)
endif

.PHONY: dev prisma

dev:
	@yarn dev

prisma:
	@npx prisma generate
