FROM node:alpine

WORKDIR /opt/janinekmkinney

COPY src/ /opt/janinekmkinney/src
COPY package.json /opt/janinekmkinney/package.json

RUN npm i --production --no-package-lock --quiet --no-optional

CMD ["node", "/opt/janinekmkinney/src/index.js"]