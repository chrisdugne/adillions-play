import psycopg2
import sys
import time
import json
import math
import hashlib

 
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

    cursor.execute("SHOW data_directory;")
    history            = cursor.fetchone()
    print "history: " , history

    cursor.execute("SELECT pg_size_pretty(pg_database_size('adillions'));")
    size            = cursor.fetchone()
    print "database size : " , size

    #--------------------------------------------------------------------

if __name__ == "__main__":
    main()