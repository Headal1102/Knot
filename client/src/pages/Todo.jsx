import '../css/Todo.css';
import React, { useState, useEffect } from 'react';
import { IoIosAddCircleOutline } from 'react-icons/io';
import { FaRegTrashAlt } from 'react-icons/fa';
import { LuPencil } from 'react-icons/lu';

function Todo({ selectedDate }) {
  const userId = sessionStorage.getItem('userId');
  const [sections, setSections] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editedSectionName, setEditedSectionName] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const tabsToShow = 3;
  const [todos, setTodos] = useState([]);
  const [editContent, setEditContent] = useState({});

  const today = new Date();
  const defaultDate = selectedDate || today.toISOString().split('T')[0];

  const fetchData = async (date) => {
    try {
      const targetDate = date || defaultDate;
      const sectionsResponse = await fetch('http://localhost:8080/api/todo/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
        credentials: 'include',
      });
      const todosResponse = await fetch('http://localhost:8080/api/todo/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, todoDate: targetDate }),
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

  useEffect(() => {
    fetchData(selectedDate);
  }, [userId, selectedDate]);

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
  
    const newTodoText = `새 할일`;
    const newTodo = { todoText: newTodoText, todoCg: activeTab, userId, todoDate: defaultDate };
  
    try {
      const response = await fetch('http://localhost:8080/api/todo/addTodo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo),
        credentials: 'include',
      });
  
      if (response.ok) {
        const result = await response.json();
        const addedTodo = result.todos[result.todos.length - 1]; // 방금 추가된 할 일만 가져옵니다.
        setTodos((prevTodos) => [...prevTodos, addedTodo]); // 새로운 할 일을 기존 할 일 목록에 추가하여 즉시 화면에 반영합니다.
        fetchData(selectedDate); // 전체 데이터를 다시 로드하여 새로고침 없이 화면을 갱신합니다.
      } else {
        console.error('할 일 추가 중 오류 발생');
      }
    } catch (error) {
      console.error('할 일 추가 요청 중 오류:', error);
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

  const deleteTodo = async (todoCd) => {
    try {
      const response = await fetch('http://localhost:8080/api/todo/deleteTodo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todoCd, userId }),
        credentials: 'include',
      });
  
      if (response.ok) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.todoCd !== todoCd)); // 할 일 삭제 후 상태 업데이트
      } else {
        console.error('할 일 삭제 중 오류 발생');
      }
    } catch (error) {
      console.error('할 일 삭제 요청 중 오류:', error);
    }
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
 

  const toggleCompleted = async (todoCd) => {
    try {
      const response = await fetch('http://localhost:8080/api/todo/toggleTodoCheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todoCd, userId, todoCg: activeTab }), // 필요한 데이터 모두 포함
        credentials: 'include'
      });
  
      if (response.ok) {
        setTodos(todos.map((todo) =>
          todo.todoCd === todoCd ? { ...todo, todoCheck: todo.todoCheck === 'n' ? 'y' : 'n' } : todo
        ));
      } else {
        console.error('할 일 체크 상태 변경 중 오류:', response.status);
      }
    } catch (error) {
      console.error('할 일 체크 상태 변경 중 오류:', error);
    }
  };
  
  

  const startEditingTodo = (todoCd, content) => {
    setTodos(todos.map(todo => (todo.todoCd === todoCd ? { ...todo, editing: true } : todo)));
    setEditContent(prev => ({ ...prev, [todoCd]: content }));
  };

  const editTodo = async (todoCd, newTodoText) => {
    console.log("editTodo 함수 호출:", { todoCd, newTodoText });
    const userId = sessionStorage.getItem('userId');
  
    try {
      const response = await fetch('http://localhost:8080/api/todo/editTodo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todoCd, newTodoText, userId }),
        credentials: 'include',
      });
  
      if (response.ok) {
        console.log("수정 요청 성공");
        // 서버에 반영된 이후 즉시 로컬 상태에 업데이트하여 화면에 반영
        setTodos(todos.map(todo =>
          todo.todoCd === todoCd ? { ...todo, todoText: newTodoText, editing: false } : todo
        ));
      } else {
        console.error('수정 요청 실패:', response.status);
      }
    } catch (error) {
      console.error('수정 요청 중 오류:', error);
    }
  };

  const handleEditContentChange = (todoCd, event) => {
    const { value } = event.target;
    setEditContent(prev => ({ ...prev, [todoCd]: value }));
  };

  return (
    <div className="app-container">
      <h2 id="todolistHead">Todo-List</h2>
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
                  onDoubleClick={() => {
                    setEditingSectionId(section.TodoCg);
                    setEditedSectionName(section.TodoCg); 
                  }}
                >
                  {section.TodoCg}
                  <span onClick={() => toggleTodoCgIndex(section.TodoCg)} className="star-icon-btn">
                    {section.TodoCgIndex === 'y' ? '⭐' : '☆'}
                  </span>
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
        {todos.filter(todo => todo.todoCg === activeTab && todo.todoDate === defaultDate).length === 0 ? (
          <div className="empty-todo-message">
            <span>아이콘 이미지를 눌러서 투두리스트를 작성해보세요!</span>
          </div>
        ) : (
          <div className="todo-list">
            {todos
              .filter(todo => todo.todoCg === activeTab && todo.todoDate === defaultDate)
              .sort((a, b) => (a.todoCheck === 'y' ? 1 : -1))
              .map((todo) => {
                const formatDate = (dateStr) => {
                  const date = new Date(dateStr);
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const day = String(date.getDate()).padStart(2, '0');
                  return `${year}-${month}-${day}`;
                };

                return (
                  <div key={todo.todoCd} className={`todo-item ${todo.todoCheck === 'n' ? 'not-completed' : 'completed'}`}>
                    <input
                      type="checkbox"
                      checked={todo.todoCheck === 'y'}
                      onChange={() => toggleCompleted(todo.todoCd)}
                      style={{ marginRight: '10px' }}
                    />
                    
                    {todo.editing ? (
                      <input
                        type="text"
                        value={editContent[todo.todoCd] || todo.todoText}
                        onChange={(e) => handleEditContentChange(todo.todoCd, e)}
                        onBlur={() => {
                          if (todo.todoCd) {
                            console.log('todoCd on blur:', todo.todoCd);
                            editTodo(todo.todoCd, editContent[todo.todoCd] || todo.todoText);
                            setTodos(todos.map(t => t.todoCd === todo.todoCd ? { ...t, editing: false } : t)); // 수정 후 editing을 false로 설정
                          } else {
                            console.error('todoCd is undefined for todo:', todo);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (todo.todoCd) {
                              console.log('todoCd on Enter:', todo.todoCd);
                              editTodo(todo.todoCd, editContent[todo.todoCd] || todo.todoText);
                              setTodos(todos.map(t => t.todoCd === todo.todoCd ? { ...t, editing: false } : t)); // 수정 후 editing을 false로 설정
                            } else {
                              console.error('todoCd is undefined for todo:', todo);
                            }
                          }
                        }}
                        
                      />
                    ) : (
                      <span onDoubleClick={() => startEditingTodo(todo.todoCd, todo.todoText)}>
                        {todo.todoText}
                      </span>
                    )}

                    <span className="todo-date">{formatDate(todo.todoDate)}</span>
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                      <button onClick={() => startEditingTodo(todo.todoCd, todo.todoText)} className="icon-btn">
                        <LuPencil size={20} />
                      </button>
                      <button onClick={() => deleteTodo(todo.todoCd)} className="icon-btn">
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