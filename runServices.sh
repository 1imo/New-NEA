#!/bin/bash

# Change directory to the "front" folder and run the "vite" command with the "--host" flag in a new terminal
gnome-terminal -- bash -c "cd front && vite --host"

# Change directory to the "back" folder and run the "npx nodemon index.js" command in a new terminal
gnome-terminal -- bash -c "cd back && npx nodemon index.js"

# Change directory to the "RecommendUsers" folder and run the "cargo run" command in a new terminal
gnome-terminal -- bash -c "cd RecommendUsers && cargo run"

# Change directory to the "ImageServer" folder and run the "cargo run" command in a new terminal
gnome-terminal -- bash -c "cd ImageServer && cargo run"

# Change directory to the "back/prisma" folder and run the "npx prisma studio" command in a new terminal
gnome-terminal -- bash -c "cd back/prisma && npx prisma studio"

# Open Visual Studio Code in the current directory in a new terminal
gnome-terminal -- bash -c "code ."