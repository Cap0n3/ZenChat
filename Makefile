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

.PHONY: test_consumers
test_consumers:
	@echo "Running the tests for the consumers..."
	@python manage.py test Chat.tests.test_consumers

.PHONY: test_models
test_models:
	@echo "Running the tests for the models..."
	@python manage.py test Chat.tests.test_models

.PHONY: migrate_all
migrate_all:
	@echo "Migrating the database..."
	@python manage.py makemigrations
	@python manage.py migrate