import psycopg2
import utils
from time import sleep


def main():
    
    #--------------------------------------------------------------------

    conn_string = utils.getDBConfig()
    conn = psycopg2.connect(conn_string)
    database = conn.cursor()

    #--------------------------------------------------------------------
    
    for i in range(0,100000):
        database.execute("UPDATE lottery SET nb_players=nb_players+1 WHERE uid='14199549d6466fd28b6';")
        conn.commit()
        sleep(0.0001) 
    
    #--------------------------------------------------------------------


    #--------------------------------------------------------------------
    
    conn.close()
    database.close()
    
    #--------------------------------------------------------------------
 
if __name__ == "__main__":
    main()