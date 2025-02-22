import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";
import EditModal from "./EditModal";
import Swal from "sweetalert2";
import moment from "moment";

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
      className="p-4 bg-[#d7f2f5] shadow rounded-lg mb-2 flex justify-between items-center w-full overflow-hidden"
    >
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-[#22b0bd] truncate">{task.title}</h3>
        <p className="text-sm break-words overflow-hidden text-ellipsis">
          {task.description}
        </p>

        {/* Timestamp */}
        <p className="text-xs text-gray-500 mt-1">
          {moment(task?.timestamp).format("MMMM Do YYYY, h:mm A")}
        </p>
      </div>

      {/* Icons (Edit & Delete) */}
      <div className="flex gap-2">
        <span
          className="text-[#22b0bd] cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <AiOutlineEdit size={20} />
        </span>

        <span className="text-[#22b0bd] cursor-pointer" onClick={handleDelete}>
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
