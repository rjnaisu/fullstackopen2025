import { beforeEach, vi, it, expect } from "vitest";
import useAnecdoteStore, { useAnecdoteActions, useAnecdotes, useAnecdotesToShow } from "./store";
import anecdoteService from "./services/anecdotes";
import { renderHook, act } from "@testing-library/react";

vi.mock("./services/anecdotes", () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    deleteEntry: vi.fn(),
  },
}));

beforeEach(() => {
  useAnecdoteStore.setState({ anecdotes: [], filter: "" });
  vi.clearAllMocks();
});

it("initializes anecdotes from service", async () => {
  const mockAnecdotes = [{ content: "foo", id: null, votes: 0 }];
  anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

  const { result } = renderHook(() => useAnecdoteActions());

  await act(async () => {
    await result.current.initialize();
  });

  const { result: anecdotesResult } = renderHook(() => useAnecdotes());
  expect(anecdotesResult.current).toEqual(mockAnecdotes);
});

it("List receives sorted anecdotes", async () => {
  const mockAnecdotes = [
    { content: "no votes", id: null, votes: 0 },
    { content: "five votes", id: null, votes: 5 },
    { content: "most votes", id: null, votes: 10 },
  ];
  anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

  const { result } = renderHook(() => useAnecdoteActions());

  await act(async () => {
    await result.current.initialize();
  });

  const { result: anecdotesResult } = renderHook(() => useAnecdotesToShow());
  expect(anecdotesResult.current).toEqual([
    { content: "most votes", id: null, votes: 10 },
    { content: "five votes", id: null, votes: 5 },
    { content: "no votes", id: null, votes: 0 },
  ]);
});

it("properly filtered list of anecdotes", async () => {
  const mockAnecdotes = [
    { content: "no votes", id: null, votes: 0 },
    { content: "five votes", id: null, votes: 5 },
    { content: "most votes", id: null, votes: 10 },
  ];
  useAnecdoteStore.setState({ anecdotes: mockAnecdotes, filter: "five" });

  const { result } = renderHook(() => useAnecdotesToShow());

  expect(result.current).toEqual([{ content: "five votes", id: null, votes: 5 }]);
});

it("Increments vote", async () => {
  const mockAnecdotes = [{ content: "five votes", id: "1", votes: 5 }];
  useAnecdoteStore.setState({ anecdotes: mockAnecdotes, filter: "" });
  anecdoteService.update.mockResolvedValue({
    content: "five votes",
    id: "1",
    votes: 6,
  });

  const { result } = renderHook(() => useAnecdoteActions());

  await act(async () => {
    await result.current.vote("1");
  });

  const { result: voteResult } = renderHook(() => useAnecdotes());
  expect(anecdoteService.update).toHaveBeenCalledWith("1", {
    content: "five votes",
    id: "1",
    votes: 6,
  });
  expect(voteResult.current[0].votes).toBe(6);
});
