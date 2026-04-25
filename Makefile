# Makefile

.PHONY: dev
.DEFAULT_GOAL := dev

workflow:
	powershell.exe -ExecutionPolicy Bypass -File "$(CURDIR)/workflow.ps1"
	
dev:
	pnpm --filter scribedesk dev