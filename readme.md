# CSV/XML Laravel DOCKER

<table>
<tr>
<td>
  This application is an CSV/XML extractor project using Laravel 6 and react 18.
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

## Docker setup

<h6 style="color:red">Note :</h6>
<p>Make sure that there is no other containers or services using the following ports: <b style="color: red">80</b>, <b style="color: red">3306</b>. Otherwise, you can change the ports in the .env file and the docker-compose file before executing the next commands : </p>

```bash

# Must be in the root folder
$ docker-compose up -d

# Access the bash of the container (non-testing) - to leave type: "exit"
$ docker exec -it laravel bash  

# Change this value in .env with your host (laravel folder)
$ MIX_APP_URL=

# Install dependencies
$ composer install

# Once inside the bash
$ php artisan migrate
# If an error is returned, the DB is not running yet, check status and try again
# (check with docker ps)
```

<p>The app can be accessed through: <a href="http://localhost/">http://localhost/</a></p>
<p style="color: #ffacac">Data can be seed with: </p>

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

# Start the tests
$ ./vendor/bin/phpunit
```

## Non-docker setup

```bash
# Get inside the correct folder
$ cd /src

# Get env file
$ cp .env.example .env

# Generate key
$ php artisan key:generate

# Change this value in .env (laravel folder) with your host
$ MIX_APP_URL=

# Install dependencies
$ composer install

# Once inside the bash
$ php artisan migrate
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
```

<h6 style="color: red">Production environment : </h6>

```bash
# Launch production mode
$ npm run prod
```
