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
    
    numbers = json.dumps({"1":"5","2":"6","3":"7","4":"8","5":"9","6":"B"})
    cursor.execute("INSERT INTO draw_ticket (uid, numbers, draw_uid, player_uid) VALUES (%s, %s, %s, %s)", ("draw3", numbers, "141799ffbccc36e1178", "1417d5dcf5aca576ce8"))
    
    conn.commit()

    #--------------------------------------------------------------------
    
    conn.close()
    cursor.close()
    
    #--------------------------------------------------------------------

 
if __name__ == "__main__":
    main()