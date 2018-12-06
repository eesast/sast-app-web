# Builder stage

FROM node:11 AS builder

# Create app directory
WORKDIR /home/node/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build
RUN npm run build


# Runner stage

FROM node:11-alpine
ENV NODE_ENV=production
WORKDIR /home/node/app

# Install serve
RUN npm install -g serve

# Copy build files
COPY --from=builder /home/node/app/build ./build

EXPOSE 27777

CMD serve -s build -p 27777
