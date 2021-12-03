FROM node:14

WORKDIR /availability-checker
COPY package.json .
RUN npm install
COPY . .
CMD npm start
