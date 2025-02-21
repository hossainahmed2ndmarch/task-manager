import React from "react";
import { useForm } from "react-hook-form";
import useTasks from "../hooks/useTasks";
import useAuth from "../hooks/useAuth";

const AddTask = () => {
 const { user } = useAuth();
 const { refetch, addTaskMutation}=useTasks();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-4 p-4 bg-white shadow  rounded-lg"
    >
      {/* Title Input */}
      <input
        {...register("title", {
          required: "Title is required",
          maxLength: { value: 50, message: "Max 50 characters allowed" },
        })}
        placeholder="Task Title (max 50 chars)"
        className="w-full p-2 mb-2 border rounded"
      />
      {errors.title && (
        <p className="text-red-500 text-sm">{errors.title.message}</p>
      )}

      {/* Description Input */}
      <textarea
        {...register("description", {
          maxLength: { value: 200, message: "Max 200 characters allowed" },
        })}
        placeholder="Task Description (max 200 chars)"
        className="w-full p-2 mb-2 border rounded"
      />
      {errors.description && (
        <p className="text-red-500 text-sm">{errors.description.message}</p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-700"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTask;
