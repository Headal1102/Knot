import '../css/Todo.css';
import React, { useState, useEffect } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaRegTrashAlt } from 'react-icons/fa';
import { LuPencil } from 'react-icons/lu';

function Todo() {
  const userId = sessionStorage.getItem('userId'); // sessionStorage에서 userId 가져오기

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
    const fetchData = async () => {
      try {
        const sectionsResponse = await fetch('http://localhost:8080/api/todo/sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }), // userId 포함
          credentials: 'include',
        });
        const todosResponse = await fetch('http://localhost:8080/api/todo/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }), // userId 포함
          credentials: 'include',
        });

        if (!sectionsResponse.ok) throw new Error('섹션 데이터 불러오기 실패');
        if (!todosResponse.ok) throw new Error('할 일 데이터 불러오기 실패');

        const sectionsData = await sectionsResponse.json();
        const todosData = await todosResponse.json();

        setSections(sectionsData);
        setTodos(todosData);

        if (sectionsData.length > 0) {
          setActiveTab(sectionsData[0].TodoCg);
        } else {
          setActiveTab(null);
        }
      } catch (error) {
        console.error('데이터 로딩 중 오류:', error);
      }
    };

    fetchData();
  }, [userId]);

  const addSection = async () => {
    let newSectionNumber = 1;
    let newSectionName = `섹션 ${newSectionNumber}`;

    while (sections.some(section => section.TodoCg === newSectionName)) {
      newSectionNumber += 1;
      newSectionName = `섹션 ${newSectionNumber}`;
    }

    const newSection = { todosection: newSectionName, userId };
    const response = await fetch('http://localhost:8080/api/todo/addSection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSection),
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      if (data.section && data.section.TodoCg) {
        setSections([...sections, data.section]);
        setActiveTab(data.section.TodoCg);
      } else {
        console.error('서버에서 반환된 섹션 데이터에 TodoCg가 없습니다.');
      }
    } else {
      console.error('섹션 추가 중 오류 발생');
    }
  };

  const addTodo = async () => {
    if (!activeTab) {
      console.error('활성화된 섹션이 없습니다.');
      return;
    }

    const currentSectionTodos = todos.filter(todo => todo.todoCg === activeTab);
    const newTodoNumber = currentSectionTodos.length + 1;
    const newTodoText = `내용 ${newTodoNumber}`;

    const newTodo = { todoText: newTodoText, todoCg: activeTab, userId };

    const response = await fetch('http://localhost:8080/api/todo/addTodo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      setTodos([...todos, data.newTodo]);
    }
  };

  const saveSectionEdit = async (sectionId) => {
    if (!editedSectionName) {
      console.error('섹션 이름이 비어 있습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/todo/changeSection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldSection: sectionId, newSection: editedSectionName, userId }),
        credentials: 'include',
      });

      if (response.ok) {
        const updatedSections = sections.map(section =>
          section.TodoCg === sectionId ? { ...section, TodoCg: editedSectionName } : section
        );
        setSections(updatedSections);
        setEditingSectionId(null);
        setEditedSectionName('');
      } else {
        console.error('섹션 이름 변경 중 오류 발생');
      }
    } catch (error) {
      console.error('네트워크 오류 발생:', error);
    }
  };

  const deleteSection = async (sectionId) => {
    const response = await fetch('http://localhost:8080/api/todo/dropSection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todosection: sectionId, userId }),
      credentials: 'include',
    });
  
    if (response.ok) {
      setSections(sections.filter((section) => section.TodoCg !== sectionId));
      if (activeTab === sectionId) setActiveTab(null);
    }
  };  

  const deleteTodo = async (todoId) => {
    const response = await fetch('http://localhost:8080/api/todo/deleteTodo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todoText: todoId, todoCg: activeTab, userId }),
      credentials: 'include'
    });

    if (response.ok) {
      setTodos(todos.filter((todo) => todo.todoText !== todoId));
    }
  };

  const toggleCompleted = async (todoId) => {
    const response = await fetch('http://localhost:8080/api/todo/toggleTodoCheck', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todoText: todoId, todoCg: activeTab, userId }),
      credentials: 'include'
    });

    if (response.ok) {
      setTodos(todos.map((todo) =>
        todo.todoText === todoId ? { ...todo, todoCheck: todo.todoCheck === 'n' ? 'y' : 'n' } : todo
      ));
    }
  };

  const startEditingTodo = (todoId, content) => {
    setTodos(todos.map(todo => (todo.todoText === todoId ? { ...todo, editing: true } : todo)));
    setEditContent(prev => ({ ...prev, [todoId]: content }));
  };

  const editTodo = async (oldTodoText, newTodoText) => {
    if (!editContent[oldTodoText]) {
      console.error('수정할 내용이 비어 있습니다.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/todo/editTodo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldTodoText, newTodoText, todoCg: activeTab, userId }),
        credentials: 'include',
      });

      if (response.ok) {
        const updatedTodos = todos.map(todo =>
          todo.todoText === oldTodoText
            ? { ...todo, todoText: newTodoText, editing: false }
            : todo
        );
        setTodos(updatedTodos);
        setEditContent(prev => ({ ...prev, [oldTodoText]: '' }));
      } else {
        console.error('수정 중 오류 발생');
      }
    } catch (error) {
      console.error('네트워크 오류 발생:', error);
    }
  };

  const handleEditContentChange = (todoId, event) => {
    const { value } = event.target;
    setEditContent(prev => ({ ...prev, [todoId]: value }));
  };

  const toggleTodoCgIndex = async (sectionId) => {
    const updatedSections = sections.map(section =>
      section.TodoCg === sectionId
        ? { ...section, TodoCgIndex: section.TodoCgIndex === 'y' ? 'n' : 'y' }
        : section
    );
    setSections(updatedSections);

    try {
      const response = await fetch('http://localhost:8080/api/todo/updateTodoCgIndex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId,
          TodoCgIndex: updatedSections.find((s) => s.TodoCg === sectionId).TodoCgIndex,
          userId
        }),
        credentials: 'include'
      });
      if (!response.ok) {
        console.error('서버에서 TodoCgIndex 업데이트 실패');
      }
    } catch (error) {
      console.error('서버와의 통신 오류:', error);
    }
  };

  return (
    <div className="app-container">
      <h2 id='todolistHead'>Todo-List</h2>
      <div className="tab-container">
        {sections.length > tabsToShow && (
          <button onClick={() => setTabIndex(tabIndex - 1)} disabled={tabIndex === 0} className="arrow-btn">◀</button>
        )}
        {sections.slice(tabIndex, tabIndex + tabsToShow).map((section) => (
          <div key={section.TodoCg} className="tab-wrapper">
            {editingSectionId === section.TodoCg ? (
              <input
                type="text"
                value={editedSectionName}
                onChange={(e) => setEditedSectionName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveSectionEdit(section.TodoCg);
                }}
                onBlur={() => saveSectionEdit(section.TodoCg)}
              />
            ) : (
              <div id="Todoindex">
                <button
                  className={`tab ${activeTab === section.TodoCg ? 'active-tab' : ''}`}
                  onClick={() => setActiveTab(section.TodoCg)}
                  onDoubleClick={() => setEditingSectionId(section.TodoCg)}
                >
                  {section.TodoCg}
                </button>
                <button onClick={() => toggleTodoCgIndex(section.TodoCg)} className="star-icon-btn">
                  {section.TodoCgIndex === 'y' ? '⭐' : '☆'}
                </button>
              </div>
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
        {todos.filter(todo => todo.todoCg === activeTab).length === 0 ? (
          <div className="empty-todo-message">
            <span>아이콘 이미지를 눌러서 투두리스트를 작성해보세요!</span>
          </div>
        ) : (
          <div className="todo-list">
            {todos
              .filter(todo => todo.todoCg === activeTab)
              .sort((a, b) => (a.todoCheck === 'y' ? 1 : -1)) // 완료된 항목을 하단으로 정렬
              .map((todo) => {
                const formatDate = (dateStr) => {
                  const date = new Date(dateStr);
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  return `${year}-${month}-${day}`;
                };

                return (
                  <div key={todo.todoText} className={`todo-item ${todo.todoCheck === 'n' ? 'not-completed' : 'completed'}`}>
                    <input
                      type="checkbox"
                      checked={todo.todoCheck === 'y'}
                      onChange={() => toggleCompleted(todo.todoText)}
                      style={{ marginRight: '10px' }}
                    />
                    <span>{todo.todoText}</span>
                    <span className="todo-date">{formatDate(todo.todoDate)}</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                      <button onClick={() => startEditingTodo(todo.todoText, todo.todoText)} className="icon-btn">
                        <LuPencil size={20} />
                      </button>
                      <button onClick={() => deleteTodo(todo.todoText)} className="icon-btn">
                        <FaRegTrashAlt size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
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
