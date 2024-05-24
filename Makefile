.PHONY: activate
activate:
	@echo "Activating the virtual environment with pyenv virtualenv..."
	@pyenv local ZenChat

.PHONY: deactivate
deactivate:
	@echo "Deactivating the virtual environment by switching to system Python..."
	@pyenv local system

.PHONY: run
run:
	@echo "Running the program..."
	@python3 manage.py runserver

# .PHONY: test
# test:
# 	@echo "Running the tests..."
# 	python3 test/test_main.py