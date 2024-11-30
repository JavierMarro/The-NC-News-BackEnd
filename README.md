# :newspaper_roll: Northcoders News API :newspaper:

**Sections:**

1. [Project description](#project-description)
2. [Set up instructions](#set-up-instructions)
3. [Running the API on a client](#running-the-api-on-a-client)

## Project description:

NC News is a backend server that uses a PostgreSQL database to retrieve news articles. The project aims to simulate the creation of a real-world backend service providing several endpoints for fetching and manipulating data.
Users can:

- Make HTTP requests to a news server where they can find news articles.
- Post, view and delete comments on articles and update votes.
- Upvote and downvote articles.

## Set up instructions:

As mentioned above, the database used is PostgreSQL and interactions are made using Node. Before starting to set up this project please make sure to have these in the version shown or a later version:

```
- Node v22.9.0
- PostgreSQL v14.13
```

Please follow these steps in order to run this project locally:

#### - Fork and clone the repository

You can fork this repository to your own GitHub account, then choose a directory where to clone it using the following command:

```
git clone github.com/JavierMarro/NC-News-BackEnd.git
```

Alternatively you can skip the fork step and directly clone it.

#### - Install dependencies

Once the repository has been cloned, run the command below at the root directory to install the required dependencies:

```
npm install
```

#### - Create environment variables

Again, at the root level of this project, please create two different `.env` files, one that links to the test database and another that links to the dev data:

`.env.development`
Inside this file, place this line:
`PGDATABASE=nc_news`

`.env.test`
Inside this file, place this line:
`PGDATABASE=nc_news_test`

#### - Seed the database

In order to create and seed the local databases please run the following commands in the order provided:

```
npm run setup-dbs
npm run seed
```

You should be ready to run and test the code once the above steps have been completed. as well as check its functionality.

## Running the API on a client:

Running the following command will get the PORT listening for requests:

```
npm run start
```

You should see a message on the terminal `Listening on 9090...`, this means the server is ready to accept requests. In order to break connection please use this command in the terminal: `Option + C` on Mac, `Ctrl + C` on Windows`.

You will have to use a client like **Insomnia** to send GET requests and access the data.
If using Insomnia:

- Click on `Create` and `Request collection` from the drop down menu.
- Then click on `New HTTP Request`, this will give you access to the search bar.
- Use **`localhost:9090/api/`** in the search bar so you can find a list of all endpoints available.
- Navegate to different endpoints using the search bar.

![alt text](zendpoint1.png)

![alt text](zendpoint2.png)

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
