import sys
import json
import random 
import math
import time 
import datetime 
from time import sleep
 
#------------------------------------------------------------------------------------

def getDBConfig():
    
    env = "DEV"
    envChosen = raw_input("env ? (DEV/prod)\n> ")
    
    if(envChosen == "prod"):
        env = "PROD"
    

    print "DATABASE : " + env
    if env == "DEV":
        return "host='localhost' dbname='adillions' user='mad'"
    
    if env == "PROD":
        return "host='ec2-54-228-224-127.eu-west-1.compute.amazonaws.com' dbname='d4pq9slihvgnns' user='oubcukdgrmjfrz' password='Yepe_9jrgK0yIVuyhpan-JrWH5'"
    
 
#------------------------------------------------------------------------------------

def generateUID():
    timestamp   = "%x"   % math.trunc(round(time.time() * 1000))
    rand        = "%08x" % math.trunc(random.random() * math.pow(2, 32))
    return timestamp + rand

#------------------------------------------------------------------------------------

def now():
    return math.trunc(time.time()*1000) 

#------------------------------------------------------------------------------------

def printPercentage(num, total):
    p = percent(num, total)
    sys.stdout.write("\r [%-20s] %d%%" % ('='*(p/5), p))
    sys.stdout.flush()

def percent(num, total):
    return math.trunc(float(num)/total * 100) + 1

#------------------------------------------------------------------------------------

def tprint(object):
    print json.dumps((object.__dict__),sort_keys=True, indent=3)

#------------------------------------------------------------------------------------
# yyyy-mm-dd to millis  (2013-10-20 -> 1382220000000) 
def toTimestamp(date):
    return math.trunc(time.mktime(datetime.datetime.strptime(date, "%Y-%m-%d").timetuple())*1000)

def toReadableDate(timestamp):
    return datetime.datetime.fromtimestamp(int(timestamp/1000)).strftime('%B %d, %Y')

# millis to yyyy-mm-dd (1382220000000 -> 2013-10-20) 
def toDate(timestamp):
    return datetime.datetime.fromtimestamp(int(timestamp/1000)).strftime('%Y-%m-%d')

# millis to yyyy-mm-dd (1382220000000 -> 2013-10-20) 
def toSeconds(timestamp):
    return datetime.datetime.fromtimestamp(int(timestamp/1000)).strftime('%Y-%m-%d %H:%m:%S')