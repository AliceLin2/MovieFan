# phase-1-final-project
Overview

    Movie Fan is an APP using REST api to fetch movie details from The Movie Database. In the app, users could collect the movie they like and save in APP's server for future reference. Users could also rate the movie and give their own comments about the movie and save them.

Usage

    1. register for an API key to "The Movie Database"

    2. const apiKey = "Your API key from step 1", save this variable in the top of index.js file

    3. Install JSON Server, then start JSON Server

        npm install -g json-server
        json-server --watch db.json

    4. open index.html file

    5. nagivate the website

        1' get the movies from "The movie database" API by changing the categories selecting options.
        2' also user can search the movies by keyword
        3' use the 2 buttons in the bottom to fetch the next page movies or previous page movies.
        4' click the like glyph following each movie to collect the movie, also can input own rating and comments about the movie.
        5' my collection section is built on the users' previous colletion on JSON.server
        6' choose each of the movies in my collection section by click on the posters, detail about the movie will display below
        7' edit the rating or comment using edit button
        8' delete the movie from collection by click the delete button

    For more information on navigating the APP, please check out this Youtube link. https://www.youtube.com/watch?v=vQ3D2A5676c

Ralated

    The Movie Database api: https://developers.themoviedb.org/3/getting-started/introduction