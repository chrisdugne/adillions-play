import psycopg2
import sys
import json
import utils
import operator
import math

#--------------------------------------------------------------------
 
def main():
    
    #--------------------------------------------------------------------
    
    conn_string     = utils.getDBConfig()
    conn            = psycopg2.connect(conn_string)
    database        = conn.cursor()

    #--------------------------------------------------------------------

    lotteryUID  = raw_input("lotteryUID ? \n> ")
    
    #--------------------------------------------------------------------

    print "\nFetching lottery..."
    
    database.execute("SELECT * FROM lottery where uid='"+lotteryUID+"'")
    lottery         = database.fetchone()

    if(not lottery):
        print "Check the lotteryUID"
        return
    
    #--------------------------------------------------------------------
    
    winningNumbers  = [2,21,22,38,48,1]
    winningTickets  = []
    rangs           = []
    bonusRangs      = []
     
    rangs.append(Rang(1, 0, 0, 0.40))
    rangs.append(Rang(2, 0, 0, 0.20))
    rangs.append(Rang(3, 0, 0, 0.15))
    rangs.append(Rang(4, 0, 0, 0.10))
    rangs.append(Rang(5, 0, 0, 0.05))
    rangs.append(Rang(6, 0, 0, 0.10))

    bonusRangs.append(BonusRang(7,  0, 2, 0,))
    bonusRangs.append(BonusRang(8,  0, 1, 0,))
    bonusRangs.append(BonusRang(9,  0, 0, 2,))
    bonusRangs.append(BonusRang(10, 0, 0, 1,))

    #--------------------------------------------------------------------

#     print "Counting tickets...\n"
#    
#     database.execute("SELECT count(*) FROM lottery_ticket where lottery_uid='"+lotteryUID+"'")
#     nbtickets = int(database.fetchone()[0])
#     print str(nbtickets) + " tickets\n"
#     return

#     print "Counting players...\n"
#     
#     database.execute("SELECT count(DISTINCT player_uid) FROM lottery_ticket where lottery_uid='"+lotteryUID+"'")
#     nbplayers = int(database.fetchone()[0])
#     print str(nbplayers) + " players\n"
#     return

    #--------------------------------------------------------------------

    print "Fetching tickets...\n"
  
    database.execute("SELECT * FROM lottery_ticket where lottery_uid='"+lotteryUID+"' ORDER BY uid DESC")
    tickets = database.fetchall()
      
    
    #--------------------------------------------------------------------

    date        = utils.toReadableDate(lottery[1])
    nbPlayers   = lottery[4]
    minPrice    = lottery[6]
    maxPrice    = lottery[7]
    CPM         = lottery[8]
    charity     = lottery[9]
    price       = min(maxPrice, max(minPrice, round(float(len(tickets))/1000*CPM, 1)))
    nbTickets   = len(tickets)
      
    print date + " Lottery"
    print ""
    print "Winning numbers    : "          , winningNumbers
    print "Players            : "          , nbPlayers
    print "Tickets            : "          , nbTickets
    print "CPM                : "          , CPM
    print "charity            : "          , charity
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
        
        if (isWinningTicket(nbWinning, additional)) :
            
            winningTicket = WinningTicket(ticket[0], ticket[4], nbWinning, additional, numbers)
            winningTicket.lotteryUID = lotteryUID
            
            if isRang1(nbWinning,additional) :
                winningTicket.rang = 1
                rangs[0].winners = rangs[0].winners + 1
                winningTickets.append(winningTicket)
    
            elif isRang2(nbWinning,additional) :
                winningTicket.rang = 2
                rangs[1].winners = rangs[1].winners + 1
                winningTickets.append(winningTicket)
                
            elif isRang3(nbWinning,additional) :
                winningTicket.rang = 3
                rangs[2].winners = rangs[2].winners + 1
                winningTickets.append(winningTicket)

            elif isRang4(nbWinning,additional) :
                winningTicket.rang = 4
                rangs[3].winners = rangs[3].winners + 1
                winningTickets.append(winningTicket)

            elif isRang5(nbWinning,additional) :
                winningTicket.rang = 5
                rangs[4].winners = rangs[4].winners + 1
                winningTickets.append(winningTicket)

            elif isRang6(nbWinning,additional) :
                winningTicket.rang = 6
                rangs[5].winners = rangs[5].winners + 1
                winningTickets.append(winningTicket)
                
            #-------------------------
            # Bonus 
            
            elif isRang7(nbWinning,additional) :
                winningTicket.rang = 7
                bonusRangs[0].winners = bonusRangs[0].winners + 1
                winningTickets.append(winningTicket)
            
            elif isRang8(nbWinning,additional) :
                winningTicket.rang = 8
                bonusRangs[1].winners = bonusRangs[1].winners + 1
                winningTickets.append(winningTicket)
            
            elif isRang9(nbWinning,additional) :
                winningTicket.rang = 9
                bonusRangs[2].winners = bonusRangs[2].winners + 1
                winningTickets.append(winningTicket)
            
            elif isRang10(nbWinning,additional) :
                winningTicket.rang = 10
                bonusRangs[3].winners = bonusRangs[3].winners + 1
                winningTickets.append(winningTicket)
         
        ## loading bar       
        utils.printPercentage(t, len(tickets))
     
    #--------------------------------------------------------------------
    
    winningTickets = sorted(winningTickets, key=operator.attrgetter('rang'))
    
    #--------------------------------------------------------------------

    print("\nNb Winners :" + str(len(winningTickets)))
    toShare = 0
    
    for i in range(0,len(rangs)):
        if rangs[i].winners > 0:
            rangs[i].share =  round((rangs[i].percentage * price)/rangs[i].winners, 1)
            toShare = toShare + rangs[i].percentage * price
        else:
            rangs[i].share = 0 
    
    #---------------------------------
    
    toShare = round(toShare, 1)
    print("To share :" , toShare)
    toPay = 0
    
    for i in range(0, len(rangs)):
        toPay = toPay + rangs[i].share * rangs[i].winners
        print("Winners Rang "+str(i+1)+ " :   " + str(rangs[i].winners), "   | share : " , str(rangs[i].share))

    toPay = round(toPay, 1)
    print("To pay :" , toPay)
    print("Nobody :" , round(toShare - toPay, 1))
    print("---------")
    print("Bonus :")
    for i in range(0, len(bonusRangs)):
        print("Winners Rang "+str(i+7)+ " :   " + str(bonusRangs[i].winners))
    
    #---------------------------------

    requireRecord = raw_input("Record data ? (y/N) \n>") == 'y'
       
    recordToDB(database, lotteryUID, winningTickets, rangs, bonusRangs, toPay, not requireRecord)
        
    #--------------------------------------------------------------------
    
    conn.commit()

    #--------------------------------------------------------------------
    
    conn.close()
    database.close()
        
