git clone git@github.com:husnoo/skynet.git


https://skynet999.slack.com/messages/@slackbot/

Global Hackathon 2017 London

## Top level Documentation
The working code is under app/.

There are a few requirements for development and deployment:

1. A valid SSL certificate - we use a self-signed one for development, but this will give a warning/error on most browsers.
2. A valid API Key from Microsoft for the Face API - note we give this away to the user. For development, either get a free one with their dev trial, or hackathon giveaway pass, or just don't bother using one, in which case the student code will return random numbers.
3. A machine running docker

The backend code lives in `app/skynet.py`, and `app/get_score.py`. The latter is the neural network that characterises the Face API output for our purpose, and the training data lives in `app/theta1.txt` and `app/theta2.txt`.

`app/skynet.py` is the main server code. It exposed the endpoints:
```
@app.route('/static/js/student.js')
@app.route('/static/<path:path>')
@app.route('/teacher')
@app.route('/send_emotions', methods=['POST'])
@app.route('/teacher-emotions')
@app.route('/')
```

1. The first one is for student.js to have the right API key. Terrible design of course, giving away your key.
2. The second is for any js/css/etc files.
3. `/teacher` shows the teacher web page, by reading 'app/html/teacher.html'.
4. `/teacher-emotions` returns a dictionary of values for each connected user.
5. `/` is the main page, which is aimed at students, so it reads in 'app/html/teacher.html' and serves that.
6. `/send_emotions` is a POST endpoint, where students send their emotions as returned by the MS Face API.

### Other trivia
1. We're using the Flask web library, which handles the boring bits of HTTP back and forth, as well as wrapping it all in a HTTPS layer. This is needed for the client camera to be available to us.
2. We give people a cookie, not because we're nice, but because we want to know who's paying attention.
3. `get_data` and `set_data` store the application state, i.e. who's listening, and how much attention they're paying. In an operational setting we'd use redis.
4. 


## Building the docker image

### To use the self-signed certificate and invalid MS Face API Key:
```
git clone git@github.com:husnoo/skynet.git
cd skynet/app
cp ./keys/demo.keys/host.crt ./keys/host.crt
cp ./keys/demo.keys/host.key ./keys/host.key
cp ./keys/demo.keys/azure_face_api_key.txt ./keys/azure_face_api_key.txt
docker build -t skynet .
```

### To use proper credentials for live deployment:
1. Go to `https://portal.azure.com/`, create a "Cognitive Services" service.
2. Under "Resource Management", look for Keys, and copy out "Key 1" and store it in a file called `azure_face_api_key.txt`.

```
git clone git@github.com:husnoo/skynet.git
cd skynet/app
cp path/to/your.own.keys/somename.crt ./keys/host.crt
cp path/to/your.own.keys/somename.key ./keys/host.key
cp path/to/your.own/azure_face_api_key.txt ./keys/azure_face_api_key.txt
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

## Clean docker image cache
```
docker images -q |xargs docker rmi
```
Note that sometimes the browser can also cache .js files, so your changes won't show. Use Incognito Browser for better test results.
