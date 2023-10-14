# CSV/XML Laravel DOCKER

<table>
<tr>
<td>
  This application is a CSV/XML extractor project using Laravel 6 and react 18. 
  
  It uses a bearer token to access the backend so be sure to incorporate the default token for testing purposes: "replaceWithRealToken". The token will be generated and accessible if the database is seeded. 
</td>
</tr>
</table>

## Built with

- ![Laravel](https://img.shields.io/badge/laravel-16181D.svg?style=for-the-badge&logo=laravel&logoColor=#191A1A)
- ![Reactjs](https://img.shields.io/badge/React.js-16181D.svg?style=for-the-badge&logo=react&logoColor=BDF0FD)
- ![Docker](https://img.shields.io/badge/Docker-16181D.svg?style=for-the-badge&logo=docker&logoColor=BDF0FD)

## Dependencies

- Bootstrap 4 : https://getbootstrap.com/docs/4.0/getting-started/introduction/
- Axios: https://axios-http.com/docs/intro
- react-toastify: https://fkhadra.github.io/react-toastify/introduction/
- laravel-formatter: https://github.com/SoapBox/laravel-formatter
- Cypress: https://www.cypress.io/

## Pre-requiring
- "php": "^7.2",
- "node": "v20.3.1" -> working
- "npm": "9.6.7" -> working

## Docker setup

<h6 style="color:red">Note :</h6>
<p>Make sure that there is no other container or service using the following ports: <b style="color: red">80</b>, <b style="color: red">3306</b>. Otherwise, you might need to change the ports in the .env file and the docker-compose file before executing the following commands : </p>

```bash

# Must be in the root folder | create .env file
$ cp .env.example .env
$ docker-compose up -d

# Access the bash of the container (non-testing) - to leave type: "exit"
$ docker exec -it laravel bash  

# Install dependencies
$ composer install

# Generate .env
$ cp .env.example .env

# Generate key
$ php artisan key:generate

# Once inside the bash
$ php artisan migrate
# If an error is returned, the DB is not running yet, check status and try again
# (check with docker ps)

# Seed the authorisation token
$ php artisan db:seed --class=ConsumerSeeder

# Change this value in .env with your host (laravel folder). Must end with "/api"
$ MIX_APP_URL=

# If the DB is seeded, this token will work (default bearer token). Put it in .env
$ MIX_APP_TOKEN="replaceWithRealToken"


# Install the npm container (it might take some time)
$ docker-compose exec npm npm install 

# Enter the container
$ docker exec -it npm bash

# Setup npm in dev or production mode
$ npm run dev | npm run prod

```

<p>The app can be accessed through: <a href="http://localhost/">http://localhost/</a></p>
<p style="color: #ffacac">Data (book & consumer) can be seed with: </p>

<table>
<tr>
<td>
  php artisan db:seed
</td>
</tr>
</table>

<h6 style="color: red">Testing environment : </h6>
<p>There is a clone of the laravel container named as: laravel_testing. Phpunit tests can be run safely on that container.</p>

```bash
# Same as before if the container is not running
$ docker-compose up -d

# Access the bash of the container (testing) - to leave type: "exit"
$ docker exec -it laravel_testing bash

# Make sure that the following values are the same in .env.testing
$ APP_ENV=testing
$ DB_CONNECTION=sqlite
$ DB_DATABASE=:memory:

# Start the tests
$ ./vendor/bin/phpunit
```

## Non-docker setup

<p>You must create a database and link it to the .env file</p>

```bash
# Get inside the correct folder
$ cd /src

# Get env file
$ cp .env.example .env

# Install dependencies
$ composer install

# Generate key
$ php artisan key:generate

# Once inside the bash
$ php artisan migrate

# Change this value in .env with your host (laravel folder). Must end with "/api"
$ MIX_APP_URL=

# If the DB is seeded, this token will work (default bearer token). Put it in .env
$ MIX_APP_TOKEN="replaceWithRealToken"

# Tests can be run the same way: 

# Make sure that the following values are the same in .env.testing
$ APP_ENV=testing
$ DB_CONNECTION=sqlite
$ DB_DATABASE=:memory:

# Start the tests
$ ./vendor/bin/phpunit

```

## Front setup

<h6 style="color: red">Testing environment : </h6>

```bash
# Install dependencies
$ npm i

# Compile dev
$ npm run dev

# Hot reload dev
$ npm run watch

# Cypress tests
$ npx cypress open
```

<h6 style="color: red">Production environment : </h6>

```bash
# Launch production mode
$ npm run prod
```
## Cypress

To target html elements with cypress create a "data-id" with a value that follows the following naming: "cy-name-you-want". <br>
Example: &nbsp; `<input data-id="cy-title-name"/>`

<p>Depending on the base url of your application you might have to change the env url inside the <b>cypress.env.json</b> -> "CYPRESS_TARGET_URL"</p>
