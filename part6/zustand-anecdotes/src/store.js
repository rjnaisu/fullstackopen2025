import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import anecdoteService from "./services/anecdotes";

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: "",
  actions: {
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content);
      set((state) => ({ anecdotes: [...state.anecdotes, newAnecdote] }));
    },
    setFilter: (query) => set(() => ({ filter: query })),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll();
      set(() => ({ anecdotes }));
    },
    vote: async (id) => {
      const anecdote = get().anecdotes.find((a) => a.id === id);
      const increment = await anecdoteService.update(id, {
        ...anecdote,
        votes: anecdote.votes + 1,
      });
      set((state) => ({ anecdotes: state.anecdotes.map((a) => (a.id === id ? increment : a)) }));
    },
    deleteEntry: async (id) => {
      await anecdoteService.deleteEntry(id);
      set((state) => ({ anecdotes: state.anecdotes.filter((a) => a.id !== id) }));
    },
  },
}));

export const useAnecdotes = () => useAnecdoteStore((state) => state.anecdotes);
export const useFilter = () => useAnecdoteStore((state) => state.filter);
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions);
export const useAnecdotesToShow = () =>
  useAnecdoteStore(
    useShallow((state) => {
      const filtered = state.filter
        ? state.anecdotes.filter((a) =>
            a.content.toLowerCase().includes(state.filter.toLowerCase()),
          )
        : state.anecdotes;
      return filtered.toSorted((a, b) => b.votes - a.votes);
    }),
  );
export default useAnecdoteStore;
