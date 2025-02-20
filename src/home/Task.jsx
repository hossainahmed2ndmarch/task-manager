import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useAuth from "../hooks/useAuth";
import useTasks from "../hooks/useTasks";

const Task = () => {
  const { register, handleSubmit, reset } = useForm();
  const { tasksData, refetch, addTaskMutation, updateTaskMutation } =
    useTasks();
  const { user } = useAuth();
  const [tasks, setTasks] = useState({
    "To-Do": [],
    "In Progress": [],
    Done: [],
  });

  // Group tasks by category
  useEffect(() => {
    const groupedTasks = {
      "To-Do": [],
      "In Progress": [],
      Done: [],
    };

    tasksData.forEach((task) => {
      groupedTasks[task.category].push(task);
    });

    setTasks(groupedTasks);
  }, [tasksData]);

  // Add Task Handler
  const onSubmit = (data) => {
    const newTask = {
      title: data.title,
      description: data.description,
      category: "To-Do",
      taskAdder: user?.email,
    };
    addTaskMutation.mutate(newTask, {
      onSuccess: () => {
        reset(); // Clear form
        refetch();
      },
    });
  };

  // Drag & Drop Handler
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceCategory = source.droppableId;
    const destCategory = destination.droppableId;

    const newTasks = { ...tasks };
    const [movedTask] = newTasks[sourceCategory].splice(source.index, 1);
    movedTask.category = destCategory;
    newTasks[destCategory].splice(destination.index, 0, movedTask);

    setTasks(newTasks);

    updateTaskMutation.mutate({
      id: movedTask._id,
      updatedTask: { category: destCategory },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Task Management Board
      </h2>

      {/* Task Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-4 p-4 bg-white shadow rounded-lg"
      >
        <input
          {...register("title", { required: true, maxLength: 50 })}
          placeholder="Task Title (max 50 chars)"
          className="w-full p-2 mb-2 border rounded"
        />
        <textarea
          {...register("description", { maxLength: 200 })}
          placeholder="Task Description (max 200 chars)"
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
        >
          Add Task
        </button>
      </form>

      {/* Drag & Drop Task Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["To-Do", "In Progress", "Done"].map((category) => (
            <Droppable key={category} droppableId={category}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-4 shadow rounded-lg min-h-[250px]"
                >
                  <h3 className="font-bold text-lg text-center mb-3">
                    {category}
                  </h3>
                  {tasks[category].map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-4 bg-gray-100 shadow rounded-lg mb-2 flex justify-between items-center"
                        >
                          <div>
                            <h3 className="font-bold">{task.title}</h3>
                            <p className="text-sm">{task.description}</p>
                          </div>
                          <span className="text-gray-400">☰</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Task;
