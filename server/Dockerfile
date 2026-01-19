# Build a small production image for the server
FROM node:18-alpine

WORKDIR /app

# Install dependencies (production only)
COPY package.json package-lock.json ./
RUN npm ci --production

# Copy compiled dist and data
COPY dist ./dist
COPY src/data/db.json ./src/data/db.json

ENV PORT=5000
EXPOSE 5000

CMD ["node", "dist/server.js"]
