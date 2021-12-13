FROM node:14

WORKDIR /availability-manager
COPY package.json .
RUN npm install
COPY . .
CMD npm start