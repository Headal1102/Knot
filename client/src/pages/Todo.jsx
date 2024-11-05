import '../css/Todo.css'
import React, { useState, useEffect } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaRegTrashAlt } from 'react-icons/fa';
import { LuPencil } from 'react-icons/lu';

function Todo(props) {
  const user=props.userName;
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editedSectionName, setEditedSectionName] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const tabsToShow = 3;
  const [todos, setTodos] = useState([]);
  const [editContent, setEditContent] = useState({});
  const [editDate, setEditDate] = useState('');

  useEffect(() => {
    // 데이터 초기 로딩
    const fetchData = async () => {
      try {
        const sectionsResponse = await fetch('http://localhost:8080/api/todo/sections');
        const todosResponse = await fetch('http://localhost:8080/api/todo/todos');
        if (!sectionsResponse.ok || !todosResponse.ok) {
          throw new Error('데이터 불러오기 실패');
        }
    
        const sectionsData = await sectionsResponse.json();
        const todosData = await todosResponse.json();
    
        setSections(sectionsData);
        setTodos(todosData);
        setActiveTab(sectionsData[0]?.id);
      } catch (error) {
        console.error('데이터 로딩 중 오류:', error);
      }
    };
        
    fetchData();
  }, []);

  const addSection = async () => {
    const newSection = { name: `섹션 ${sections.length + 1}`, tasks: [] };
    const response = await fetch('http://localhost:8080/sections', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSection),
    });

    if (response.ok) {
      const data = await response.json();
      setSections([...sections, data]);
      setActiveTab(data._id);
    }
  };

  const deleteSection = async (sectionId) => {
    await fetch(`http://localhost:8080/sections/${sectionId}`, {
      method: 'DELETE',
    });
    setSections(sections.filter((section) => section._id !== sectionId));
  };

  const saveSectionEdit = async (sectionId) => {
    const response = await fetch(`http://localhost:8080/sections/${sectionId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editedSectionName }),
    });

    if (response.ok) {
      const data = await response.json();
      setSections(sections.map((section) =>
        section._id === sectionId ? data : section
      ));
      setEditingSectionId(null);
      setEditedSectionName('');
    }
  };

  const addTodo = async () => {
    const newTodo = { date: '2024.00.00', content: [{ id: 1, text: '내용 1' }], completed: false, section: activeTab };
    const response = await fetch('http://localhost:8080/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    });

    if (response.ok) {
      const data = await response.json();
      setTodos([...todos, data]);
    }
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:8080/todos/${id}`, {
      method: 'DELETE',
    });
    setTodos(todos.filter(todo => todo._id !== id));
  };

  const saveTodoEdit = async (todoId) => {
    const todoToUpdate = todos.find(todo => todo._id === todoId);
    const updatedTodo = {
      ...todoToUpdate,
      date: editDate,
      content: todoToUpdate.content.map(content => ({
        ...content,
        text: editContent[todoId]?.[content.id] || content.text,
      })),
      editing: false,
    };

    const response = await fetch(`http://localhost:8080/todos/${todoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTodo),
    });

    if (response.ok) {
      const data = await response.json();
      setTodos(todos.map(todo => (todo._id === todoId ? data : todo)));
      setEditContent({});
      setEditDate('');
    }
  };

  // toggleCompleted 함수 추가
  const toggleCompleted = (contentId) => {
    setTodos(todos.map(todo => ({
      ...todo,
      content: todo.content.map(content => 
        content.id === contentId ? { ...content, completed: !content.completed } : content
      )
    })));
  };

  // startEditingTodo 함수 추가
  const startEditingTodo = (todoId, contentText) => {
    setTodos(todos.map(todo => 
      todo._id === todoId ? { ...todo, editing: true } : todo
    ));
    setEditContent(contentText);
  };

  return (
    <div className="app-container">
      <div className="tab-container">
        <h2>To-Do</h2>
        {sections.length > tabsToShow && (
          <button onClick={() => setTabIndex(tabIndex - 1)} disabled={tabIndex === 0} className="arrow-btn">◀</button>
        )}
        {sections.slice(tabIndex, tabIndex + tabsToShow).map((section) => (
          <div key={section._id} className="tab-wrapper">
            {editingSectionId === section._id ? (
              <input
                type="text"
                value={editedSectionName}
                onChange={(e) => setEditedSectionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveSectionEdit(section._id);
                }}
                onBlur={() => saveSectionEdit(section._id)}
              />
            ) : (
              <button
                className={`tab ${activeTab === section._id ? 'active-tab' : ''}`}
                onClick={() => setActiveTab(section._id)}
                onDoubleClick={() => setEditingSectionId(section._id)}
              >
                {section.name}
              </button>
            )}
          </div>
        ))}
        {sections.length > tabsToShow && (
          <button onClick={() => setTabIndex(tabIndex + 1)} disabled={tabIndex >= sections.length - tabsToShow} className="arrow-btn">▶</button>
        )}
        <button onClick={addSection} className="add-tab-btn">
          <IoIosAddCircleOutline size={30} />
        </button>
        <button onClick={() => deleteSection(activeTab)} className="delete-section-btn">
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
              <div key={todo._id} className="todo-item">
                {todo.editing ? (
                  <input
                    type="text"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    onBlur={() => saveTodoEdit(todo._id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveTodoEdit(todo._id);
                    }}
                  />
                ) : (
                  <div className="todo-date">{todo.date}</div>
                )}
                <div className="todo-content">
                  {todo.content.map((content) => (
                    <span key={content.id}>
                      <input
                        type="checkbox"
                        checked={content.completed}
                        onChange={() => toggleCompleted(content.id)}
                      />
                      {content.text}
                    </span>
                  ))}
                </div>
                <div className="todo-icons">
                  <button onClick={() => startEditingTodo(todo._id, todo.content[0].text)}>
                    <LuPencil size={20} />
                  </button>
                  <button onClick={() => deleteTodo(todo._id)}>
                    <FaRegTrashAlt size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={addTodo} className="add-todo-btn">
        투두리스트 추가
      </button>
    </div>
  );
}

export default Todo;