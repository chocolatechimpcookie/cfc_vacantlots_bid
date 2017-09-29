# Newark Vacant Lots app

This app allows developers to explore abandoned lots in Newark. It is currently under active development. 
We are working on ways to enable communication between developers and the City of Newark. Hopefully
this will help to encourage new opportunities for the city.

## Map of abandoned lots

<img width="400" alt="screen shot 2017-04-29 at 9 30 00 pm" 
src="https://cloud.githubusercontent.com/assets/6666044/25560528/2fdaa548-2d24-11e7-805c-3041efe5969d.png">

## Install

Needs work...

## Run on server

Go to the project directory and 
first get the mongodb server running
```bash
$ mongod
```
You may have to use sudo depending on how you installed mongodb.

Then start you node server
```bash
$ node server.js
```

## Run indefinitely on small server
Go to the cloned repo and checkout the `deploy` branch.
Get the mongo server running indefinitely. Normally you can
use a service, but on a small server you may need the --smallfiles
and --nojournal options which significantly decrease the memory footprint
of the mongo database. You can run it indefinitely using `nohup`:
```bash
$ sudo nohup mongod --smallfiles --nojournal &
```

Then start you node server (sudo is necessary because we are using port 80)
```bash
$ sudo forever start server.js
```
