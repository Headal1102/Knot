const express = require('express');
const router = express.Router();
const pool = require('../db'); // 데이터베이스 연결 가져오기
const path = require('path'); // 필요시 사용 가능

// 섹션 조회
router.get('/sections', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(400).json({ error: '세션에 사용자 정보가 없습니다.' });
    }

    const query = 'SELECT id, todoCg AS name FROM todo WHERE userId = ?';
    pool.execute(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: '데이터 조회 중 오류 발생', details: error.message });
        }
        res.json(results);
    });
});

// 섹션 생성
router.post('/addSection', (req, res) => {
    const { todosection } = req.body;
    const userId = req.session.userId;

    if (todosection && userId) {
        const query = 'INSERT INTO todo (todoCg, userId) VALUES (?, ?)';
        pool.execute(query, [todosection, userId], (error, results) => {
            if (error) {
                return res.status(500).json({ error: '데이터 삽입 중 오류 발생', details: error.message });
            }
            res.json({ message: '데이터가 성공적으로 삽입되었습니다.', insertId: results.insertId });
        });
    } else {
        res.status(400).json({ error: '섹션 이름이 제공되지 않았거나 세션에 사용자 정보가 없습니다.' });
    }
});

// 섹션 삭제
router.post('/dropSection', (req, res) => {
    const { todosection } = req.body;
    const userId = req.session.userId;

    if (todosection && userId) {
        const deleteTodosQuery = 'DELETE FROM todo WHERE todoCg = ? AND userId = ?';
        pool.execute(deleteTodosQuery, [todosection, userId], (error, results) => {
            if (error) {
                console.error('데이터 삭제 오류:', error);
                return res.status(500).json({ error: '데이터 삭제 중 오류 발생', details: error.message });
            }
            res.json({ message: '섹션과 관련된 할 일들이 성공적으로 삭제되었습니다.' });
        });
    } else {
        res.status(400).json({ error: '섹션 이름이 제공되지 않았거나 세션에 사용자 정보가 없습니다.' });
    }
});

// 섹션 수정
router.post('/changeSection', (req, res) => {
    const { oldSection, newSection } = req.body;
    const userId = req.session.userId;

    if (oldSection && newSection && userId) {
        const query = 'UPDATE todo SET todoCg = ? WHERE todoCg = ? AND userId = ?';
        pool.execute(query, [newSection, oldSection, userId], (error, results) => {
            if (error) {
                return res.status(500).json({ error: '섹션 이름 변경 중 오류 발생', details: error.message });
            }
            res.json({ message: '데이터가 성공적으로 변경되었습니다.' });
        });
    } else {
        res.status(400).json({ error: '현재 섹션 이름, 새 섹션 이름이 제공되지 않았거나 세션에 사용자 정보가 없습니다.' });
    }
});

// 할일 조회
router.get('/todos', (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(400).json({ error: '세션에 사용자 정보가 없습니다.' });
    }

    const query = 'SELECT id, todoText, todoCheck, todoDate, todoCg FROM todo WHERE userId = ?';
    pool.execute(query, [userId], (error, results) => {
        if (error) {
            return res.status(500).json({ error: '데이터 조회 중 오류 발생', details: error.message });
        }
        res.json(results);
    });
});

// 할 일 추가
router.post('/addTodo', (req, res) => {
    const { todoText, todoCheck, todoDate, todoCg } = req.body;
    const userId = req.session.userId;

    if (!todoText || !userId || !todoCg) {
        return res.status(400).send({ message: '모든 필드를 입력하세요.' });
    }

    const sql = `INSERT INTO todo (todoText, todoCheck, todoDate, userId, todoCg) VALUES (?, ?, ?, ?, ?)`;
    pool.execute(sql, [todoText, todoCheck || 'n', todoDate || null, userId, todoCg], (err, results) => {
        if (err) {
            console.error('데이터 삽입 오류:', err);
            return res.status(500).send({ message: '서버 오류 발생' });
        }
        res.send({ message: '할 일이 성공적으로 추가되었습니다.' });
    });
});

// 할 일 수정
router.post('/editTodo', (req, res) => {
    const { oldTodoText, newTodoText, todoCg } = req.body;
    const userId = req.session.userId;

    if (!oldTodoText || !newTodoText || !userId || !todoCg) {
        return res.status(400).send({ message: '모든 필드를 입력하세요.' });
    }

    const sql = `UPDATE todo SET todoText = ? WHERE todoText = ? AND userId = ? AND todoCg = ?`;
    pool.execute(sql, [newTodoText, oldTodoText, userId, todoCg], (err, results) => {
        if (err) {
            console.error('데이터 수정 오류:', err);
            return res.status(500).send({ message: '서버 오류 발생' });
        }
        res.send({ message: '할 일의 이름이 성공적으로 변경되었습니다.' });
    });
});

// 할 일 삭제
router.post('/deleteTodo', (req, res) => {
    const { todoText, todoCg } = req.body;
    const userId = req.session.userId;

    if (!todoText || !userId || !todoCg) {
        return res.status(400).send({ message: '삭제할 항목에 대한 모든 필드를 입력하세요.' });
    }

    const sql = `DELETE FROM todo WHERE todoText = ? AND userId = ? AND todoCg = ?`;
    pool.execute(sql, [todoText, userId, todoCg], (err, results) => {
        if (err) {
            console.error('데이터 삭제 오류:', err);
            return res.status(500).send({ message: '서버 오류 발생' });
        }
        res.send({ message: '할 일이 성공적으로 삭제되었습니다.' });
    });
});

// 할 일 체크 상태 업데이트
router.post('/toggleTodoCheck', (req, res) => {
    const { todoText, todoCg } = req.body;
    const userId = req.session.userId;

    if (!todoText || !userId || !todoCg) {
        return res.status(400).send({ message: '모든 필드를 입력하세요.' });
    }

    const currentCheckQuery = `SELECT todoCheck FROM todo WHERE todoText = ? AND userId = ? AND todoCg = ?`;
    pool.execute(currentCheckQuery, [todoText, userId, todoCg], (err, rows) => {
        if (err) {
            console.error('데이터 조회 오류:', err);
            return res.status(500).send({ message: '서버 오류 발생' });
        }

        if (rows.length > 0) {
            const currentCheck = rows[0].todoCheck;
            const newCheck = currentCheck === 'n' ? 'y' : 'n';
            const updateQuery = `UPDATE todo SET todoCheck = ? WHERE todoText = ? AND userId = ? AND todoCg = ?`;
            pool.execute(updateQuery, [newCheck, todoText, userId, todoCg], (err, results) => {
                if (err) {
                    console.error('데이터 업데이트 오류:', err);
                    return res.status(500).send({ message: '서버 오류 발생' });
                }
                res.send({ message: `할 일의 체크 상태가 ${newCheck === 'y' ? '완료' : '미완료'}로 변경되었습니다.` });
            });
        } else {
            res.status(404).send({ message: '할 일을 찾을 수 없습니다.' });
        }
    });
});

module.exports = router;