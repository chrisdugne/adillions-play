import psycopg2
import sys
import json
import utils
import random
 
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

    #--------------------------------------------------------------------
    
    # 5 sur 49 : 1 906 884 * 6 = 11 441 304
    for i in range(1,10000000):
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
        
        cursor.execute("INSERT INTO draw_ticket (uid, numbers, draw_uid, player_uid) VALUES (%s, %s, %s, %s)", (uid, jsonNums, "141799ffbccc36e1178", "1417d5dcf5aca576ce8"))
    
        if i % 100000 == 1 :
            print i
            
    #--------------------------------------------------------------------

    conn.commit()

    #--------------------------------------------------------------------
    
    conn.close()
    cursor.close()
    
    #--------------------------------------------------------------------

    print "Inserted !\n"
 
if __name__ == "__main__":
    main()