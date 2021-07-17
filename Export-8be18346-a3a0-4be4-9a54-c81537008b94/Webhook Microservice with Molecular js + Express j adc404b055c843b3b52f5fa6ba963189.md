# Webhook Microservice with Molecular.js + Express.js administration server

**The implementation involves the creation of admin express backend and a webhook microservice respectively.** 

## Features

1. Admin can register, update, list and delete webhooks through the incitement of (“webhook.register”, “webhook.list”, “webhook.update”, “webhook.delete”) actions of the webhook microservice.
2. The '/ip' route records the visitor's ip address through the ***X-Forwarded-For (XFF)*** HTTP header field which the incites the "webhook.trigger" action of the microservice.
3. The admin has authentication with password encryption to ensure that the level of protection of user data and passwords is reliable.
4. The express-admin-server is equipped with implementation of sessions and cookies to retain the state information of the user's logging in, signing up and logging out activities for limited periods of time.
5. All routes are protected by implementation of middlewares which rely on session data to ensure the current state of authorization.
6. The system is personalized to each user, that is, each user can register, update, list, delete and trigger the webhooks that they created to make the system closer to the current existing systems.
7. The frontend pages of all administration actions such as registration, updation, triggering and deletion were set up to attain a higher level abstraction to the user in administration of the webhooks.
8. The microservice is built in a distributed form of a API gateway loosely coupled with the webhook service. The webhook service holds all the action which are incited for the administration of the webhooks.
9. The microservice action methods implement an asynchronous approach thereby enhancing the power of the non-blocking nature of node.js.
10. The "webhook.trigger" action triggers all the webhooks registered by a user to make post requests to their respective target urls. The requests are made in parallel by using the promise based methodologies in node to implement a batch based execution flow. The parameters such as the concurrency of the requests are set according to the problem statement which is at most 20 requests to be parallelized per batch.
11. The bonus problem statement that expressed the requirement of handling of failed requests concurrently by setting up retries is also handled by setting up upto 5 retries for each of the requests receiving a status code not equal to 200 all while maintaining the batch execution flow with the defined concurrency.
12. Individual docker images of express-admin-server and webhook-microservice were built and pushed to docker-hub. The API calls from the admin-server to the microservice however do not perform satisfactorily with docker run and must be preferred to be run locally at the current stage of the system.

## Tech Stack

1. Node.js 
2. Express
3. Molecular
4. EJS
5. CSS
6. Bootstrap
7. docker

## Setting up the Project Locally

1. Clone the repository.

### Express-admin-server

1. cd to ***admin*** directory. 

    ```powershell
    cd admin/
    ```

2. Create a **mongoDB cluster**.
3. Configure the network access for the database as your current IP address. 

    ![Webhook%20Microservice%20with%20Molecular%20js%20+%20Express%20j%20adc404b055c843b3b52f5fa6ba963189/Screenshot_2021-07-17_at_9.24.38_PM.png](Webhook%20Microservice%20with%20Molecular%20js%20+%20Express%20j%20adc404b055c843b3b52f5fa6ba963189/Screenshot_2021-07-17_at_9.24.38_PM.png)

4. Add a database user with unlimited read and write privileges. 

    ![Webhook%20Microservice%20with%20Molecular%20js%20+%20Express%20j%20adc404b055c843b3b52f5fa6ba963189/Screenshot_2021-07-17_at_9.26.04_PM.png](Webhook%20Microservice%20with%20Molecular%20js%20+%20Express%20j%20adc404b055c843b3b52f5fa6ba963189/Screenshot_2021-07-17_at_9.26.04_PM.png)

5. Add the mongoDB connection uri as the environment variable in the .env_example file. In the place of database name add **"users"**. 

    ```
    MONGODB_URI=mongodb+srv://<username>:<password>@webhookcluster.b8nt7.mongodb.net/**users**?retryWrites=true&w=majority
    PASS=#12#12@97//.65*&^%33 //example
    SALT=10 //example
    ```

6. Set up the **salt rounds** environment variable. (**recommended from 8 to 16**).
7. Set up the environment variable for the **session secret string**.
8. Rename the **.env_example** to **.env** which will be then used for the importing of the environment variables.
9. Run ***npm install*** for installation of all the dependencies. 

    ```powershell
    npm install
    ```

10. Then start the server with ***npm start***. 

    ```powershell
    npm start
    ```

11. Go to **https://localhost:3000/** to access the admin-application. 

    ![Webhook%20Microservice%20with%20Molecular%20js%20+%20Express%20j%20adc404b055c843b3b52f5fa6ba963189/Screenshot_2021-07-17_at_9.33.50_PM.png](Webhook%20Microservice%20with%20Molecular%20js%20+%20Express%20j%20adc404b055c843b3b52f5fa6ba963189/Screenshot_2021-07-17_at_9.33.50_PM.png)

### Webhook-microservice

1. cd to ***webhook_ms*** directory. 

    ```powershell
    cd webhook_ms/
    ```

2. Add the mongoDB connection uri as the environment variable in the .env_example file. In the place of database name add **"webhooks".**

    ```
    MONGODB_URI=mongodb+srv://<username>:<password>@webhookcluster.b8nt7.mongodb.net/**webhooks**?retryWrites=true&w=majority
    ```

3. Rename the **.env_example** to **.env** which will be then used for the importing of the environment variables.
4. Run ***npm install*** for installation of all the dependencies.

    ```powershell
    npm install
    ```

5. Then start the server with ***npm run dev***.

    ```powershell
    npm run dev
    ```

6. The microservice is coupled with the API gateway service which will be available at ***https://localhost:8080/***

## Some Samples

![Webhook%20Microservice%20with%20Molecular%20js%20+%20Express%20j%20adc404b055c843b3b52f5fa6ba963189/Screenshot_2021-07-17_at_9.39.06_PM.png](Webhook%20Microservice%20with%20Molecular%20js%20+%20Express%20j%20adc404b055c843b3b52f5fa6ba963189/Screenshot_2021-07-17_at_9.39.06_PM.png)

**Admin Route → webhook.list**

![Webhook%20Microservice%20with%20Molecular%20js%20+%20Express%20j%20adc404b055c843b3b52f5fa6ba963189/Screenshot_2021-07-17_at_9.40.01_PM.png](Webhook%20Microservice%20with%20Molecular%20js%20+%20Express%20j%20adc404b055c843b3b52f5fa6ba963189/Screenshot_2021-07-17_at_9.40.01_PM.png)

**Updating A Webhook → webhook.update**

![Webhook%20Microservice%20with%20Molecular%20js%20+%20Express%20j%20adc404b055c843b3b52f5fa6ba963189/Screenshot_2021-07-17_at_9.42.36_PM.png](Webhook%20Microservice%20with%20Molecular%20js%20+%20Express%20j%20adc404b055c843b3b52f5fa6ba963189/Screenshot_2021-07-17_at_9.42.36_PM.png)

**Results of webhook.trigger → Failed requests**