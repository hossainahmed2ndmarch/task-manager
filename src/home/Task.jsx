import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import useAuth from "../hooks/useAuth";
import useTasks from "../hooks/useTasks";
import AddTask from "../components/AddTask";
import TaskCard from "../components/TaskCard";

const Task = () => {
  const { tasksData, updateTaskMutation, editTaskMutation,deleteTaskMutation } = useTasks();
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

    setTasks((prevTasks) => {
      if (JSON.stringify(prevTasks) !== JSON.stringify(groupedTasks)) {
        return groupedTasks;
      }
      return prevTasks;
    });
  }, [tasksData]);

  // Drag & Drop Handler
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceCategory = source.droppableId;
    const destCategory = destination.droppableId;

    const newTasks = { ...tasks };

    // Moving task within the same category
    if (sourceCategory === destCategory) {
      const reorderedTasks = [...newTasks[sourceCategory]];
      const [movedTask] = reorderedTasks.splice(source.index, 1);
      reorderedTasks.splice(destination.index, 0, movedTask);
      newTasks[sourceCategory] = reorderedTasks;

      // Update the task positions
      const updatedTasks = reorderedTasks.map((task, index) => ({
        id: task._id,
        category: task.category,
        position: index,
      }));

      updateTaskMutation.mutate({ updatedTasks });
    } else {
      // Moving task to a different category
      const [movedTask] = newTasks[sourceCategory].splice(source.index, 1);
      movedTask.category = destCategory;
      newTasks[destCategory].splice(destination.index, 0, movedTask);

      // Update category and position
      const updatedTasks = newTasks[destCategory].map((task, index) => ({
        id: task._id,
        category: task.category,
        position: index,
      }));

      updateTaskMutation.mutate({ updatedTasks });
    }

    setTasks(newTasks);
  };

  return (
    <div className=" mx-auto p-6 bg-gray-100 shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Task Management Board
      </h2>

      {/* Task Form */}
      <AddTask></AddTask>

      {/* Drag & Drop Task Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["To-Do", "In Progress", "Done"].map((category) => (
            <Droppable key={category} droppableId={category}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-4 shadow rounded-lg"
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
                        <TaskCard
                          task={task}
                          category={category}
                          updateTaskMutation={updateTaskMutation}
                          editTaskMutation={editTaskMutation}
                          deleteTaskMutation={deleteTaskMutation}
                          provided={provided}
                        />
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
