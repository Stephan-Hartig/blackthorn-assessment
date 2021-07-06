# Shopping Cart API

## REST API
Can be seen [here][api].

## One-time Initialization
You must create the database tables before running this software with a new database. To do this:

##### For a local machine, i.e., `NODE_ENV` is NOT equal to `"production"`:

   1. Set the necessary environment variables:
      1. `MYSQL_HOST`
      2. `MYSQL_USER`
      3. `MYSQL_PASSWORD`
      4. `MYSQL_DATABASE`
      5. `MYSQL_POOL_LIMIT` as a number between 1 and ~100.
      6. `MEMCACHED_SERVERS` in the form `"host:port"`
   2. Run `$ npm run create-mysql-table`
    

##### For Heroku, i.e., `NODE_ENV` is equal to `"production"`:

   1. Install the necessary add-ons:
      1. MySQL add-on. JawsDB is required unless you manually edit the source    code for the bootstrapping routine.
      2. Memcached add-on. MemCachier is required unless you manually edit the source code for the bootstrapping routine.
   2. Run `$ heroku run create-mysql-table`
    
##### Manually
Alternatively, you can always create the tables manually.

## Building & Running

Heroku now has support for TypeScript, so building and deployment is automatic for pushes.

Locally, run either of the equivalent statements `$ npm run build && npm start` or `$ heroku local build && heroku local web`.


## Heroku Add-ons

This requires JawsDB MySQL for the database requirements, and MemCachier for the Memcached requirements.

## Node Dependencies

Run `$ npm i` to install.

## Benchmarks

##### Apache Benchmark
On a static URL, Apache benchmark puts this at about 250 requests per second on Heroku. On a local machine this was about 2000 requests per second. Of course, real world requests are more varying, and thus not everything will be available cached.

##### Locust
Run `$ npm bench` to test. This requires Python  and its corresponding Locust package to run. After running that command, go to `localhost:8089` in a web browser to access the load-test interface.


[api]: ./docs/frontend/api.md

