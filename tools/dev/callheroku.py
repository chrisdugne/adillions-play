import utils
import hashlib
import requests
import time
import random
 

def callAdillions():
    
    #---------------------------------------------------------
    
    url = "http://www.adillions.com"
    
    #---------------------------------------------------------

    r = requests.get(url)
    print time.strftime("%Y-%m-%d %H:%M:%S"),  r.status_code

    #---------------------------------------------------------
    
    time.sleep(random.randint(40,50)*60 + random.randint(1,55))
    callAdillions()
     
 
if __name__ == "__main__":
    callAdillions()