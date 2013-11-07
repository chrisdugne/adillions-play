import psycopg2
import utils

def main():
    
    #--------------------------------------------------------------------

    conn_string = utils.getDBConfig()
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()
    
    #--------------------------------------------------------------------
    
    lotteryUID    = utils.generateUID()
    maxPicks      = raw_input("Nb to pick ? \n> ")
    maxNumbers    = raw_input("How many numbers ? \n> ")
    cpm           = raw_input("CPM ? \n> ")
    maxPrice      = raw_input("Max price ? \n> ")
    minPrice      = raw_input("Min price ? \n> ")
    date          = raw_input("data ? (yyyy-mm-dd) \n> ")
    
    dateMillis    = utils.toTimestamp(date) + 22 * 60 * 60 * 1000  # 22h00

    if(not maxPicks 
    or not maxPrice    
    or not minPrice    
    or not cpm    
    or not maxNumbers):    
        print "Try again"
        return

    #--------------------------------------------------------------------

    cursor.execute("INSERT INTO lottery (uid, date, max_picks, max_numbers, nb_players, max_price, min_price, cpm, charity, final_price, tool_players, last_update) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)", 
                   (lotteryUID, dateMillis, maxPicks, maxNumbers, 0, maxPrice, minPrice, cpm, 0, 0, 100, "2012-10-18 11:35:21"))

    
    #--------------------------------------------------------------------

    conn.commit()

    #--------------------------------------------------------------------
    
    conn.close()
    cursor.close()
    
    #--------------------------------------------------------------------

    print "\nLottery created: " + lotteryUID
 
if __name__ == "__main__":
    main()