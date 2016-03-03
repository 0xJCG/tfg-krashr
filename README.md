# Krashr

This project is an application done by Jonathan Castro for his Final Year Project of Software Engineering.

This application intends to help new software developers to make their webpages more secure. For this reason, it searches for two web vulnerabilities: SQL injections and CSRF.

It counts with a front-end, an API and a Python server to do the searches.

## Getting Started and running the application

To get you started you can simply clone the Krashr repository and install the dependencies. All the examples are writen using a Debian based operating system.

### Back-end

The back-end is developed in Python 3 and uses a PostgreSQL database.

The first thing to install is the database management system:
```
sudo apt-get install postgresql pgadmin
```

The database is in the "db" folder.

Once installed, the next thing is installing Python:

```
sudo apt-get install python3 python3-pip beautifulsoup psycopg2
sudo pip install jsonschema
```

To finish, it is necessary to change the "db_adapter.py" in the "core" folder to enter the information about the database and run the back-end:

```
cd backend/core/
python server.py
```

### API

The API runs using Node.js and a MongoDB database. First of all, it is necessary to install Node.js, npm and MongoDB:

```
sudo apt-get install nodejs npm mongodb
```

The API needs the MongoDB server to be running to work:

```
mongod --smallfiles
```

Once initiated, the API can be initiated:

```
cd api
npm install
node app.js
```

### Front-end

The Frond-end is coded using AngularJS and Bootstrap. The main components are already installed, so it can be initiated:

```
cd frontend
npm start
```

## Contact

For more information about Krashr:

* Email: jonathancastrogonzalez@gmail.com
* Twitter: https://twitter.com/0xJCG
* LinkedIn: https://es.linkedin.com/in/0xjcg
* More documentation: https://goo.gl/xCeXXp
