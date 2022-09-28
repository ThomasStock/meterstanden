# Meterstanden

This is a hobby project that I'm building to track electric/gas usage.

I'm building this for fun, to experiment with new technologies. 

It is not meant as a showcase for coding best practices.


Project is running at https://www.stackhouse.be/
_Startup time is slow due to Vercel: https://www.reddit.com/r/nextjs/comments/qvt7vc/slow_first_load/_

## Run this project locally

### Prerequirements:

- npm
- a local postgresql db (easiest way is via docker)

### Commands to copy paste

_in your /code/ folder_
```
git clone https://github.com/ThomasStock/meterstanden.git
cd meterstanden
npm install
```

_If you already have docker running.. (if not, see below)_
```
npm run docker:run
npm run db:push
```

```
npm run dev
```


#### To get docker running on macOs
Easiest and lightweight way is to use container runtime colima (https://github.com/abiosoft/colima)
```
brew install docker
brew install colima
colima start
```
Now you can run `npm run docker:run` which will create a postgresql container




