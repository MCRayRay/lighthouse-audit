# lighthouse-audit

## Installation

`yarn`

## Lint

`yarn lint`

## Running Locally

`node index.js`

## Running in Docker

`IMAGE=$(docker build -f example/Dockerfile -q example) && docker run --rm $IMAGE`

## TODO

* Rewrite in Typescript.
* Add best-practice performance categories to audit.
* Investigate fixing sandboxing of Chrome in Docker environment.
* Use console.table() for logging.
