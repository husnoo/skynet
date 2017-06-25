import bottle
bottle.BaseRequest.MEMFILE_MAX = 1024 * 1024 * 3 
import base64
import uuid
import pprint
import socket
import datetime
import json
import random
#import pydocumentdb;
#import pydocumentdb.document_client as document_client
from bottle import Bottle, get, run, ServerAdapter
import math

class SSLWSGIRefServer(ServerAdapter):
    def run(self, handler):
        from wsgiref.simple_server import make_server, WSGIRequestHandler
        import ssl
        if self.quiet:
            class QuietHandler(WSGIRequestHandler):
                def log_request(*args, **kw): pass
            self.options['handler_class'] = QuietHandler
        srv = make_server(self.host, self.port, handler, **self.options)
        srv.socket = ssl.wrap_socket (
        	srv.socket,
        	certfile=pem_file,
        	server_side=True)
        srv.serve_forever()

app_version = "1"
pem_file = '/data/host.pem'
global_storage = {}

def get_data():
     return global_storage


def set_data(emotion):
    print(emotion)
    userid = emotion['userid']
    global_storage[userid] = emotion
    remove = []
    for one_id in global_storage:
        face = global_storage[one_id]
        seen_str = face['last-seen']
        seen = datetime.datetime.strptime(seen_str, "%Y-%m-%d %H:%M:%S.%f")
        delay = (datetime.datetime.now() - seen).total_seconds()
        if delay > 60:
            remove.append(one_id)
    for rem in remove:
        del global_storage[rem]
    print(global_storage)
    return

@bottle.route('/static/<filename>')
def static_file(filename):
     return bottle.static_file(filename, root="/code/html")


@bottle.route('/teacher')
def teacher():
     check_cookies()
     return open("html/teacher.html").read()

@bottle.route('/send_emotions', method='POST')
def send_emotions():
     check_cookies()
     userid = bottle.request.get_cookie("userid")
     version = bottle.request.get_cookie("skynet-version")
     print("START send_emotions", userid)
     print("version", version)
     if version != app_version:
          bottle.redirect('/')     
     data = bottle.request.body.getvalue()
     emotion = json.loads(data)
     emotion['last-seen'] = str(datetime.datetime.now())
     emotion['userid'] = userid
     emotion['agent'] = bottle.request.environ.get('HTTP_USER_AGENT')
     emotion['version'] = version

     bad = emotion['sadness'] + emotion['contempt'] + emotion['disgust'] + emotion['anger'] + emotion['fear']
     good = emotion['neutral'] + emotion['surprise'] + emotion['happiness'];
     emotion['engagement'] = math.tanh((good/0.7) / (0.0001 + bad / 0.7) / 100);
     set_data(emotion)
     print("STOP send_emotions", userid)
     return

     
@bottle.route('/teacher-emotions')
def teacher_emotions():
     check_cookies()
     students_emotions = get_data()
     new_dict = {}
     for key in students_emotions:
          new_dict[key] = {
               key: {
                    'engagement': students_emotions[key]['engagement']
               }
          }
     return new_dict

def check_cookies():
     bottle.response.set_cookie("skynet-version", app_version)
     try:
          userid = bottle.request.get_cookie("userid")
     except:
          pass
     if not userid:
          bottle.response.set_cookie("userid", str(uuid.uuid1())[0:6])
          

@bottle.route('/')
def index():
     check_cookies()
     return open("html/student.html").read()


#bottle.run(host='0.0.0.0', port=443)
srv = SSLWSGIRefServer(host="0.0.0.0", port=443)
run(server=srv)
