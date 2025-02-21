import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const EditModal = ({ isModalOpen, setModalOpen, task, editTaskMutation }) => {
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    if (task) {
      setValue("title", task.title);
      setValue("description", task.description);
    }
  }, [task, setValue]);

  const onSubmit = (data) => {
    editTaskMutation.mutate({
      id: task._id,
      editedTask: { title: data.title, description: data.description },
    });
    setModalOpen(false);
  };

  if (!isModalOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box relative">
        <button
          onClick={() => setModalOpen(false)}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              className="w-full p-2 border border-gray-300 rounded"
              {...register("title", { required: "Title is required" })}
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
              {...register("description", {
                required: "Description is required",
              })}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary ml-2">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditModal;
