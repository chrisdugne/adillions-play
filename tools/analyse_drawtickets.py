import psycopg2
import sys
import json
 
def main():
    
    #--------------------------------------------------------------------
    #Define our connection string
    conn_string = "host='localhost' dbname='adillions' user='mad'"
 
    # get a connection, if a connect cannot be made an exception will be raised here
    conn = psycopg2.connect(conn_string)
 
    # conn.cursor will return a cursor object, you can use this cursor to perform queries
    cursor = conn.cursor()

    #--------------------------------------------------------------------

    cursor.execute("SELECT * FROM draw where uid='141799ffbccc36e1178'")
    draw            = cursor.fetchone()
    winningNumbers  = json.loads(draw[6])
    winningTickets  = {}
    
    print "Result: ",  winningNumbers
    
    #--------------------------------------------------------------------

    cursor.execute("SELECT * FROM draw_ticket")
    tickets = cursor.fetchall()
    print len(tickets), " tickets"

    #--------------------------------------------------------------------

    for ticket in tickets:
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
        
        if nbWinning == len(winningNumbers)-1 and additional == 1:
            print "rang 1 " , ticket[0], nbWinning, additional, numbers

        elif nbWinning == len(winningNumbers)-1 and additional == 0:
            print "rang 2 " , ticket[0], nbWinning, additional, numbers
            
        elif nbWinning == len(winningNumbers) - 2  and additional == 1 :
            print "rang3 " , ticket[0], nbWinning, additional, numbers
            
if __name__ == "__main__":
    main()