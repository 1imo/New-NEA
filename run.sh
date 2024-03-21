#!/bin/bash

# Host the front end
cd front && vite --host &
# Host the back end monolith
cd back && npx nodemon index.js &
# Host the recommendation engine microservice
cd RecommendUsers && cargo run &
# Host the likely temporary image server solution
cd ImageServer && cargo run &
# Host the dbms interface for quick oversight of the tables
cd back/prisma && npx prisma studio &
# Open IDE at the root of the project
code .