#----------------------------------------------------------------------------------

def recordToDB(database, lotteryUID, winningTickets, rangs, bonusRangs, finalPrice, dryRun):
    print("Recording prizes in DB")
    
    #--------------------------------------------------------
    
    print (len(winningTickets), " winning tickets") 

    for ticket in winningTickets :
        getWinnerData(database, ticket)
        playerUID = ticket.player[0]

        #--------------------------------------------------
        
        if(ticket.rang < 7) :
            price = rangs[ticket.rang-1]
            
            print "Name : ", ticket.player[4], "email : ", ticket.player[2], "  numbers:", ticket.numbers, "  rang:", ticket.rang, "  share :", rangs[ticket.rang-1].share, "  nbTickets : " , ticket.nbTicketsPlayed 
            
            if(not dryRun) :
                database.execute("UPDATE lottery_ticket SET price='"+str(rangs[ticket.rang-1].share)+"', status='1' WHERE uid='"+ticket.uid+"';")
                
        #--------------------------------------------------
        
        else :
            print ("todo rang ", ticket.rang) 
    
    #--------------------------------------------------------

    pricesJSON = "["
    
    for rang in rangs :
        pricesJSON = pricesJSON + "{\"num\":\"" + str(rang.num) + "\", \"winners\":\"" + str(rang.winners) + "\", \"share\":\"" + str(rang.share) + "\"}," 
        
    pricesJSON = pricesJSON[:-1]
    pricesJSON = pricesJSON + "]"

    #--------------------------------------------------------
    
    if(not dryRun) :
        database.execute("UPDATE lottery SET final_price='"+str(finalPrice)+"', prizes='"+pricesJSON+"' WHERE uid='"+lotteryUID+"';") 
    
        
#----------------------------------------------------------------------------------

def getWinnerData(database, ticket):
    
    database.execute("SELECT * FROM player where uid='"+ticket.playerUID+"'")
    player = database.fetchone()
    ticket.addPlayer(player)

    database.execute("select count(*) from lottery_ticket where player_uid = '"+ticket.playerUID+"' and lottery_uid='"+ticket.lotteryUID+"'")
    ticket.nbTicketsPlayed = int(database.fetchone()[0])

        
#----------------------------------------------------------------------------------

def isWinningTicket(nbWinning, additional):
    return isRang1(nbWinning,additional) \
    or isRang2(nbWinning,additional)  \
    or isRang3(nbWinning,additional)  \
    or isRang4(nbWinning,additional)  \
    or isRang5(nbWinning,additional)  \
    or isRang6(nbWinning,additional)  \
    or isRang7(nbWinning,additional)  \
    or isRang8(nbWinning,additional)  \
    or isRang9(nbWinning,additional)  \
    or isRang10(nbWinning,additional)
    
def isRang1(nbWinning, additional):
    return nbWinning == 5 and additional == 1

def isRang2(nbWinning, additional):
    return nbWinning == 5 and additional == 0

def isRang3(nbWinning, additional):
    return nbWinning == 4 and additional == 1

def isRang4(nbWinning, additional):
    return nbWinning == 4 and additional == 0
            
def isRang5(nbWinning, additional):
    return nbWinning == 3 and additional == 1
            
def isRang6(nbWinning, additional):
    return nbWinning == 3 and additional == 0

def isRang7(nbWinning, additional):
    return nbWinning == 2 and additional == 1

def isRang8(nbWinning, additional):
    return nbWinning == 2 and additional == 0

def isRang9(nbWinning, additional):
    return nbWinning == 1 and additional == 1

def isRang10(nbWinning, additional):
    return nbWinning == 0 and additional == 1
            
#----------------------------------------------------------------------------------
             
class WinningTicket:
    def __init__(self, uid, playerUID, nbWinning, additional, numbers):
        self.uid = uid
        self.playerUID      = playerUID
        self.nbWinning      = nbWinning
        self.additional     = additional
        self.numbers        = numbers
        
    def addPlayer(self, player):
        self.player = player

#----------------------------------------------------------------------------------
             
class Rang:
    def __init__(self, num, winners, share, percentage):
        self.num            = num
        self.winners        = winners
        self.share          = share
        self.percentage     = percentage
             
class BonusRang:
    def __init__(self, num, winners, nbBonus, nbInstant):
        self.num            = num
        self.winners        = winners
        self.nbBonus        = nbBonus
        self.nbInstant      = nbInstant
            
#----------------------------------------------------------------------------------

if __name__ == "__main__":
    main()