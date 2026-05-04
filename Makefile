# Makefile

.PHONY: dev build deploy preview install clean workflow
.DEFAULT_GOAL := dev

workflow:
	powershell.exe -ExecutionPolicy Bypass -File "$(CURDIR)/workflow.ps1"

install: ## Install workspace dependencies
	pnpm install --frozen-lockfile

dev: ## Start the web app dev server (port 3000)
	pnpm --filter scribedesk dev

build: ## Build apps/web with the Vercel preset (writes apps/web/.vercel/output/)
	NITRO_PRESET=vercel pnpm --filter scribedesk build

preview: ## Preview the most recent build
	pnpm --filter scribedesk preview

clean: ## Remove build artifacts
	rm -rf apps/web/.output apps/web/.vercel apps/web/dist

deploy: build ## Build + deploy prebuilt output to Vercel production
	@if [ -z "$(VERCEL_TOKEN)" ]; then echo "ERROR: set VERCEL_TOKEN=... before running 'make deploy'"; exit 1; fi
	cd apps/web && npx vercel@latest deploy --prebuilt --prod --token $(VERCEL_TOKEN) --yes
