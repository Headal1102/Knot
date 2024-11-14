const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
require('dotenv').config();

// 데이터베이스 연결 설정
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// 데이터베이스 연결 확인
connection.connect((err) => {
  if (err) {
    console.error('데이터베이스 연결 오류:', err);
  } else {
    console.log('데이터베이스 연결 성공');
  }
});

// 섹션 조회
router.post('/sections', (req, res) => {
  const { userId, } = req.body;
  if (!userId) {
    return res.status(400).json({ error: '세션에 사용자 정보가 없습니다.' });
  }

  const query = 'SELECT DISTINCT userId, TodoCg, TodoCgIndex FROM Todo WHERE userId = ?;';
  connection.execute(query, [userId], (err, results) => {
    if (err) {
      console.error('쿼리 실행 오류:', err);
      return res.status(500).send('서버 오류');
    }
    res.json(results);
  });
});

// 섹션 생성
router.post('/addSection', (req, res) => {
  const { todosection, userId } = req.body;

  if (todosection && userId) {
    const query = 'INSERT INTO Todo (TodoCg, userId) VALUES (?, ?)';
    connection.execute(query, [todosection, userId], (error) => {
      if (error) {
        console.error('데이터 삽입 오류:', error);
        return res.status(500).json({ error: '데이터 삽입 중 오류 발생' });
      }
      res.json({ message: '데이터가 성공적으로 삽입되었습니다.', section: { TodoCg: todosection, userId } });
    });
  } else {
    res.status(400).json({ error: '섹션 이름이 제공되지 않았거나 사용자 정보가 없습니다.' });
  }
});

// 섹션 삭제
router.post('/dropSection', (req, res) => {
  const { todosection, userId } = req.body;
  if (todosection && userId) {
    const deleteQuery = 'DELETE FROM Todo WHERE TodoCg = ? AND userId = ?';
    connection.execute(deleteQuery, [todosection, userId], (err) => {
      if (err) {
        console.error('섹션 삭제 오류:', err);
        return res.status(500).json({ error: '섹션 삭제 중 오류 발생' });
      }
      res.json({ message: '섹션과 관련된 할 일들이 성공적으로 삭제되었습니다.' });
    });
  } else {
    res.status(400).json({ error: '섹션 이름이 제공되지 않았거나 사용자 정보가 없습니다.' });
  }
});

// 섹션 수정
router.post('/changeSection', (req, res) => {
  const { oldSection, newSection, userId } = req.body;

  if (!oldSection || !newSection || !userId) {
    return res.status(400).json({ error: '현재 섹션 이름 또는 새 섹션 이름이 제공되지 않았거나 사용자 정보가 없습니다.' });
  }

  const updateQuery = 'UPDATE Todo SET TodoCg = ? WHERE TodoCg = ? AND userId = ?';
  connection.execute(updateQuery, [newSection, oldSection, userId], (err, results) => {
    if (err) {
      console.error('섹션 수정 오류:', err);
      return res.status(500).json({ error: '섹션 이름 변경 중 오류 발생' });
    }
    res.json({ message: '섹션 이름이 성공적으로 변경되었습니다.' });
  });
});

// 할 일 조회
router.post('/todos', (req, res) => {
  const { userId, todoDate } = req.body;
  console.log(`Fetching todos for userId: ${userId}, date: ${todoDate}`);
  
  const query = `
    SELECT userId, todoText, todoCheck, DATE_FORMAT(todoDate, "%Y-%m-%d") as todoDate, todoCg 
    FROM Todo 
    WHERE userId = ? AND DATE_FORMAT(todoDate, "%Y-%m-%d") = ? AND todoText IS NOT NULL
  `;
  connection.execute(query, [userId, todoDate], (err, results) => {
    if (err) {
      console.error('할 일 조회 오류:', err);
      return res.status(500).send('서버 오류');
    }
    console.log(`Todos fetched for date ${todoDate}:`, results);
    res.json(results);
  });
});


// 할 일 생성 후 조회
router.post('/addTodo', (req, res) => {
  const { todoText, todoCg, userId, todoDate } = req.body;
  console.log(`Adding todo for userId: ${userId}, date: ${todoDate}`);
  const dateToInsert = todoDate || new Date().toISOString().split('T')[0];

  if (!todoText || !todoCg || !userId) {
    return res.status(400).json({ message: '모든 필드를 입력하세요. todoText와 todoCg, userId가 필요합니다.' });
  }

  // 현재 section의 TodoCgIndex 값 조회
  const checkSectionIndexQuery = 'SELECT TodoCgIndex FROM Todo WHERE TodoCg = ? AND userId = ? LIMIT 1';
  connection.execute(checkSectionIndexQuery, [todoCg, userId], (err, results) => {
    if (err) {
      console.error('섹션 인덱스 조회 오류:', err);
      return res.status(500).json({ message: '서버 오류 발생' });
    }

    // section의 TodoCgIndex가 'y'이면 새 할 일의 TodoCgIndex도 'y'로 설정
    const todoCgIndex = results.length > 0 && results[0].TodoCgIndex === 'y' ? 'y' : 'n';

    // 새로운 할 일 생성 쿼리
    const insertTodoQuery = 'INSERT INTO Todo (todoText, todoCheck, todoDate, userId, todoCg, TodoCgIndex) VALUES (?, ?, ?, ?, ?, ?)';
    connection.execute(insertTodoQuery, [todoText, 'n', dateToInsert, userId, todoCg, todoCgIndex], (insertErr) => {
      if (insertErr) {
        console.error('할 일 생성 오류:', insertErr);
        return res.status(500).json({ message: '서버 오류 발생' });
      }
      console.log(`Todo added for date ${dateToInsert}: ${todoText} with TodoCgIndex: ${todoCgIndex}`);

      // 새로 생성한 할 일이 포함된 목록을 조회하여 반환
      const fetchTodosQuery = 'SELECT userId, todoText, todoCheck, todoDate, todoCg, TodoCgIndex FROM Todo WHERE userId = ? AND DATE_FORMAT(todoDate, "%Y-%m-%d") = ? AND todoText IS NOT NULL';
      connection.execute(fetchTodosQuery, [userId, dateToInsert], (fetchErr, results) => {
        if (fetchErr) {
          console.error('할 일 조회 오류:', fetchErr);
          return res.status(500).json({ message: '할 일 목록 조회 오류 발생' });
        }
        console.log(`Todos fetched after adding for date ${dateToInsert}:`, results);
        res.json({
          message: '할일이 성공적으로 생성되었으며, 목록이 조회되었습니다.',
          todos: results // 생성 후 조회된 할 일 목록 반환
        });
      });
    });
  });
});





