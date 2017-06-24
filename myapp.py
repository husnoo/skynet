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


config = { 
    'ENDPOINT': 'https://documentdb-aggregates.documents.azure.com',
    'MASTERKEY': 'poo',
    'DOCUMENTDB_DATABASE': 'skynet999',
    'DOCUMENTDB_COLLECTION': 'skynet999'
}


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
          
     try:
          students_emotions = {} #json.loads(open("emotions.json",'r'))
     except:
          students_emotions = {}
     
     students_emotions[userid] = emotions

     remove = []
     for case in students_emotions:
          seen_str = students_emotions[case][0]['last-seen']
          seen = datetime.datetime.strptime(seen_str, "%Y-%m-%d %H:%M:%S.%f")
          delay = (datetime.datetime.now() - seen).total_seconds()
          if delay > 10:
               remove.append(case)

     for rem in remove:
          del students_emotions[rem]
          
     #open('emotions.json', 'w').write(json.dumps(students_emotions))
     #print('=='*10)
     #print(userid)
     #pprint.pprint(emotions)
     #print('=='*10)
     
     #client = document_client.DocumentClient(config['ENDPOINT'], {'masterKey': config['MASTERKEY']})
     #document = client.CreateDocument("skynet999", { 
     #     'id': 'data',
     #     'data': json.dumps(students_emotions)
     #})
     return


@bottle.route('/teacher-emotions')
def teacher_emotions():
     students_emotions = {} #open('emotions.json').read()
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

bottle.debug(True)
if socket.gethostname() in ['heisenbug']:
     bottle.run(host='localhost', port=8080)
else:
     app = bottle.app()
