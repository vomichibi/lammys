#!/bin/bash

# Update system packages
sudo apt update
sudo apt upgrade -y

# Install Node.js and npm if not already installed
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Install PM2 globally
sudo npm install -g pm2

# Create .env file
cat > .env << EOL
MONGODB_URI=mongodb://localhost:27017/lammys
PORT=3001
EOL

# Install dependencies
npm install

# Start the server with PM2
pm2 start index.js --name "lammys-analytics"
pm2 save
pm2 startup
