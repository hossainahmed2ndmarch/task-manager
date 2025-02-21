import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import EditModal from "./EditModal";
import Swal from "sweetalert2";

const TaskCard = ({
  task,
  updateTaskMutation,
  editTaskMutation,
  provided,
  deleteTaskMutation,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle Delete
  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTaskMutation.mutate(task?._id);
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      }
    });
  };

  return (
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

      {/* Icons (Edit & Delete) */}
      <div className="flex gap-2">
        {/* Edit Icon */}
        <span
          className="text-gray-400 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <AiOutlineEdit size={20} />
        </span>

        {/* Delete Icon */}
        <span className="text-red-500 cursor-pointer" onClick={handleDelete}>
          <AiOutlineDelete size={20} />
        </span>
      </div>

      {/* Edit Task Modal */}
      <EditModal
        isModalOpen={isModalOpen}
        setModalOpen={setIsModalOpen}
        task={task}
        editTaskMutation={editTaskMutation}
      />
    </div>
  );
};

export default TaskCard;
