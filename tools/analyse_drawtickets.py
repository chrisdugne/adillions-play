import psycopg2
import sys
import json
 
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

    cursor.execute("SELECT pg_size_pretty(pg_database_size('adillions'));")
    size            = cursor.fetchone()
    print "database size : " , size

    #--------------------------------------------------------------------

    cursor.execute("SELECT * FROM draw where uid='141799ffbccc36e1178'")
    draw            = cursor.fetchone()
    winningNumbers  = json.loads(draw[6])

    #--------------------------------------------------------------------

    cursor.execute("SELECT * FROM draw_ticket")
    tickets = cursor.fetchall()
    i = 0

    for ticket in tickets:
        i = i+1
        #ticket[1] is column draw_ticket.numbers 
        numbers = json.loads(ticket[1])
        nbWinning = 0
        additional = 0
        
        for k1, n in numbers.iteritems():
            for k2, w in winningNumbers.iteritems():
                if n == w :
                    if k1 == '6' :
                        additional = 1
                    else :
                        nbWinning = nbWinning + 1
            
        
        if nbWinning >= 4 :
            print "ticket " ,ticket[0], nbWinning, additional
 
        
        if i % 10000 == 0 :
            print i
            
if __name__ == "__main__":
    main()