# Use Node.js 18 image
FROM node:16.16.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the frontend code
COPY . .

# Build the frontend for production
RUN npm run build

# Expose port 3000
# EXPOSE 3000

# Command to start the frontend server
CMD ["npm", "run", "dev"]
