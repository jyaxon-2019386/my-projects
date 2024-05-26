import React, { useState, useEffect } from 'react';
import './todoList.css';
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { validateRequiredFields, validateDates } from '../shared/validators/validator.js';
import Swal from 'sweetalert2';
import axios from 'axios';

export const TodoList = () => {
  const [isCompleteScreen, setIsCompleteScreen] = useState(false);
  const [allTodos, setTodos] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newResponsible, setNewResponsible] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [completedTodos, setCompletedTodos] = useState([]);
  const [currentEdit, setCurrentEdit] = useState('');
  const [currentEditedItem, setCurrentEditedItem] = useState({});
  const api = axios.create({
    baseURL: 'http://localhost:2656',
  });

  const handleAddTodo = () => {
    const requiredFields = [
      { value: newTitle },
      { value: newDescription },
      { value: newResponsible },
      { value: newStartDate },
      { value: newEndDate }
    ];
    if (!validateRequiredFields(requiredFields) || !validateDates(newStartDate, newEndDate)) {
      return;
    }
    const newTodoItem = {
      newTitle: newTitle,
      newDescription: newDescription,
      newResponsible: newResponsible,
      newStartDate: newStartDate,
      newEndDate: newEndDate,
    };
    api.post('/addTask', newTodoItem)
      .then(response => {
        setTodos([...allTodos, response.data]);
        Swal.fire('Agregado', 'La tarea se agregó satisfactoriamente.', 'success');
      })
      .catch(error => {
        console.error('Error adding task:', error);
        Swal.fire('Error', 'Hubo un problema para agregar la tarea.', 'error');
      });
  };

  const handleDeleteTodo = (todoId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás deshacer esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        api.delete(`/deleteTask/${todoId}`)
          .then(() => {
            setTodos(allTodos.filter(task => task._id !== todoId));
            Swal.fire('Eliminado', 'Tu tarea ha sido eliminada.', 'success');
          })
          .catch(error => {
            console.error('Error deleting task:', error);
            Swal.fire('Error', 'Hubo un problema para eliminar la tarea.', 'error');
          });
      }
    });
  };

  const handleComplete = (task) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres marcar esta tarea como completada?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, tarea completa',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        let now = new Date();
        let dd = now.getDate();
        let mm = now.getMonth() + 1;
        let yyyy = now.getFullYear();
        let newcompletedOn = `${dd}/${mm}/${yyyy}`;

        let completedTask = {
          ...task,
          newcompletedOn: newcompletedOn,
        };

        setCompletedTodos([...completedTodos, completedTask]);
        setTodos(allTodos.filter((item) => item !== task));

        Swal.fire('Completado', 'La tarea ha sido marcada como completada.', 'success');
      }
    });
  };

  useEffect(() => {
    api.get('/getTask')
      .then(response => {
        console.log("Data received:", response.data);
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Error retrieving tasks:', error);
      });
  }, []);

  const handleEdit = (index, item) => {
    setCurrentEdit(index);
    setCurrentEditedItem({
      _id: item._id,
      title: item.newTitle,
      description: item.newDescription,
      responsible: item.newResponsible,
      startDate: item.newStartDate,
      endDate: item.newEndDate
    });
  };

  const handleUpdateTitle = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, title: value }));
  };

  const handleUpdateDescription = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, description: value }));
  };

  const handleUpdateResponsible = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, responsible: value }));
  };

  const handleUpdateStartDate = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, startDate: value }));
  };

  const handleUpdateEndDate = (value) => {
    setCurrentEditedItem((prev) => ({ ...prev, endDate: value }));
  };

  const handleUpdateToDo = () => {
    const requiredFields = [
      { value: currentEditedItem.title },
      { value: currentEditedItem.description },
      { value: currentEditedItem.responsible },
      { value: currentEditedItem.startDate },
      { value: currentEditedItem.endDate }
    ];
    if (!validateRequiredFields(requiredFields) || !validateDates(currentEditedItem.startDate, currentEditedItem.endDate)) {
      return;
    }

    if (!currentEditedItem._id) {
      Swal.fire('Error', 'No task ID provided.', 'error');
      return;
    }

    const updatedData = {
      newTitle: currentEditedItem.title,
      newDescription: currentEditedItem.description,
      newResponsible: currentEditedItem.responsible,
      newStartDate: currentEditedItem.startDate,
      newEndDate: currentEditedItem.endDate
    };

    api.put(`/updateTask/${currentEditedItem._id}`, updatedData)
      .then(response => {
        const updatedTodos = allTodos.map(item =>
          item._id === currentEditedItem._id ? response.data.updateTask : item
        );
        setTodos(updatedTodos);
        setCurrentEdit('');
        setCurrentEditedItem({});
        Swal.fire('Actualizado', 'La tarea se actualizó satisfactoriamente.', 'success');
      })
      .catch(error => {
        console.error('Error updating task:', error);
        Swal.fire('Error', 'Hubo un problema para actualizar la tarea.', 'error');
      });
  };

  return (
    <div className="TodoList">
      <h1>StockBoard</h1>

      <div className="btn-area">
        <button
          className={`secondaryBtn ${isCompleteScreen === false && 'active'}`}
          onClick={() => setIsCompleteScreen(false)}
        >
          Incompleted
        </button>
        <button
          className={`secondaryBtn ${isCompleteScreen === true && 'active'}`}
          onClick={() => setIsCompleteScreen(true)}
        >
          Completed
        </button>
      </div>

      <div className="todo-wrapper">
        <div className="todo-input">
          <div className="todo-input-item">
            <label>Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What's the task title?"
            />
          </div>
          <div className="todo-input-item">
            <label>Description</label>
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="What's the task description?"
            />
          </div>
          <div className="todo-input-item">
            <label>Responsible</label>
            <input
              type="text"
              value={newResponsible}
              onChange={(e) => setNewResponsible(e.target.value)}
              placeholder="Who is responsible for this task?"
            />
          </div>
          <div className="todo-input-item">
            <label>Start Date</label>
            <input
              type="date"
              value={newStartDate}
              onChange={(e) => setNewStartDate(e.target.value)}
            />
          </div>
          <div className="todo-input-item">
            <label>End Date</label>
            <input
              type="date"
              value={newEndDate}
              onChange={(e) => setNewEndDate(e.target.value)}
            />
          </div>

          <div className="todo-input-item">
            <button type="button" onClick={handleAddTodo} className="primaryBtn">
              Add
            </button>
          </div>
        </div>

        <div className='todo'>
          <div className='todo-list'>
            {isCompleteScreen === false &&
              allTodos.map((item, index) => {
                if (currentEdit === index) {
                  return (
                    <div className="edit-wrapper" key={index}>
                      <input
                        placeholder="Updated Title"
                        onChange={(e) => handleUpdateTitle(e.target.value)}
                        value={currentEditedItem.title}
                      />
                      <textarea
                        placeholder="Updated Description"
                        rows={4}
                        onChange={(e) => handleUpdateDescription(e.target.value)}
                        value={currentEditedItem.description}
                      />
                      <input
                        placeholder="Updated Responsible"
                        onChange={(e) => handleUpdateResponsible(e.target.value)}
                        value={currentEditedItem.responsible}
                      />
                      <input
                        type="date"
                        placeholder="Updated Start Date"
                        onChange={(e) => handleUpdateStartDate(e.target.value)}
                        value={currentEditedItem.startDate}
                      />
                      <input
                        type="date"
                        placeholder="Updated End Date"
                        onChange={(e) => handleUpdateEndDate(e.target.value)}
                        value={currentEditedItem.endDate}
                      />
                      <button
                        type="button"
                        onClick={handleUpdateToDo}
                        className="primaryBtn"
                      >
                        Update
                      </button>
                    </div>
                  );
                } else {
                  return (
                    <div className="todo-list-item" key={index}>
                      <div className="todo-details">
                        <h3>{item.newTitle}</h3>
                        <p>{item.newDescription}</p>
                        <p>
                          <small>Responsible: {item.newResponsible}</small>
                        </p>
                        <p>
                          <small>Start Date: {item.newStartDate}</small>
                        </p>
                        <p>
                          <small>End Date: {item.newEndDate}</small>
                        </p>
                      </div>
                      <div className="todo-actions">
                        <AiOutlineDelete
                          className="icon"
                          onClick={() => handleDeleteTodo(item._id)}
                          title="Delete?"
                        />
                        <BsCheckLg
                          className="check-icon"
                          onClick={() => handleComplete(item)}
                          title="Complete?"
                        />
                        <AiOutlineEdit
                          className="edit-icon"
                          onClick={() => handleEdit(index, item)}
                          title="Edit?"
                        />
                      </div>
                    </div>
                  );
                }
              })}

            {isCompleteScreen === true &&
              completedTodos.map((item, index) => {
                return (
                  <div className="todo-list-item" key={index}>
                    <div className="todo-details">
                      <h3>{item.newTitle}</h3>
                      <p>{item.newDescription}</p>
                      <p>
                        <small>Responsible: {item.newResponsible}</small>
                      </p>
                      <p>
                        <small>Start Date: {item.newStartDate}</small>
                      </p>
                      <p>
                        <small>End Date: {item.newEndDate}</small>
                      </p>
                      <p>
                        <small>Completed on: {item.newcompletedOn}</small>
                      </p>
                    </div>
                    <div className="todo-actions">
                      <AiOutlineDelete
                        className="icon"
                        onClick={() => handleDeleteTodo(item._id)}
                        title="Delete?"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
};
