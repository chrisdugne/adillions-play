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

    nbLotteries = int(raw_input("Nb lotteries ? \n> "))
    lotteryUIDs = []
    
    for i in range(0, nbLotteries):
        lotteryUIDs.append ( raw_input("lotteryUID ? \n> "))
        
    nbPlayers   = int(raw_input("nbPlayers ? \n> "))
    
    #--------------------------------------------------------------------

    now = utils.now()

    for player in range(0,nbPlayers):
        playerUID       = utils.generateUID()
        username        = "player_" + playerUID
        email           = username + "@test.com"
        firstname       = "player"
        lastname        = playerUID
        birthDate       = "1980-10-10"
        creationDate    = now
        password        = "22e7e9d85b7fe6004f7b9f3aa592ea9ec9ce098682e8192fa83785f1784c768d1d1ac3b8afcae88666f66aec24739ac133e9d4adc7506f1a5f1f6078cb27c674"
        secret          = hashlib.sha512( str(creationDate) + password ).hexdigest()

        cursor.execute("INSERT INTO player (uid, user_name, email, first_name, last_name, birth_date, referrer_id, gift_to_referrer, current_points, idle_points, total_points, available_tickets, secret, creation_date) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
                       (playerUID, username, email, firstname, lastname, birthDate, "", False, 0, 0, 0, 10, secret, creationDate))
    
        #--------------------------------------------------------------------
        # 5 sur 49 : 1 906 884     * 6 = 11 441 304      * 8 = 15 255 072
        # 4 sur 49 :   211 876     * 6 =  1 271 256      * 8 =  1 695 008
        
        for i in range(0,15):
            uid = utils.generateUID()
            numbers = []
            
            for n in range(0,5):
                numbers.append( getNum(numbers) )
                
            numbers = sorted(numbers)
            
            numbers.append(random.randint(1,6))
            jsonNums = json.dumps(numbers)
            
            lotteryUID = lotteryUIDs[random.randint(1,len(lotteryUIDs))-1]
            
            cursor.execute("INSERT INTO lottery_ticket (uid, numbers, lottery_uid, player_uid) VALUES (%s, %s, %s, %s)", (uid, jsonNums, lotteryUID, playerUID))
        
    
            utils.printPercentage(player, nbPlayers)  
    
    #--------------------------------------------------------------------

    conn.commit()

    #--------------------------------------------------------------------
    
    conn.close()
    cursor.close()
    
    #--------------------------------------------------------------------

    print "\nInserted !"
 
if __name__ == "__main__":
    main()