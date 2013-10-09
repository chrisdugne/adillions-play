import psycopg2
import utils

def main():
    
    #--------------------------------------------------------------------

    lotteryUID  = raw_input("lotteryUID ? \n> ")
    cpm         = raw_input("cpm ? \n> ")
    
    #--------------------------------------------------------------------

    conn_string = utils.getDBConfig()
    conn = psycopg2.connect(conn_string)
    database = conn.cursor()

    #--------------------------------------------------------------------

    database.execute("UPDATE lottery SET cpm='"+cpm+"' WHERE uid='"+lotteryUID+"';") 
    print database.statusmessage
    
    #--------------------------------------------------------------------

    conn.commit()

    #--------------------------------------------------------------------
    
    conn.close()
    database.close()
    
    #--------------------------------------------------------------------
 
if __name__ == "__main__":
    main()