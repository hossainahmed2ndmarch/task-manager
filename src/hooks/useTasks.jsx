import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { useEffect } from "react";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const socket = io("https://task-manager-server-0x8m.onrender.com",{
  transports: ["websocket", "polling"],
}); // Connect to Socket.io server

const useTasks = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch tasks
  const { data: tasksData = [], refetch } = useQuery({
    queryKey: ["tasks", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email, // Ensure email exists before fetching
  });

  // Add Task
  const addTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const res = await axiosSecure.post("/tasks", newTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.email]); // Refetch tasks after adding
    },
  });

  // Update Task Order (After Dragging)
  const updateTaskMutation = useMutation({
    mutationFn: async ({ updatedTasks }) => {
      const res = await axiosSecure.patch("/tasks/update-order", {
        updatedTasks,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.email]);
    },
  });
  // Edit Task
  const editTaskMutation = useMutation({
    mutationFn: async ({ id, editedTask }) => {
      const res = await axiosSecure.patch(`/tasks/${id}`, {
        title: editedTask.title,
        description: editedTask.description,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.email]);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/tasks/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.email]);
    },
  });

  // Real-time listener for task updates
  useEffect(() => {
    socket.on("task_updated", () => {
      refetch(); // Fetch latest tasks when an update occurs
    });

    return () => {
      socket.off("task_updated");
    };
  }, [refetch]);

  return {
    tasksData,
    addTaskMutation,
    updateTaskMutation,
    editTaskMutation,
    deleteTaskMutation,
    refetch,
  };
};

export default useTasks;
