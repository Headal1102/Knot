const express=require('express');
const router=express.Router();
// const mysql = require('mysql2');
// require('dotenv').config();
const db = require('../db');


class Diary { 
  static async create({ title, content, weather }) {
    const [result] = await db.execute(
      'INSERT INTO diary (title, content, weather) VALUES (?, ?, ?)',
      [title, content, weather]
    );
    return result;
  }

  static async update(id, { title, content, weather }) {
    const [result] = await db.execute(
      'UPDATE diary SET title = ?, content = ?, weather = ? WHERE id = ?',
      [title, content, weather, id]
    );
    return result;
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM diary WHERE id = ?', [id]);
    return result;
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM knot.diary WHERE userId="tjdn";');

  // 데이터가 없거나, 조회 결과가 비어 있는 경우
  if (!rows || rows.length === 0) {
    console.log('No data found');
    return []; // 빈 배열 반환
  }

  return rows;  // 결과 반환
  }
}

module.exports = Diary;