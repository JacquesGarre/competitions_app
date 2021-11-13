
# Competitions App


Web application based on Symfony 5 and Angular 12 meant for managing table tennis tournaments

## Installation




- To install this project, go to your favorite local directory and run

```bash
git clone https://github.com/JacquesGarre/competitions_app.git
```
### Requirements
- Check if you have composer (https://getcomposer.org/) installed globally by running :  
```bash
composer -v
```
- Same for Node & npm (https://nodejs.org/en/) : 

```bash
node -v
npm -v
```

### Packages installation
 - Back-end (Symfony 5)
```bash
cd competitions_app/api && composer install
```
 - Front-end (Angular 12)
```bash
cd ../front-end && npm install
```

### Database & Back-end server
 - Create a database with your favorite DBMS (Tested only with MySQL)
 - Fill the credentials in api/.env file : 
```bash
DATABASE_URL="mysql://db_user:db_password@127.0.0.1:3306/db_name?serverVersion=5.7"
```
- Run the migration to create tables
```bash
cd ../api
php bin/console doctrine:migrations:migrate
```
- Start back-end server by running : 
```bash
symfony server:start
```
or as a daemon
```bash
symfony serve -d
```
- Check that you can access the API by going to 
```bash
http://127.0.0.1:8000/api
```

- Create an admin user by running this SQL query 
```sql
INSERT INTO `user` 
    (`id`, `email`, `roles`, `password`, `first_name`, `last_name`, `created_at`, `updated_at`, `licence_number`, `points`, `genre`, `club`) 
VALUES 
    (NULL, 'your@email.com', '[\"ROLE_ADMIN\"]', 'yourpassword', 'your Firstname', 'your Lastname', '', NULL, NULL, NULL, NULL, NULL);
```

### JWT token

- Generate a JWT key pair by running : 
```bash
php bin/console lexik:jwt:generate-keypair
```
It should create 2 files in api/config/jwt (private.pem and public.pem)

### Front-end server
- Start front-end server by running
```bash
cd ../front-end
ng serve --port 8081 --open
```
The homepage should be opening automatically on your default browser at : 
http://localhost:8081/
## Authors

- [@JacquesGarre](https://github.com/JacquesGarre)

