import '../css/Todo.css'
import React, { useState } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaRegTrashAlt } from "react-icons/fa";
import { LuPencil } from "react-icons/lu";

export default function TodoList(){
    const [sections, setSections] = useState([{ id: 1, name: "섹션 1", tasks: [] }]);
    const [activeTab, setActiveTab] = useState(1);
    const [editingSectionId, setEditingSectionId] = useState(null);
    const [editedSectionName, setEditedSectionName] = useState('');
    const [tabIndex, setTabIndex] = useState(0);
    const tabsToShow = 3; // 보여줄 탭의 수
    const [todos, setTodos] = useState([
      { id: 1, date: '2024.00.00', content: '내용 1', completed: true, section: 'A', editing: false },
      { id: 2, date: '2024.00.00', content: '내용 1', completed: true, section: 'A', editing: false },
      { id: 3, date: '2024.00.00', content: '내용 1', completed: false, section: 'B', editing: false },
      { id: 4, date: '2024.00.00', content: '내용 1', completed: false, section: 'B', editing: false },
    ]);
    const [editContent, setEditContent] = useState(''); // 수정 중인 투두 내용
  
    const addSection = () => {
      const newSection = { id: sections.length + 1, name: `섹션 ${sections.length + 1}`, tasks: [] };
      setSections([...sections, newSection]);
      setActiveTab(newSection.id);
    };
  
    const deleteSection = (sectionId) => {
      setSections(sections.filter((section) => section.id !== sectionId));
      if (activeTab === sectionId) {
        setActiveTab(sections[0]?.id || 1);
        if (tabIndex >= sections.length - tabsToShow) {
          setTabIndex(tabIndex - 1);
        }
      }
    };
  
    const startEditingSection = (section) => {
      setEditingSectionId(section.id);
      setEditedSectionName(section.name);
    };
  
    const saveSectionEdit = (sectionId) => {
      setSections(sections.map((section) =>
        section.id === sectionId ? { ...section, name: editedSectionName } : section
      ));
      setEditedSectionName(''); // Clear input
      setEditingSectionId(null);
    };
  
    const goToNextTab = () => {
      if (tabIndex < sections.length - tabsToShow) {
        setTabIndex(tabIndex + 1);
      }
    };
  
    const goToPrevTab = () => {
      if (tabIndex > 0) {
        setTabIndex(tabIndex - 1);
      }
    };
  
    const addTodo = () => {
      const newTodo = { id: todos.length + 1, date: '2024.00.00', content: '내용 1', completed: false, section: activeTab, editing: false };
      setTodos([...todos, newTodo]);
    };
  
    const toggleCompleted = (id) => {
      setTodos(todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ));
    };
  
    const deleteTodo = (id) => {
      setTodos(todos.filter(todo => todo.id !== id));
    };
  
    const startEditingTodo = (id, content) => {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, editing: true } : todo
      ));
      setEditContent(content); // 수정 중인 내용 설정
    };
  
    const saveTodoEdit = (id) => {
      setTodos(todos.map(todo =>
        todo.id === id ? { ...todo, content: editContent, editing: false } : todo
      ));
      setEditContent(''); // 수정 내용 초기화
    };
    return(
        <div className="app-container">
        <div className="tab-container">
          <h2>To-Do</h2>
          {sections.length > tabsToShow && (
            <button onClick={goToPrevTab} disabled={tabIndex === 0} className="arrow-btn">◀</button>
          )}
          {sections.slice(tabIndex, tabIndex + tabsToShow).map((section) => (
            <div key={section.id} className="tab-wrapper">
              {editingSectionId === section.id ? (
                <input className='tab-name'
                  type="text"
                  value={editedSectionName}
                  onChange={(e) => setEditedSectionName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // 기본 동작 방지
                      saveSectionEdit(section.id);
                    }
                  }}
                  onBlur={() => saveSectionEdit(section.id)}
                />
              ) : (
                <button
                  className={`tab ${activeTab === section.id ? "active-tab" : ""}`}
                  onClick={() => setActiveTab(section.id)}
                  onDoubleClick={() => startEditingSection(section)}
                >
                  {section.name}
                </button>
              )}
            </div>
          ))}
          {sections.length > tabsToShow && (
            <button onClick={goToNextTab} disabled={tabIndex >= sections.length - tabsToShow} className="arrow-btn">▶</button>
          )}
          <button onClick={addSection} className="add-tab-btn" ><IoIosAddCircleOutline size={30} /></button>
          <button className="delete-section-btn" onClick={() => deleteSection(activeTab)}>
            삭제
          </button>
        </div>
  
        <div className="todo-container">
          {todos.filter(todo => todo.section === activeTab).length === 0 ? (
            <div className="empty-todo-message">
              <span>아이콘 이미지를 눌러서 투두리스트를 작성해보세요!</span>
            </div>
          ) : (
            <div className="todo-list">
              {todos.filter(todo => todo.section === activeTab).map((todo) => (
                <div key={todo.id} className="todo-item">
                  <div className="todo-date">{todo.date}</div>
                  <div className="todo-content">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleCompleted(todo.id)}
                    />
                    {todo.editing ? (
                      <input
                        type="text"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        onBlur={() => saveTodoEdit(todo.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveTodoEdit(todo.id);
                          }
                        }}
                      />
                    ) : (
                      <span>{todo.content}</span>
                    )}
                  </div>
                  <div className="todo-icons">
                    <button className="eye-btn" onClick={() => startEditingTodo(todo.id, todo.content)}>
                      <LuPencil size={20} />
                    </button>
                    <button className="delete-btn" onClick={() => deleteTodo(todo.id)}><FaRegTrashAlt size={20} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <button className="add-todo-btn" onClick={addTodo}>
          투두리스트 추가
        </button>
      </div>
    )
};