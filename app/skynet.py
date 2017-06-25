import base64
import uuid
import pprint
import socket
import datetime
import json
import random
import math
from get_score import get_score

from flask import Flask
from flask import request
from flask import make_response

app = Flask(__name__)


app_version = "1"
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

@app.route('/static/<filename>')
def static_file(filename):
     return open("/code/html/" + filename).read()



def wrap_cookie(txt):
    resp = make_response(txt)
    if not has_cookie():
        resp.set_cookie("skynet-version", app_version)
        resp.set_cookie("userid", str(uuid.uuid1())[0:6])
    return resp

@app.route('/teacher')
def teacher():
    return wrap_cookie(open("html/teacher.html").read())

@app.route('/send_emotions', methods=['POST'])
def send_emotions():
     userid = request.cookies.get("userid")
     version = request.cookies.get("skynet-version")
     print("START send_emotions", userid)
     print("version", version)
     if version != app_version:
          return {}
     emotion = request.get_json()
     print('='*100 + '\n')
     pprint.pprint(emotion)
     print('\n' + '='*100)
     if emotion is None:
          emotion = {}
          emotion['engagement'] = 0
     elif emotion["face"]==0:
          emotion = {}
          emotion['engagement'] = 0
     else:
          emotion['engagement'] = get_score(emotion)
     emotion['last-seen'] = str(datetime.datetime.now())
     emotion['userid'] = userid
     emotion['agent'] = request.environ.get('HTTP_USER_AGENT')
     emotion['version'] = version
     set_data(emotion)
     print("STOP send_emotions", userid)
     return wrap_cookie("ok")

@app.route('/teacher-emotions')
def teacher_emotions():
     students_emotions = get_data()
     print(students_emotions)
     new_dict = {}
     for key in students_emotions:
          new_dict[key] = {
               key: {
                    'engagement': students_emotions[key]['engagement']
               }
          }
     return wrap_cookie(json.dumps(new_dict))

def has_cookie():
    userid = None
    try:
        userid = request.cookies.get("userid")
    except:
        pass
    return userid is not None
 
@app.route('/')
def index():
     return wrap_cookie(open("html/student.html").read())






context = ('/code/host.crt', '/code/host.key')

app.run(host='0.0.0.0',port=443, 
        debug=True,
        ssl_context=context)
