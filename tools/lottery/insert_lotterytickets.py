import psycopg2
import sys
import json
import utils
import random
import hashlib

#--------------------------------------------------------------------

def getNum(numsChosen):
    random.seed()
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
        
#--------------------------------------------------------------------
    
def main():
    
    #--------------------------------------------------------------------

    conn_string = utils.getDBConfig()
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()

    #--------------------------------------------------------------------

    lotteryUID  = raw_input("lotteryUID ? \n> ")
    playerUID   = raw_input("playerUID ? \n> ")
    nbTickets   = int(raw_input("nbTickets ? \n> "))
    
    #--------------------------------------------------------------------

    now = utils.now()

    #--------------------------------------------------------------------
    # 5 sur 49 : 1 906 884     * 6 = 11 441 304      * 8 = 15 255 072
    # 4 sur 49 :   211 876     * 6 =  1 271 256      * 8 =  1 695 008
    
    for i in range(0,nbTickets):
        uid = utils.generateUID()
        numbers = []
        
        for n in range(0,5):
            numbers.append( getNum(numbers) )
            
        numbers = sorted(numbers)
        
        numbers.append(random.randint(1,6))
        jsonNums = json.dumps(numbers)
        
        cursor.execute("INSERT INTO lottery_ticket (uid, numbers, lottery_uid, player_uid) VALUES (%s, %s, %s, %s)", (uid, jsonNums, lotteryUID, playerUID))
    
    #--------------------------------------------------------------------

    conn.commit()

    #--------------------------------------------------------------------
    
    conn.close()
    cursor.close()
    
    #--------------------------------------------------------------------

    print "\nInserted !"
 
if __name__ == "__main__":
    main()