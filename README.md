# :newspaper_roll: Northcoders News API :newspaper:

**Sections:**

1. [Project description](#project-description)
2. [Set up instructions](#set-up-instructions)

## Project description:

NC News is a backend server that uses a PostgreSQL database to retrieve news articles. The project aims to simulate the creation of a real-world backend service providing several endpoints for fetching and manipulating data.
Users can:

- Make HTTP requests to a news server where they can find news articles.
- Post new comments on articles and update votes.

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

---

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
