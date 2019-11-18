FROM node:alpine

ENV NPM_CONFIG_LOGLEVEL warn

WORKDIR /opt/janinekmkinney

RUN chown -R node:node /opt/janinekmkinney

# Required to get bcrypt working
# https://github.com/kelektiv/node.bcrypt.js/wiki/Installation-Instructions#alpine-linux-based-images
RUN apk --no-cache add --virtual builds-deps build-base python

COPY --chown=node:node package.json /opt/janinekmkinney/package.json

USER node

RUN npm install --only=production --no-package-lock --quiet --no-optional

COPY --chown=node:node src/ /opt/janinekmkinney/src

CMD ["node", "/opt/janinekmkinney/src/index.js"]