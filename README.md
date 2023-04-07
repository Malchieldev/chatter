# Chatter (Typescript)

### Built with Node js, Express, MongoDB, React.

### Functionalities

- Search Users.
- One - One Chat.
- Delete message
- Google auth
- JWT Authentication.
- Sockets


### Tech

- Frontend : [React](https://reactjs.org/)
- Backend :  [Express](https://expressjs.com/)
- Database : [MongoDB Atlas](https://www.mongodb.com/)
- Routing : [React Router Dom V6](https://reactrouter.com/)

### Installation

#### Clone

- Clone this repo with url `https://github.com/Malchieldev/chatter`

##### Setup

> Install npm dependencies using npm install

```
$ npm install && cd client && npm install

```

> Set up a MongoDB database either locally or provision a free database with MongoDB Atlas

> Create a .env file in the root directory

> Set up required environment variables.

```
DB_NAME = Mongo DB name
DB_USERNAME = Mongo DB username
DB_PASSWORD = Mongo DB user - password
GOOGLE_CLIENT_ID = google client ID
GOOGLE_CLIENT_SECRET = google client secret
ROOT_SERVER_URL = root server url
ROOT_SERVER_PORT = root server port
JWT_SECRET = your JWT secret
JWT_LIFETIME = JWT lifetime 
```

> Create a .env file in the client directory

> Set up required environment variables.

```
REACT_APP_ROOT_SERVER_URL = root server URL
REACT_APP_ROOT_SERVER_PORT = root server port
REACT_APP_GOOGLE_CLIENT_ID = google client ID
REACT_APP_NAME = App name
```

> In the root directory (backend) and client directory (frontend) run the following command

```
npm start
```

### Screenshots

Signup

![image](https://user-images.githubusercontent.com/118569517/227731551-1bb78767-770b-46c8-b6c7-d08567e1817e.png)

Main chat

![image](https://user-images.githubusercontent.com/118569517/227731528-2f340d3a-2640-486f-bbbd-26f02d500c7c.png)

Profile of current user

![image](https://user-images.githubusercontent.com/118569517/227731593-4b308ba7-1756-46e6-afd4-d909b34bedbf.png)

Profile of another user

![image](https://user-images.githubusercontent.com/118569517/227731621-3e0cf391-871f-4cd2-a6d2-d5888e7c4f10.png)


