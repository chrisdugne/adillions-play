package utils;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DecimalFormat;
import java.util.Date;
import java.util.regex.Pattern;

public class Utils {

    //======================================================================================//
    
    /*
     * wait fornbSecs seconds
     * sleep(3) = wait 3 secs
     */
    public static void sleep(long nbSecs){
        try {
            Thread.sleep(nbSecs * 1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public static void sleepMillis(long nbMillis){
        try {
            Thread.sleep(nbMillis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
    

    //======================================================================================//

    /**
     * 
     * @param s the string to truncate
     * @return the same string without its last char
     * 
     * exemple :
     * 
     * 1,2,3,4,  ====> 1,2,3,4
     */
    public static String withoutLastChar(String s){
        return s.substring(0, s.length()-1);
    }


    //======================================================================================//
    
    /**
     * PwGen.java 
     * A simple random password generator, user can specify the length.
     * Default length is 8, the common unix system effective password length.
     */
    public static String generatePassword() {
        return generatePassword(8);
    }

    public static String generatePassword(int n) {
        char[] pw = new char[n];
        int c = 'A';
        int r1 = 0;
        for(int i=0; i < n; i++)
        {
            r1 = (int)(Math.random() * 3);
            switch(r1) {
            case 0: c = '0' +  (int)(Math.random() * 10); break;
            case 1: c = 'a' +  (int)(Math.random() * 26); break;
            case 2: c = 'A' +  (int)(Math.random() * 26); break;
            }
            pw[i] = (char)c;
        }
        return new String(pw);
    }
    
    public static String generateSponsorCode() {
        
        char[] code = new char[6];
        
        for(int i=0; i < 5; i++)
            code[i] = (char)('A' +  (int)(Math.random() * 26));
        
        code[5] = (char)('0' +  (int)(Math.random() * 10));

        return new String(code);
    }


    //======================================================================================//
    
    /**
     ensure a higher level of security in the storage of database
    (the security of passwords in soap envelop is still to be ensured...)

    seed technic to hash passwords :
    prefix_salt = 3 first characters of the login            
    suffix_salt = 3 last characters of the login
    password encrypted = "prefix_salt + password_chosen + suffix_salt"

    then just apply the SHA1 on the password salted
     */
    public static String saltPassword(String password, String salt) {
        String saltedPassword = salt.substring(0,3) + password + salt.substring(salt.length()-3,salt.length());

        return new String(saltedPassword);
    }


    //=====================================================================================================================//

    private static String convertToHex(byte[] data) {
        StringBuffer buf = new StringBuffer();
        for(int i = 0; i < data.length; i++) {
            int halfbyte = (data[i] >>> 4) & 0x0F;
            int two_halfs = 0;
            do {
                if ((0 <= halfbyte) && (halfbyte <= 9))
                    buf.append((char) ('0' + halfbyte));
                else
                    buf.append((char) ('a' + (halfbyte - 10)));
                halfbyte = data[i] & 0x0F;
            } while(two_halfs++ < 1);
        }
        return buf.toString();
    }
    
    public static String SHA512(String text)  {
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("SHA-512");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        byte[] sha1hash = new byte[40];
        try {
            md.update(text.getBytes("iso-8859-1"), 0, text.length());
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        }
        sha1hash = md.digest();
        return convertToHex(sha1hash);
    }

    //======================================================================================//

    public static String toUpperCaseFirstLetter(String string) {
        return string.substring(0,1).toUpperCase() + string.substring(1);
    }
    
    public static int nbMinutesSpentSince(Long time) {
        return (int)((double)(new Date().getTime()-time)/(1000*60));
    }
    
    //======================================================================================//
    
    
    // return 1-i ||0
    public static int random(int i)
    {
        if(i == 0)
            return 0;
            
        int rand = (int) Math.round(Math.random()*i);
        if(rand > 0)
            return rand;
        else
            return random(i);
    }
    
    //return 0-(i-1)
    public static int randomList(int i)
    {
        return (int) Math.round(Math.random()*(i-1));
    }

    //======================================================================================//
    
    public static double roundTwoDecimals(double d) {
        DecimalFormat twoDForm = new DecimalFormat("#.##");
        return Double.valueOf(twoDForm.format(d).replace(',', '.'));
    }

    public static double roundOneDecimals(double d) {
        DecimalFormat oneDForm = new DecimalFormat("#.#");
        return Double.valueOf(oneDForm.format(d).replace(',', '.'));
    }

    //======================================================================================//
    
    /** Function to check File path (Pattern accepted a to z, A to Z, 0 to 9 and _ )
     *  Return true if file path is valid otherwise return false 
     */  
    public static boolean checkLogin( String login ) {
        try {
            return Pattern.matches( "[a-zA-Z0-9_.\\-]*", login );
        } catch ( Exception e ) {
            return false;
        }
    }

    public static boolean checkEmail(String email) {
        try {
            return Pattern.matches("^[a-z][\\w.-]+@\\w[\\w.-]+\\.[\\w.-]*[a-z][a-z]$", email );
        } catch ( Exception e ) {
            return false;
        }
    }

    //======================================================================================//

    public static String generateUID()
    {
        String timestamp = Long.toHexString(System.currentTimeMillis());
        Double d = Math.random() * Math.pow(2, 32);
        String random = Long.toHexString(d.longValue()); 
        
        return timestamp + random;
    }
    
    //======================================================================================//
    /*
     * function isEuroCountry (country) 

    local isEuro = country == "AT"
    || country == "BE"
    || country == "CY"
    || country == "EE"
    || country == "FI"
    || country == "FR"
    || country == "DE"
    || country == "GR"
    || country == "IE"
    || country == "IT"
    || country == "LU"
    || country == "MT"
    || country == "NL"
    || country == "PT"
    || country == "SK"
    || country == "SI"
    || country == "ES"
    || country == "BG"
    || country == "HR"
    || country == "CZ"
    || country == "DK"
    || country == "HU"
    || country == "LV"
    || country == "LT"
    || country == "PL"
    || country == "RO"
    || country == "SE"
    || country == "GB"
    || country == "IS"
    || country == "LI"
    || country == "NO"
    || country == "CH"
    || country == "MC"
    || country == "AL"
    || country == "MK"
    || country == "ME"
    || country == "RS"
    || country == "BA"

    return isEuro;
end


     */
    public static Boolean isEuroCountry(String country)
    {
        return country.equals("AT")
                || country.equals("BE")
                || country.equals("CY")
                || country.equals("EE")
                || country.equals("FI")
                || country.equals("FR")
                || country.equals("DE")
                || country.equals("GR")
                || country.equals("IE")
                || country.equals("IT")
                || country.equals("LU")
                || country.equals("MT")
                || country.equals("NL")
                || country.equals("PT")
                || country.equals("SK")
                || country.equals("SI")
                || country.equals("ES")
                || country.equals("BG")
                || country.equals("HR")
                || country.equals("CZ")
                || country.equals("DK")
                || country.equals("HU")
                || country.equals("LV")
                || country.equals("LT")
                || country.equals("PL")
                || country.equals("RO")
                || country.equals("SE")
                || country.equals("GB")
                || country.equals("IS")
                || country.equals("LI")
                || country.equals("NO")
                || country.equals("CH")
                || country.equals("MC")
                || country.equals("AL")
                || country.equals("MK")
                || country.equals("ME")
                || country.equals("RS")
                || country.equals("BA");
    }
    
    public static Double countryPrice(Double euros, String country, Double rateUSDtoEUR)
    {
        if(euros == null)
            euros = 0d;

        if(isEuroCountry(country))
            return euros;
        
        else
            return Utils.roundTwoDecimals(euros*rateUSDtoEUR);
    }

}
