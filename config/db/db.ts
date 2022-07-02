import mySql from 'mysql';
import { DBConfig } from './config';

const con = mySql.createConnection({
    host: DBConfig.host,
    port: DBConfig.port,
    user: DBConfig.user, 
    password: DBConfig.password,
    database: DBConfig.database
})

con.connect((err: any) => {
    if(err) {
        console.log(err)
        return
    }
    
    console.log('Successfully Connected to DB')
});

export default con;