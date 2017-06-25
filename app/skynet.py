from __future__ import print_function # In python 2.7

import base64
import uuid
import pprint
import socket
import datetime
import json
import random
import math
from get_score import get_score
import logging

import flask
from flask import Flask
from flask import request
from flask import make_response, send_from_directory

import sys
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__, static_url_path='/code')
app_version = "1"

from werkzeug.contrib.cache import SimpleCache
cache = SimpleCache()



def get_data():
    if not cache.has('global_storage'):
        cache.set('global_storage', {})
    return cache.get('global_storage')


def set_data(emotion):
    #logging.debug(emotion)
    userid = emotion['userid']
    global_storage = get_data()
    
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
    cache.set('global_storage', global_storage)
    #logging.debug(global_storage)
    return

@app.route('/static/<path:path>')
def static_file(path):
     #logging.debug(path)
     return send_from_directory('html', path)

def wrap_cookie(txt):
    resp = make_response(txt)
    if not has_cookie():
        resp.set_cookie("skynet-version", app_version)
        resp.set_cookie("userid", str(uuid.uuid1())[0:6])
    return resp

@app.route('/teacher')
def teacher():
    #logging.debug('piss off debug')
    return wrap_cookie(open("html/teacher.html").read())

@app.route('/send_emotions', methods=['POST'])
def send_emotions():
     userid = request.cookies.get("userid")
     version = request.cookies.get("skynet-version")
     #logging.debug("START send_emotions" + userid)
     #logging.debug("version" + version)
     if version != app_version:
          return {}
     emotion = request.get_json()
     #logging.debug('='*100 + '\n')
     #pprint.pprint(emotion)
     #logging.debug('\n' + '='*100)
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
     #logging.debug("STOP send_emotions"+ userid)
     return wrap_cookie("ok")

@app.route('/teacher-emotions')
def teacher_emotions():
     students_emotions = get_data()
     logging.debug(students_emotions)
     new_dict = {}
     #logging.debug("students_emotions: " + str(students_emotions))
     #logging.debug("students_emotions keys: " + str(students_emotions.keys()))
     
     for key in students_emotions:
          new_dict[key] = {
               'engagement': students_emotions[key]['engagement']
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
