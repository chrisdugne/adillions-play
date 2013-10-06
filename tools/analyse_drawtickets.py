import psycopg2
import sys
import json
import utils
import operator
import math

#--------------------------------------------------------------------
 
def main():
    
    #--------------------------------------------------------------------
    
    conn_string = "host='localhost' dbname='adillions' user='mad'"
    conn = psycopg2.connect(conn_string)
    database = conn.cursor()

    #--------------------------------------------------------------------
    
    drawUID = "1418dee0d8da5ccb450"
    
    #--------------------------------------------------------------------

    print "Fetching result..."
    
    database.execute("SELECT * FROM draw where uid='"+drawUID+"'")
    draw            = database.fetchone()
    winningNumbers  = json.loads(draw[8])
    winningTickets  = []
    nbRang1         = 0
    nbRang2         = 0
    nbRang3         = 0
    nbRang4         = 0
    
    print "Result    : ",  winningNumbers
    
    #--------------------------------------------------------------------

    nbPlayers   = draw[4]
    ratio       = draw[6]
    cagnotte    = round(nbPlayers/ratio, 2)
      
    print "Players   : "          , nbPlayers
    print "Ratio     : "          , ratio
    print "Cagnotte  : "          , cagnotte
     
    #--------------------------------------------------------------------

    print "Fetching tickets..."
  
    database.execute("SELECT * FROM draw_ticket where draw_uid='"+drawUID+"' ORDER BY uid DESC")
    tickets = database.fetchall()
      
    print len(tickets), " tickets"

    #--------------------------------------------------------------------

    print "Analysing tickets..."

    for t in range(0, len(tickets)):
        ticket = tickets[t]
        
        #ticket[1] is column draw_ticket.numbers 
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
            
            winningTicket = WinningTicket(ticket[0], ticket[3], nbWinning, additional, numbers)
            
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

    print("")
    print("Nb Winners :" + str(len(winningTickets)))
    prices = []
    toPay = 0
    
    if nbRang1 > 0:
        prices.append((0.50 * cagnotte)/nbRang1)
        toPay = toPay + 0.50 * cagnotte
    else:
        prices.append(0) 

    if nbRang2 > 0:
        prices.append((0.20 * cagnotte)/nbRang2)
        toPay = toPay + 0.20 * cagnotte
    else:
        prices.append(0) 
    
    if nbRang3 > 0:
        prices.append((0.10 * cagnotte)/nbRang3)
        toPay = toPay + 0.10 * cagnotte
    else:
        prices.append(0) 
    
    if nbRang4 > 0:
        prices.append((0.05 * cagnotte)/nbRang4) 
        toPay = toPay + 0.05 * cagnotte
    else:
        prices.append(0) 

    print("To pay :" , toPay)

    print("Nb Rang 1 :" + str(nbRang1), " price: " , prices[0])
    print("Nb Rang 2 :" + str(nbRang2), " price: " , prices[1])
    print("Nb Rang 3 :" + str(nbRang3), " price: " , prices[2])
    print("Nb Rang 4 :" + str(nbRang4), " price: " , prices[3])

    
    for ticket in winningTickets :
        getWinnerData(database, ticket)
        print "Name : ", ticket.player[2], "playerUID:", ticket.player[0], ticket.numbers, "rang:", ticket.rang, "numbers:", "price :", prices[ticket.rang-1]

    #---------------------------------

    requireRecord = raw_input("Record data ? (y/N) \n>") == 'y'
       
    if requireRecord:
        print("recording data do DB...")
        
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