FROM node:13.14.0-alpine
WORKDIR /app
COPY package.json .
RUN npm install --only=prod 
COPY . . 
CMD ["npm", "start"]