// 할 일 수정
router.post('/editTodo', (req, res) => {
  const { oldTodoText, newTodoText, todoCg, userId } = req.body;

  if (!oldTodoText || !newTodoText || !userId || !todoCg) {
    return res.status(400).json({ message: '모든 필드를 입력하세요.' });
  }

  const query = 'UPDATE Todo SET todoText = ? WHERE todoText = ? AND userId = ? AND todoCg = ?';
  connection.execute(query, [newTodoText, oldTodoText, userId, todoCg], (err) => {
    if (err) {
      console.error('할 일 수정 오류:', err);
      return res.status(500).json({ message: '서버 오류 발생' });
    }
    res.json({ message: '할 일의 이름이 성공적으로 변경되었습니다.', updatedTodo: { todoText: newTodoText, todoCg, userId } });
  });
});

// 할 일 삭제
router.post('/deleteTodo', (req, res) => {
  const { todoText, todoCg, userId } = req.body;
  console.log(`Deleting todo for userId: ${userId}, todoText: ${todoText}`);

  const deleteQuery = 'DELETE FROM Todo WHERE todoText = ? AND TodoCg = ? AND userId = ?';
  connection.execute(deleteQuery, [todoText, todoCg, userId], (err) => {
    if (err) {
      console.error('할 일 삭제 오류:', err);
      return res.status(500).json({ error: '할 일 삭제 중 오류 발생' });
    }
    console.log(`Todo deleted for userId: ${userId}, todoText: ${todoText}`);
    res.json({ message: '할 일이 성공적으로 삭제되었습니다.' });
  });
});

// 할 일 체크 상태 업데이트
router.post('/toggleTodoCheck', (req, res) => {
  const { todoText, todoCg, userId } = req.body;

  if (!todoText || !userId || !todoCg) {
    return res.status(400).json({ message: '모든 필드를 입력하세요.' });
  }

  const currentCheckQuery = 'SELECT todoCheck FROM Todo WHERE todoText = ? AND userId = ? AND todoCg = ?';
  connection.execute(currentCheckQuery, [todoText, userId, todoCg], (err, rows) => {
    if (err) {
      console.error('데이터 조회 오류:', err);
      return res.status(500).json({ message: '서버 오류 발생' });
    }

    if (rows.length > 0) {
      const currentCheck = rows[0].todoCheck;
      const newCheck = currentCheck === 'n' ? 'y' : 'n';
      const updateQuery = 'UPDATE Todo SET todoCheck = ? WHERE todoText = ? AND userId = ? AND todoCg = ?';
      connection.execute(updateQuery, [newCheck, todoText, userId, todoCg], (err) => {
        if (err) {
          console.error('체크 상태 업데이트 오류:', err);
          return res.status(500).json({ message: '서버 오류 발생' });
        }
        res.json({ message: `할 일의 체크 상태가 ${newCheck === 'y' ? '완료' : '미완료'}로 변경되었습니다.`, updatedTodo: { todoText, todoCg, userId, todoCheck: newCheck } });
      });
    } else {
      res.status(404).json({ message: '할 일을 찾을 수 없습니다.' });
    }
  });
});

// todoCgIndex 업데이트 API
router.post('/updateTodoCgIndex', (req, res) => {
  const { sectionId, TodoCgIndex, userId } = req.body;

  if (!sectionId || !TodoCgIndex || !userId) {
    return res.status(400).json({ error: '필요한 정보가 부족합니다.' });
  }

  const query = 'UPDATE Todo SET TodoCgIndex = ? WHERE TodoCg = ? AND userId = ?';
  connection.execute(query, [TodoCgIndex, sectionId, userId], (err, results) => {
    if (err) {
      console.error('TodoCgIndex 업데이트 오류:', err);
      return res.status(500).json({ error: 'TodoCgIndex 업데이트 중 오류 발생' });
    }
    res.json({ message: 'TodoCgIndex가 성공적으로 업데이트되었습니다.' });
  });
});

module.exports = router;
