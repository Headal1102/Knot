const db = require('../db');

class Diary {
  static async create({ title, content, weather }) {
    const [result] = await db.execute(
      'INSERT INTO diaries (title, content, weather) VALUES (?, ?, ?)',
      [title, content, weather]
    );
    return result;
  }

  static async update(id, { title, content, weather }) {
    const [result] = await db.execute(
      'UPDATE diaries SET title = ?, content = ?, weather = ? WHERE id = ?',
      [title, content, weather, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM diaries WHERE id = ?', [id]);
    return result;
  }

  static async findAll() {
    const [diaries] = await db.execute('SELECT * FROM diaries');
    return diaries;
  }
}

module.exports = Diary;