import psycopg2
import sys
import json
import utils
import operator
import math

#--------------------------------------------------------------------
 
def main():
    
    #--------------------------------------------------------------------
    
    conn_string = utils.getDBConfig()
    conn = psycopg2.connect(conn_string)
    database = conn.cursor()

    #--------------------------------------------------------------------

    lotteryUID  = raw_input("lotteryUID ? \n> ")
    
    #--------------------------------------------------------------------

    print "\nFetching lottery..."
    
    database.execute("SELECT * FROM lottery where uid='"+lotteryUID+"'")
    lottery         = database.fetchone()
    winningNumbers  = json.loads(lottery[9])
    winningTickets  = []
    nbRang1         = 0
    nbRang2         = 0
    nbRang3         = 0
    nbRang4         = 0
    
    #--------------------------------------------------------------------

    print "Fetching tickets...\n"
  
    database.execute("SELECT * FROM lottery_ticket where lottery_uid='"+lotteryUID+"' ORDER BY uid DESC")
    tickets = database.fetchall()
      
    
    #--------------------------------------------------------------------

    date        = utils.toReadableDate(lottery[1])
    nbPlayers   = lottery[4]
    minPrice    = lottery[5]
    maxPrice    = lottery[6]
    CPM         = lottery[7]
    price       = round(len(tickets)/1000*CPM, 2)
      
    print date + " Lottery"
    print ""
    print "Winning numbers    : "          , winningNumbers
    print "Players            : "          , nbPlayers
    print "Tickets            : "          , len(tickets)
    print "CPM                : "          , CPM
    print "Price              : "          , price
      
    #--------------------------------------------------------------------

    print "\nAnalysing tickets..."

    for t in range(0, len(tickets)):
        ticket = tickets[t]
        
        #ticket[1] is column lottery_ticket.numbers 
        numbers = json.loads(ticket[1])
        nbWinning = 0
        additional = 0
        
        for i in range(0,len(numbers) - 1):
            for j in range(0,len(winningNumbers) - 1):
                if numbers[i] == winningNumbers[j] :
                    nbWinning = nbWinning + 1
                    
        if numbers[len(numbers)-1] == winningNumbers[len(numbers)-1] :
            additional = 1
        
        if (isWinningTicket(nbWinning, additional, winningNumbers)) :
            
            winningTicket = WinningTicket(ticket[0], ticket[4], nbWinning, additional, numbers)
            
            if isRang1(nbWinning,additional,winningNumbers) :
                winningTicket.rang = 1
                nbRang1 = nbRang1 + 1
                winningTickets.append(winningTicket)
    
            elif isRang2(nbWinning,additional,winningNumbers) :
                winningTicket.rang = 2
                nbRang2 = nbRang2 + 1
                winningTickets.append(winningTicket)
                
            elif isRang3(nbWinning,additional,winningNumbers) :
                winningTicket.rang = 3
                nbRang3 = nbRang3 + 1
                winningTickets.append(winningTicket)

            elif isRang4(nbWinning,additional,winningNumbers) :
                winningTicket.rang = 4
                nbRang4 = nbRang4 + 1
                winningTickets.append(winningTicket)
                
        utils.printPercentage(t, len(tickets))
     
    #--------------------------------------------------------------------

    winningTickets = sorted(winningTickets, key=operator.attrgetter('rang'))

    #--------------------------------------------------------------------

    print("\nNb Winners :" + str(len(winningTickets)))
    prices = []
    toPay = 0
    
    if nbRang1 > 0:
        share =  round((0.50 * price)/nbRang1, 2)
        prices.append(share)
        toPay = toPay + share
    else:
        prices.append(0) 

    if nbRang2 > 0:
        share =  round((0.20 * price)/nbRang2, 2)
        prices.append(share)
        toPay = toPay + share
    else:
        prices.append(0) 
    
    if nbRang3 > 0:
        share =  round((0.10 * price)/nbRang3, 2)
        prices.append(share)
        toPay = toPay + share
    else:
        prices.append(0) 
    
    if nbRang4 > 0:
        share =  round((0.05 * price)/nbRang4, 2)
        prices.append(share)
        toPay = toPay + share
    else:
        prices.append(0) 

    print("To pay :" , toPay)
    print("Nb Rang 1 :" + str(nbRang1), " price: " , prices[0])
    print("Nb Rang 2 :" + str(nbRang2), " price: " , prices[1])
    print("Nb Rang 3 :" + str(nbRang3), " price: " , prices[2])
    print("Nb Rang 4 :" + str(nbRang4), " price: " , prices[3])

    #---------------------------------

    requireRecord = raw_input("Record data ? (y/N) \n>") == 'y'
       
    if requireRecord:
        recordToDB(database, winningTickets, prices)
        
    #--------------------------------------------------------------------
    
    conn.commit()

    #--------------------------------------------------------------------
    
    conn.close()
    database.close()
        
#----------------------------------------------------------------------------------

def recordToDB(database, winningTickets, prices):
    print("Recording prizes in DB")
    
    for ticket in winningTickets :
        getWinnerData(database, ticket)
        price = prices[ticket.rang-1]
        playerUID = ticket.player[0]
        
        print "Name : ", ticket.player[2], "numbers:", ticket.numbers, "rang:", ticket.rang,"price :", price
        
        database.execute("UPDATE lottery_ticket SET price='"+str(prices[ticket.rang-1])+"' WHERE uid='"+ticket.uid+"';") 
    
        
#----------------------------------------------------------------------------------

def getWinnerData(database, ticket):
    database.execute("SELECT * FROM player where uid='"+ticket.playerUID+"'")
    player = database.fetchone()
    ticket.addPlayer(player)
        
#----------------------------------------------------------------------------------

def isWinningTicket(nbWinning, additional, winningNumbers):
    return isRang1(nbWinning,additional,winningNumbers) or isRang2(nbWinning,additional,winningNumbers) or isRang3(nbWinning,additional,winningNumbers) or isRang4(nbWinning,additional,winningNumbers)
    
def isRang1(nbWinning, additional, winningNumbers):
    return nbWinning == len(winningNumbers)-1 and additional == 1

def isRang2(nbWinning, additional, winningNumbers):
    return nbWinning == len(winningNumbers)-1 and additional == 0

def isRang3(nbWinning, additional, winningNumbers):
    return nbWinning == len(winningNumbers)-2 and additional == 1

def isRang4(nbWinning, additional, winningNumbers):
    return nbWinning == len(winningNumbers)-2 and additional == 0
            
#----------------------------------------------------------------------------------
             
class WinningTicket:
    def __init__(self, uid, playerUID, nbWinning, additional, numbers):
        self.uid = uid
        self.playerUID = playerUID
        self.nbWinning = nbWinning
        self.additional = additional
        self.numbers = numbers
        
    def addPlayer(self, player):
        self.player = player
            
#----------------------------------------------------------------------------------

if __name__ == "__main__":
    main()