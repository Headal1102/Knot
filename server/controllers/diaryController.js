const Diary = require('../models/diaryModel');

// 다이어리 생성
exports.createDiary = async (req, res) => {
  try {
    const { title, content, weather } = req.body;

    if (!title.trim() || !content.trim()) {
      return res.status(400).json({ error: 'Title and content cannot be empty' });
    }

    const safeWeather = weather !== undefined ? weather : null;
    const result = await Diary.create({ title, content, weather: safeWeather });
    res.status(201).json({ message: 'Diary created', result });
  } catch (error) {
    console.error('Error creating diary:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// 다이어리 수정
exports.updateDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, weather } = req.body;

    if (!title.trim() || !content.trim()) {
      return res.status(400).json({ error: 'Title and content cannot be empty' });
    }

    const safeWeather = weather !== undefined ? weather : null;
    await Diary.update(id, { title, content, weather: safeWeather });
    const updatedDiary = await Diary.findById(id);
    res.status(200).json({ message: 'Diary updated', updatedDiary });
  } catch (error) {
    console.error('Error updating diary:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// 다이어리 삭제
exports.deleteDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Diary.delete(id);

    if (!result) {
      return res.status(404).json({ error: 'Diary not found' });
    }

    res.status(200).json({ message: 'Diary deleted' });
  } catch (error) {
    console.error('Error deleting diary:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// 모든 다이어리 조회
exports.getAllDiaries = async (req, res) => {
  try {
    const diaries = await Diary.findAll();
    res.status(200).json({ diaries });
  } catch (error) {
    console.error('Error fetching diaries:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
