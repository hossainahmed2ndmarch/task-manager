import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { useEffect } from "react";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const socket = io("http://localhost:5000"); // Connect to Socket.io server

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
    mutationFn: async ({ id, updatedTask }) => {
      const res = await axiosSecure.patch(`/tasks/${id}`, updatedTask);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks", user?.email]); // Refetch tasks after update
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

  return { tasksData, addTaskMutation, updateTaskMutation, refetch };
};

export default useTasks;
