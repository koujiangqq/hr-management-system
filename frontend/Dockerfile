FROM node:18-alpine

WORKDIR /app

# Copy package.json first for better caching
COPY package.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]