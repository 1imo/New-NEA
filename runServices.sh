#!/bin/bash

# Run command 1 in a new terminal
gnome-terminal -- bash -c "cd front && vite --host"

# Run command 2 in a new terminal
gnome-terminal -- bash -c "cd back && npx nodemon index.js"

# Run command 3 in a new terminal
gnome-terminal -- bash -c "cd RecommendUsers && cargo run"

# Run command 4 in a new terminal
gnome-terminal -- bash -c "cd ImageServer && cargo run"

gnome-terminal -- bash -c "cd back/prisma && npx prisma studio"

gnome terminal -- bash -c "code ."
