import time 
import random 
import math
 
def generateUID():
    timestamp   = "%x"   % math.trunc(round(time.time() * 1000))
    rand        = "%08x" % math.trunc(random.random() * math.pow(2, 32))
    return timestamp + rand
    
