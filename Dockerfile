FROM node:15
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
ENV PORT 3000
EXPOSE $PORT
# at runtime
CMD [ "npm","run","dev" ]


