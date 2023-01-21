
## Description

This is a simple NestJS application that uses the NestJS framework to create a REST API for contiually fetching and storing data of live Twitch streams using Twitch-JS, Typescript, and TypeORM.

1. Why did you choose X as a storage option for the data?
    I used sqlite because of the simplity of the database. It is easy to setup and use. It is also a good option for small applications like this. I also used sqlite because it is a file based database. This makes it easy to store the data on the local machine. If this was a larger application, I would use a NoSQL database like MongoDB and containerize the application with Docker. Using a RDBMS would be a suboptimal choice for this application because there is only 1 table and no other relations between different data tables.
2. How you would accomplish this if had to track every stream on Twitch?
    Taking data from TwitchTracker.com, there is a peak of 233k concurrent channels and and recent average of 100k concurrent channels. This is a lot of data to store and process. The current implementation is not scalable and would not be able to handle this amount of data. I would abstract the managers into a separate class that would be responsible for handling a set number of streams. If the manager has a max number of streams, a new instance would be created. Another approach to scaling is the use of Kubernetes and Docker. I would containerize the application and use Kubernetes to manage the containers. 
3. What challenges would it introduce on a storage level?
    Storage would need to accomendate a large amount data. A quick estimation would be 200k streams * 10 data points per stream *  100 bytes per data point = 200MB of data per day. Then if the application was online for 10 years, 10 years * 365 days * 200MB would be 730GB total space needed. This would be a lot of data to store and process. I would use a NoSQL database like MongoDB to store the data. Then other strategy of scaling databases would be like sharding or partitioning.
4. How would you build an API that makes the data you saved retrivable?
    The implementation here is very basic. Using a database controller and service, I would expose endpoints for users to query the data. Endpoints would have more options in query parameters or even request body. I would also use a cache like Redis to store the data for a short period of time to reduce the load on the database if the same data is being read frequently. 
    


## Installation

```bash
$ npm install
```

create a .env file in the root directory and add the following variables
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
