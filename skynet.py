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


if socket.gethostname()=='heisenbug':
     pem_file = '/home/nawal/data/infrastructure/config-proxy/cloud.husnoo.com.pem'
else:
     pem_file = '/data/host.pem'
     

     
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
     return open("html/teacher.js").read()

@bottle.route('/teacher')
def teacher():
     return open("html/teacher.html").read()


@bottle.route('/student.js')
def studentjs():
     return open("html/student.js").read()

@bottle.route('/student')
def student():
     return open("html/student.html").read()


@bottle.route('/student_images', method='POST')
def student_images():
     userid = bottle.request.get_cookie("userid")
     data = bottle.request.body.getvalue()
     byte_array = str(data.split(",")[1].decode('base64'))
     emotions = face.query_face_api(byte_array)
     for emotion in emotions:
          emotion['last-seen'] = str(datetime.datetime.now())
          emotion['userid'] = userid
          print(emotion)
          
     try:
          thedata = open("emotions.json",'r').read()
          students_emotions = json.loads(thedata)
          print(len(students_emotions))
     except IOError as e:
          print(e)
          students_emotions = {}
     
     students_emotions[userid] = emotions

     #remove = []
     #for case in students_emotions:
     #     seen_str = students_emotions[case][0]['last-seen']
     #     seen = datetime.datetime.strptime(seen_str, "%Y-%m-%d %H:%M:%S.%f")
     #     delay = (datetime.datetime.now() - seen).total_seconds()
     #     if delay > 60:
     #          remove.append(case)
     #for rem in remove:
     #     del students_emotions[rem]
          
     open('emotions.json', 'w').write(json.dumps(students_emotions))
     print('=='*10)
     print(userid)
     pprint.pprint(emotions)
     print('=='*10)
     return


@bottle.route('/teacher-emotions')
def teacher_emotions():
     students_emotions = open('emotions.json').read()
     return students_emotions

@bottle.route('/')
def index():
     try:
          userid = bottle.request.get_cookie("userid")
     except:
          pass
     if not userid:
          bottle.response.set_cookie("userid", str(uuid.uuid1())[0:6])
     print("user:", userid)
     return open("html/index.html").read()


#bottle.run(host='0.0.0.0', port=443)
srv = SSLWSGIRefServer(host="0.0.0.0", port=443)
run(server=srv)
