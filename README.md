# esd_queue

## Generate database 
Go to wampp -> myPhpAdmin -> sql -> run the mysql statements (get latest script from trello, db script ticket's attachment)

## install dependencies
``` npm install ```

## run index.js ##
``` node index.js ```

### It runs on localhost:3000

### docker stuff
docker build . -t jowettc/esdqueue
docker run --name queue --network my-net -e jowettc/book:1.0
