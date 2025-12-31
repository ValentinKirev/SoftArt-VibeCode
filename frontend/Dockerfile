# Use the official Node.js 18 Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the remaining source code
COPY . .

# Expose port 3001 (match docker-compose)
EXPOSE 3001

# Start the app
CMD ["npm", "run", "dev"]