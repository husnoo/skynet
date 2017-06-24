import bottle
bottle.BaseRequest.MEMFILE_MAX = 1024 * 1024 * 3 
import base64
import face
import uuid
import pprint
import socket
import datetime
import json
#import pydocumentdb;
#import pydocumentdb.document_client as document_client
from bottle import Bottle, get, run, ServerAdapter
import lockfile
from lockfile import LockFile



import os
if os.path.exists('emotions.json'):
     os.remove('emotions.json')
if os.path.exists('emotions.lock.lock'):
     os.remove('emotions.lock.lock')

     
app_version = "1"

if socket.gethostname()=='heisenbug':
     pem_file = '/home/nawal/data/infrastructure/config-proxy/cloud.husnoo.com.pem'
else:
     pem_file = '/data/host.pem'
     


def load_data():
     lock = LockFile("emotions.lock")
     while not lock.i_am_locking():
          try:
               lock.acquire(timeout=60)    # wait up to 60 seconds
          except LockTimeout:
               lock.break_lock()
               lock.acquire()
     try:
          with open('emotions.json') as f:
               data = f.read()                    
     except IOError as e:
          data = "{}"
     return data


def save_data(data):
     lock = LockFile("emotions.lock")
     while not lock.i_am_locking():
          try:
               lock.acquire(timeout=60)    # wait up to 60 seconds
          except LockTimeout:
               lock.break_lock()
               lock.acquire()
     try:
          with open('emotions.json', 'w') as f:
               f.write(data)                    
     except IOError as e:
          print(e)
     return

     
# copied from bottle. Only changes are to import ssl and wrap the socket
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
        	certfile=pem_file,  # path to certificate
        	server_side=True)
        srv.serve_forever()


@bottle.route('/teacher.js')
def teacherjs():
     check_cookies()
     return open("html/teacher.js").read()

@bottle.route('/teacher')
def teacher():
     check_cookies()
     return open("html/teacher.html").read()


@bottle.route('/student.js')
def studentjs():
     check_cookies()
     return open("html/student.js").read()

@bottle.route('/student')
def student():
     check_cookies()
     return open("html/student.html").read()


@bottle.route('/student_images', method='POST')
def student_images():
     check_cookies()
     userid = bottle.request.get_cookie("userid")
     version = bottle.request.get_cookie("skynet-version")
     print("START student_imahes", userid)

     print("version", version)
     if version != app_version:
          bottle.redirect('/')
     
     data = bottle.request.body.getvalue()
     byte_array = str(data.split(",")[1].decode('base64'))
     emotions = face.query_face_api(byte_array)
     for emotion in emotions:
          emotion['last-seen'] = str(datetime.datetime.now())
          emotion['userid'] = userid
          emotion['agent'] = bottle.request.environ.get('HTTP_USER_AGENT')
          emotion['version'] = version
          print(emotion)
          debug_fname = '/data/tmp/test_{}_{}.png'.format(emotion['agent'],emotion['last-seen'])
          print(debug_fname)
          with open(debug_fname, 'w') as f:
               f.write(byte_array)
          
     
     try:
          thedata = load_data()
          students_emotions = json.loads(thedata)
          print("len(students_emotions)", len(students_emotions))
     except IOError as e:
          students_emotions = {}
     
     students_emotions[userid] = emotions
     if len(emotions)==0:
          del students_emotions[userid]

     remove = []
     for case in students_emotions:
          seen_str = students_emotions[case][0]['last-seen']
          seen = datetime.datetime.strptime(seen_str, "%Y-%m-%d %H:%M:%S.%f")
          delay = (datetime.datetime.now() - seen).total_seconds()
          if delay > 60:
               remove.append(case)
          if version != app_version:
               remove.append(case)
               
     for rem in remove:
          del students_emotions[rem]

     save_data(json.dumps(students_emotions))
     print("STOP student_imahes", userid)

     return


@bottle.route('/teacher-emotions')
def teacher_emotions():
     check_cookies()
     students_emotions = load_data()
     return students_emotions

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
     return open("html/index.html").read()


#bottle.run(host='0.0.0.0', port=443)
srv = SSLWSGIRefServer(host="0.0.0.0", port=443)
run(server=srv)
