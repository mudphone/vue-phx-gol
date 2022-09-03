.PHONY: kill-all-npm-run-dev
kill-all-npm-run-dev:
	pkill "npm run dev"

.PHONY: kill-all-by-port
kill-all-by-port:
	lsof -t -i:8042 | xargs -r kill

.PHONY: start-iex
start-iex:
	iex -S mix phx.server

.PHONY: start-server
start-server:
	phx.server
