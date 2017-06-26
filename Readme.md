git clone git@github.com:husnoo/skynet.git


https://skynet999.slack.com/messages/@slackbot/

Global Hackathon 2017 London

## Top level Documentation
The working code is under app/.

There are a few requirements for development and deployment:

1. A valid SSL certificate - we use a self-signed one for development, but this will give a warning/error on most browsers.
2. A valid API Key from Microsoft for the Face API - note we give this away to the user. For development, either get a free one with their dev trial, or hackathon giveaway pass, or just don't bother using one, in which case the student code will return random numbers.
3. A machine running docker


## Building the docker image

### To use the self-signed certificate:
```
git clone git@github.com:husnoo/skynet.git
cd skynet/app
cp ./keys/demo.keys/host.crt ./keys/host.crt
cp ./keys/demo.keys/host.key ./keys/host.key
docker build -t skynet .
```

### To use proper credentials for live deployment:
```
git clone git@github.com:husnoo/skynet.git
cd skynet/app
cp keys/your.own.keys/somename.crt ./keys/host.crt
cp keys/your.own.keys/somename.key ./keys/host.key
docker build -t skynet .
```

## Running locally
```
docker run --rm -ti -p 0.0.0.0:443:443 --name skynet skynet
```

Go to:
```
https://127.0.0.1/
```

To stop it:
```
CTRL+C
```

## Deployment
```
docker save skynet --output skynet.docker
tar -cvzf skynet.docker.tar.gz skynet.docker
scp skynet.docker.tar.gz username@ownserver.com:/tmp/skynet.docker.tar.gz
```

On ownserver.com:
```
tar -xvzf /tmp/skynet.docker.tar.gz -C /tmp/
docker load --input /tmp/skynet.docker
docker run -d -p 0.0.0.0:443:443 --name skynet skynet &
```

To stop it:
```
docker rm -f skynet
```


## To regenerate a self-signed certificate
```
cd skynet/app/keys/demo.keys/
openssl req -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout host.key -out host.crt
```



