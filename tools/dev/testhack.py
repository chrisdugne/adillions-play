import utils
import hashlib
import requests
import time
import random
 

def hack():
    
    #---------------------------------------------------------
    
    url = "http://www.adillions.com/storeLotteryTicket"
    
    #---------------------------------------------------------

    r = requests.post(url)
    print r.status_code

    #---------------------------------------------------------
     
if __name__ == "__main__":
    hack()