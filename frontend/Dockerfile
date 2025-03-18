#python Node.JS
FROM node:23

#init work dir into container
WORKDIR /app

#copy packages with dependencies
COPY package.json package-lock.json ./

#install dependencies
RUN npm install

#copy all files for app
COPY . .

#open port 3000
EXPOSE 3000

#command to run react
CMD ["npm", "run", "dev"]