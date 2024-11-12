const express = require('express');
const router = express.Router();
const diaryController = require('../controllers/diaryController');

// 다이어리 생성
router.post('/', diaryController.createDiary);

// 다이어리 수정
router.put('/:id', diaryController.updateDiary);  // 수정 기능

// 다이어리 삭제
router.delete('/:id', diaryController.deleteDiary);

// 모든 다이어리 조회
router.get('/', diaryController.getAllDiaries);

module.exports = router;
