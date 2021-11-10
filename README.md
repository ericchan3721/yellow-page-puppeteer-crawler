# Yellow Page Crawler / Spider
It's a Crawler / Spider for crawling clinic data on [Yellow Page](https://www.yp.com.hk).

## Installation guide for packages

You should be install the [Puppeteer](https://pptr.dev/) first, other packages (e.g. fs, datetime) should be installed by default.

Run the following command to install all dependencies
```sh
yarn install
```

### Required packages

Required Package|
----------------|
fs              |
puppeteer       |

### Development Environment
Tools | Version
------|--------
Node  | 14.15.4

## Run the cralwer
You can run the crawler by following command:
```sh
node yp_crawler.js
```

## Output files
The crawler will generate the result csv files with filename format `clinic_YYYYMMDD_HHmmss.csv` when each crawl.