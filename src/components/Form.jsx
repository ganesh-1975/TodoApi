import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Loader from "./Loader";
import TodoCard from "./TodoCard";

//Interceptor
axios.interceptors.request.use(
  (config) => {
    console.log(
      `${config.method.toUpperCase()} request sent to ${
        config.url
      } at ${new Date().getTime()}`
    );
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

function Form({ url }) {
  const { register, reset, handleSubmit } = useForm();
  const [taskInitiated, settaskInitiated] = useState(false);
  const [formStatus, setformStatus] = useState(false);
  const [todos, settodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editStatus, seteditStatus] = useState(false);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  function initTask() {
    settaskInitiated((prev) => !prev);
  }

  function addTask(data) {
    let date = new Date(data.dueDate);
    let fDate = date.toLocaleDateString("en", options);
    setformStatus(true);
    reset();
    axios
      .post(`${url}todos.json`, { ...data, dueDate: fDate, status: false })
      .then(() => {
        setformStatus(false);
        fetchTodos();
      })
      .catch((error) => {
        console.error("There was an error adding the task!", error);
        setformStatus(false);
      });
  }

  function fetchTodos() {
    axios(`${url}todos.json`)
      .then((todos) => {
        let tempTodos = [];
        for (let key in todos.data) {
          let todo = {
            id: key,
            ...todos.data[key],
          };
          tempTodos.push(todo);
        }
        settodos(tempTodos);
      })
      .catch((error) => {
        console.error("There was an error fetching the todos!", error);
      });
  }

  function handleDelete(id) {
    axios
      .delete(`${url}todos/${id}.json`)
      .then(() => {
        fetchTodos();
      })
      .catch((error) => {
        console.error("There was an error deleting the task!", error);
      });
  }

  function taskCompleted(id) {
    let todoItem = todos.find((todo) => todo.id === id);
    if (todoItem) {
      let updatedStatus = !todoItem.status;
      axios
        .patch(`${url}todos/${id}.json`, { status: updatedStatus })
        .then(() => {
          fetchTodos();
        })
        .catch((error) => {
          console.error("There was an error updating the status!", error);
        });
    } else {
      console.error("Todo item not found");
    }
  }

  function handleEdit(id, e) {
    seteditStatus(true);

    let updatedTask = e.target.value;
    axios
      .patch(`${url}todos/${id}.json`, { task: updatedTask })
      .then(() => {
        fetchTodos();
        seteditStatus(false);
      })
      .catch((error) => {
        console.error("There was an error updating the task!", error);
      });

    setIsEditing(false);
  }

  useEffect(() => {
    fetchTodos();
  }, [url]);

  return (
    <div>
      <div className="bg-blue-600 text-white text-center py-3 font-light">
        If you've got tasks, start managing today!
      </div>
      <div className="w-[360px] mx-auto mt-10">
        <h1 className="text-xl text-black font-bold">
          Manage your task <span className="text-neutral-600">@ganesh</span>
        </h1>
        <p className="text-neutral-600">
          Add your tasks and start organizing them quickly.
        </p>
      </div>
      <button
        onClick={initTask}
        className="fixed bottom-10 right-10 bg-black text-white w-12 flex rounded-full items-center justify-center h-12"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          className="bi bi-plus"
          viewBox="0 0 16 16"
        >
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
        </svg>
      </button>

      <div className={taskInitiated ? "w-[360px] mx-auto mt-5" : "hidden"}>
        <form onSubmit={handleSubmit(addTask)}>
          <div className="flex gap-2">
            <input
              {...register("task")}
              className="w-[87%] p-3 rounded-lg border mb-2 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
              type="text"
              placeholder="e.g. Learn Javascript"
            />
            <input
              {...register("dueDate")}
              className="w-[13%]  p-3 rounded-lg border mb-2 focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-600"
              type="datetime-local"
            />
          </div>

          <button
            type="submit"
            className="bg-black rounded-lg text-white px-5 py-3 text-sm font-light flex align-center gap-4"
          >
            Add Task{!formStatus ? "" : <Loader />}
          </button>
        </form>
      </div>

      {todos.map((todo) => (
        <TodoCard
          task={todo.task}
          dueDate={todo.dueDate}
          status={todo.status}
          key={todo.id}
          id={todo.id}
          handleDelete={handleDelete}
          taskCompleted={taskCompleted}
          handleEdit={handleEdit}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          editStatus={editStatus}
        />
      ))}
    </div>
  );
}

export default Form;
