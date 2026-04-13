import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createAnecdote, getAnecdotes, updateAnecdote } from "../requests";
import useNotification from "./useNotify";

export const useAnecdotes = () => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  const result = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
  });

  const sortedResult = result.data ? [...result.data].sort((a, b) => b.votes - a.votes) : [];

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      queryClient.setQueryData(["anecdotes"], (anecdotes) =>
        anecdotes.map((anecdote) =>
          anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote,
        ),
      );
      showNotification(`Voted for: ${updatedAnecdote.content}`);
    },
    onError: (error) => {
      showNotification(error.message);
    },
  });

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.setQueryData(["anecdotes"], (anecdotes) => [...anecdotes, newAnecdote]);
      showNotification(`Added: ${newAnecdote.content}`);
    },
    onError: (error) => {
      showNotification(error.message);
    },
  });

  return {
    anecdotes: sortedResult,
    isPending: result.isPending,
    vote: (anecdote) => {
      updateAnecdoteMutation.mutate({
        ...anecdote,
        votes: anecdote.votes + 1,
      });
    },
    addAnecdote: (content) => {
      newAnecdoteMutation.mutate({ content });
    },
  };
};
