const mysql = require('mysql2');

// 데이터베이스 연결 풀 생성
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'Knot',
    port: 3308,
    waitForConnections: true,
    connectionLimit: 10,    // 최대 연결 개수 설정
    queueLimit: 0
});

module.exports = pool;