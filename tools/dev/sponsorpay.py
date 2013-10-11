import utils
import hashlib
import requests
 

def main():
    
    #---------------------------------------------------------
    
    hostname            = "http://api.sponsorpay.com/feed/v1/offers.json?"
    apiKey              = "101de242db7d23dc9d5134b3e98a82cfccd893b2"
    appId               = "16913"
#     appId               = "16796"
    locale              = "en"
    offerTypes          = "113" 
    timestamp           = str(utils.now()/1000) 
    uid                 = "1417d5dcf5aca576ce8"

    #---------------------------------------------------------
    
    params = "appid="+appId+"&locale="+locale+"&offer_types="+offerTypes+"&timestamp="+timestamp+"&uid="+uid+"&"+apiKey+""
    hashkey = hashlib.sha1(params).hexdigest()

    url = hostname + params + "&hashkey=" + hashkey
    print url
    
    #---------------------------------------------------------

    r = requests.get(url)
    print r.status_code, r.text

    #---------------------------------------------------------
     
 
if __name__ == "__main__":
    main()