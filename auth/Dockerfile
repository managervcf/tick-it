FROM node:13.14.0-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . . 
CMD ["npm", "start"]