import * as mysql from 'promise-mysql';
import { Pool } from 'promise-mysql';
import { mysqlConfig } from '../../config';

let pool: Pool | undefined;


export async function initMySQL(): Promise<void> {
    pool = await mysql.createPool(mysqlConfig);
    console.log('Connected to mysql.');
}

export function getMySQLQueryFunc(): any {
    if (pool) {
        return pool.query;
    } else {
        throw 'MYSQL not connected!';
    }
}
