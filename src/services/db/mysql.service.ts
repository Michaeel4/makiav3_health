import * as mysql from 'promise-mysql';
import { Pool } from 'promise-mysql';
import { mysqlConfig } from '../../config';

let pool: Pool | undefined;


export async function initMySQL(): Promise<void> {
    pool = await mysql.createPool(mysqlConfig);
}

export function getPool(): Pool {
    if (pool) {
        return pool;
    } else {
        throw 'MYSQL not connected!';
    }
}
