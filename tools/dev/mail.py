import utils
import smtplib
import psycopg2
import codecs

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
 
import requests

def main():

    #--------------------------------------------------------------------

#   url         = "http://www.uralys.com/adillions/newsletters/newsletter1"
    url         = "http://media.wow-europe.com/email/2013/sc2/hots/live_stream/en/index_en-gb.html"
    
    #--------------------------------------------------------------------
    
    r = requests.get(url)
    html =  r.text.encode('ascii', 'ignore')

    #--------------------------------------------------------------------

    subject     = "Tirage du jour bonjour"
    me          = "noreply@adillions.com"
        
    #--------------------------------------------------------------------
    print("init smtplib")    
    
    # Send the message via local SMTP server.
    server = smtplib.SMTP('mail.gandi.net:587')
    server.login(me, "snoiDILLA2013")
    server.ehlo()
    server.starttls()

    #--------------------------------------------------------------------
    
    print("database connection")    
    conn_string             = utils.getDBConfig()
    conn                    = psycopg2.connect(conn_string)
    database                = conn.cursor()

    #--------------------------------------------------------------------
    
    database.execute("select * from player where accept_emails = true")
    players = database.fetchall()
    
    #--------------------------------------------------------------------
    
    for i in range(0, len(players)):
        
        player      = players[i]
        email       = player[4]
        firstname   = player[5]
        
        # Create message container - the correct MIME type is multipart/alternative.
        msg = MIMEText(html, 'html')
        msg['From'] = "Adillions"
        msg['Subject'] = firstname + " - " + subject
        msg['To'] = email
        
        server.sendmail(me, email, msg.as_string())
        print("email sent to | " + email)     

    #--------------------------------------------------------------------
    
    server.quit()
    print("emails sent")     
 
if __name__ == "__main__":
    main()