import sys
import json
import random 
import math
import time 
from time import sleep
 
def generateUID():
    timestamp   = "%x"   % math.trunc(round(time.time() * 1000))
    rand        = "%08x" % math.trunc(random.random() * math.pow(2, 32))
    return timestamp + rand

def now():
    return math.trunc(time.time()*1000) 

def printPercentage(num, total):
    p = percent(num, total)
    sys.stdout.write("\r [%-20s] %d%%" % ('='*(p/5), p))
    sys.stdout.flush()

def percent(num, total):
    return math.trunc(float(num)/total * 100) + 1

def tprint(object):
    print json.dumps((object.__dict__),sort_keys=True, indent=3)