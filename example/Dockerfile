FROM node:10-alpine

RUN apk update && apk upgrade && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
  echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
  apk add --no-cache \
    chromium@edge=72.0.3626.121-r0 \
    nss@edge \
    freetype@edge \
    git@edge \
    harfbuzz@edge \
    ttf-freefont@edge

WORKDIR /app

COPY . .

# FIXME This doesn't work. Relies on newer kernel version.
# Need to try setuid sandboxing: https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#alternative-setup-setuid-sandbox
RUN yarn && addgroup -S chrome && adduser -S -g chrome chrome \
  && mkdir -p /home/chrome/Downloads \
  && chown -R chrome:chrome /home/chrome \
  && chown -R chrome:chrome /app

# Run everything after as non-privileged user.
USER chrome

CMD ["node", "index.js"]
