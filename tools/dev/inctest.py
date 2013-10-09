from time import sleep
import httplib, urllib

def main():
    
    #--------------------------------------------------------------------
    # 4 * 100000 / sleep(0.0001)  -> 399690
    # 4 * 10000 /  no sleep       -> 39977
    # 4 * 1000 /   no sleep       -> 3999
    #  en gros 2.5/1000 de perte qd tout le monde joue en meme temps

         
    for i in range(0,10000):
        params              = urllib.urlencode({})
        headers             = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
        conn                = httplib.HTTPConnection("192.168.0.7", 9000)
        conn.request          ("POST", "/incTest", params, headers)
        response            = conn.getresponse()
#       sleep(0.01) 
    
    
    #--------------------------------------------------------------------
 
if __name__ == "__main__":
    main()