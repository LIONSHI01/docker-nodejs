FROM node:15
WORKDIR /app
COPY package.json .
# only install dependencies for production
ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi
COPY . ./
ENV PORT 3000
EXPOSE $PORT
# at runtime
CMD [ "node","index.js" ]


