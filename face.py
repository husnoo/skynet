import httplib, urllib, base64, json
from credentials import subscription_key
import glob

# nix-shell -p python35 -p python35Packages.httplib2
# python test.py

uri_base = 'westeurope.api.cognitive.microsoft.com'

# Request headers.
face_api_headers = {
    #'Content-Type': 'application/json',
    'Content-Type': 'application/octet-stream',
    'Ocp-Apim-Subscription-Key': subscription_key,
}

# Request parameters.
face_api_params = urllib.urlencode({
    'returnFaceId': 'true',
    'returnFaceLandmarks': 'false',
    'returnFaceAttributes': 'emotion',
})

###############################################################################





def query_face_api(body):
    try:
        # Execute the REST API call and get the response.
        conn = httplib.HTTPSConnection('westeurope.api.cognitive.microsoft.com')
        conn.request("POST", "/face/v1.0/detect?%s" % face_api_params, body, face_api_headers)
        response = conn.getresponse()
        data = response.read()
        
        # 'data' contains the JSON data. The following formats the JSON data for display.
        parsed = json.loads(data)
        #from pprint import pprint
        #pprint(parsed)
        emotions = map(lambda x: x['faceAttributes']['emotion'], parsed)
        #pprint(emotions)
        conn.close()
    except Exception as e:
        print("[Errno {0}] {1}".format(e.errno, e.strerror))
    return emotions


if __name__=='__main__':
    output = []
    for fname in glob.glob('/home/nawal/data/skynet/data/Images/*/*'):
        if 'readme' in fname.lower():
            continue
        aname = fname.replace('/home/nawal/data/skynet/data/Images/','')
        #body = "{'url':'https://upload.wikimedia.org/wikipedia/commons/c/c3/RH_Louise_Lillian_Gish.jpg'}"
        body = open(fname).read()
        emotions = query_face_api(body)
        emotions['fname'] = aname
        #print(emotions)
        output.append(emotions)
        out = json.dumps(output,
                         sort_keys=True,
                         indent=4,
                         separators=(',', ': '))
        with open('../data/face_api_class.json','w') as f:
            f.write(out)
            
            


