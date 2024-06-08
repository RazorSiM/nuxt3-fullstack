# Load lts iron alpine node image
FROM node:iron-alpine

# Install required dependencies including PostgreSQL client
RUN apk add --no-cache postgresql-client

# Enable Corepack
RUN corepack enable

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN corepack install && pnpm install

# Copy the rest of the files
COPY . .

# Copy the migration script
COPY bin/run-migrations.sh ./bin/run-migrations.sh

# Make the migration script executable
RUN chmod +x ./bin/run-migrations.sh

# Build the application
RUN pnpm run build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["node", ".output/server/index.mjs"]
