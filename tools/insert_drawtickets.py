import psycopg2
import sys
import json
import utils
import random
import hashlib
def getNum(numsChosen):
    num = random.randint(1,49)
    alreadyChosen = False
    
    for n in numsChosen:
        if(num == n):
            alreadyChosen = True
            break
        
    if not alreadyChosen :
        return num
    else : 
        return getNum(numsChosen)
        
    
def main():
    
    #--------------------------------------------------------------------
    #Define our connection string
    conn_string = "host='localhost' dbname='adillions' user='mad'"
 
    # print the connection string we will use to connect
    print "Connecting to database\n    ->%s" % (conn_string)
    # get a connection, if a connect cannot be made an exception will be raised here
    conn = psycopg2.connect(conn_string)
 
    # conn.cursor will return a cursor object, you can use this cursor to perform queries
    cursor = conn.cursor()
    print "Connected!\n"

    now = utils.now()
    print "now " , now

    for player in range(1,100000):
        playerUID       = utils.generateUID()
        username        = "player" + str(player)
        email           = username + "@test.com"
        firstname       = "player"
        lastname        = player
        birthDate       = "1980-10-10"
        creationDate    = now
        password        = "22e7e9d85b7fe6004f7b9f3aa592ea9ec9ce098682e8192fa83785f1784c768d1d1ac3b8afcae88666f66aec24739ac133e9d4adc7506f1a5f1f6078cb27c674"
        secret          = hashlib.sha512( str(creationDate) + password ).hexdigest()

        cursor.execute("INSERT INTO player (uid, user_name, email, first_name, last_name, birth_date, referrer_id, current_points, idle_points, total_points, secret, creation_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
                       (playerUID, username, email, firstname, lastname, birthDate, "", 0, 0, 0, secret, creationDate))
    
        #--------------------------------------------------------------------
        # 5 sur 49 : 1 906 884     * 6 = 11 441 304      * 8 = 15 255 072
        # 4 sur 49 :   211 876     * 6 =  1 271 256      * 8 =  1 695 008
        
        for i in range(1,10):
            uid = utils.generateUID()
            numbers = []
            
            for n in range(0,5):
                numbers.append( getNum(numbers) )
                
            numbers = sorted(numbers)
            jsonNums = {}
            
            for n in range(0,5):
                jsonNums[n+1] = numbers[n]
            
            jsonNums[6] = ("%x" % (random.randint(1,6) + 9)).upper()
            jsonNums = json.dumps(jsonNums)
            
            cursor.execute("INSERT INTO draw_ticket (uid, numbers, draw_uid, player_uid) VALUES (%s, %s, %s, %s)", (uid, jsonNums, "141799ffbccc36e1178", playerUID))
        
    
        if player % 1000 == 0 :
            print "player : " , player
    
    #--------------------------------------------------------------------

    conn.commit()

    #--------------------------------------------------------------------
    
    conn.close()
    cursor.close()
    
    #--------------------------------------------------------------------

    print "Inserted !\n"
 
if __name__ == "__main__":
    main()