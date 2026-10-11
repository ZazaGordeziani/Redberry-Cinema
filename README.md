# Cinema XII

## Project Overview

KINO XII is an online ticket selling platform for the cinema that allows users to:

via Header, browse all sessions, search movies, log in or sign up modal connections

On main page:

- See hero section with animations about featured films
- have now playing session that has all the cards of the currently playing movies.
- Comming soon session that displays the list of the movies that will be availabe soon.
- all the users can see info about movies but only authanticated users can buy tickets, in additon, some movies have age restrictions, so users who do not meet all the requirements, will not be able to buy tickets for such movies.
- in addition, users who do not have completed profile, can't buy tickets
- through comming soon movie cards, by clicking notify me, user makes subscrption to get updates
  On sessions page

- Filter component that suggest varius filter options, like venue, daytime, format, date selection language.
- Sort movies by five categories: earliest first, latest first, price low to high, price high to low, Title:A-Z.
- Click on session opens seat selection modal, max 3 seats can be selected, and then on checkout if all criterias are met, user can buy ticekt

On movies page

-user can see info about movie details and movie sessions according to dates, can choose a session and then try to buy ticekt

Profile page:

- in personal information tab user can update info and save changes
- in tickets tab user can see upcoming and past movies. upcoming movies list is renered as newest first to display. user can make refunds, but max 2 hours before the session start time.

## Features

- User registration and login (token stored in local storage).
- Successful registration automatically logs the user in.
- Avatar upload during registration; if none is provided, the first letter of the username is displayed.
- Filter and sort movie sessions based on user preference.
- Pagination on the movies session page.
- Modal for successful purchase (Congrats modal).
- Loading states before displaying page content.
- On checkout, the e-mail, mobile number and full name fields are pre-filled based on user profile ino.

## Tech Stack

- Frontend: React, TypeScript, TailwindCSS
- State Management: Jotai, React Hook Form
- Validation: Zod, React Hook Form
- Routing: React Router DOM
- API Calls: Axios (`httpClient`)
- Optimized for 1920x1080 screen resolution
- husky installed so the following orders run after commit, to avoid chaotic code
    - npm run ts-check
    - npm run lint:oxlint
    - npm run lint:eslint
    - npm run prettier

## How to Use

1. Clone the repository:

    git clone https://github.com/ZazaGordeziani/Redberry-Cinema.git

    install npm by just typing npm i in terminal and hit enter

    create .env file and set VITE_API_BASE_URL based on the following endpoint .env.example file inforamtion

    npm run dev - to start the project

Vercel link to see the completed project - https://redberry-cinema.vercel.app/
