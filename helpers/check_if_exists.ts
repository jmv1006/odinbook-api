import con from "../config/db/db"


export const check_if_user_exists = async (userId: string): any =>  {
    con.query(`SELECT Id FROM Users WHERE Id="${userId}"`, (err, result) => {
        if(result.length > 0) return true
        return false
    })
 
}   