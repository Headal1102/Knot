const Diary = require('../models/diaryModel');

// 다이어리 생성 create라고만 써있어서 수정 diaryModel, diary 참고함
exports.createDiary = async (req, res) => {
  try {
    const { title, content, weather } = req.body; //유저이름, 다이어리 코드 빠짐 

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

// 다이어리 수정 update라고만 써있어서 수정
exports.updateDiary = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, weather } = req.body; //다이어리 코드 빠짐

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

// 다이어리 삭제 delet로써있어서 수정
exports.deleteDiary = async (req, res) => { //다이어리 코드 참조해서 삭제, 유저 아이디로 삭제하면 전체 삭제됨
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

// 모든 다이어리 조회 여기 getAllDiaries가 아니라 findAll?이라고 적혀있어서 수정
exports.getAllDiaries = async (req, res) => { //로그인한 유저의 다이어리만 조회 해야함, userId 추가
  try {
    const diaries = await Diary.findAll();
    res.status(200).json({diaries});
  } catch (error) {
    console.error('Error fetching diaries:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
