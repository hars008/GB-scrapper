# Use Node.js 18 image
FROM node:16.16.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
# RUN npm install

# Copy the backend code
COPY . .

# Expose port 4000
EXPOSE 4000

# Command to start the backend server
# CMD ["npm", "start"]
