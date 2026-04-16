import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import blogService from "../services/blogs";

export const useBlogs = (showNotification) => {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey: ["blogs"],
    queryFn: blogService.getAll,
    refetchOnWindowFocus: false,
  });

  const createBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.setQueryData(["blogs"], (blogs = []) => [...blogs, newBlog]);
      showNotification(`A new blog ${newBlog.title} by ${newBlog.author} added!`);
    },
    onError: () => {
      showNotification("Error creating blog", "error");
    },
  });

  const likeBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: (updatedBlog) => {
      queryClient.setQueryData(["blogs"], (blogs = []) =>
        blogs.map((blog) => (blog.id === updatedBlog.id ? { ...blog, ...updatedBlog } : blog)),
      );
    },
    onError: () => {
      showNotification("Error liking blog", "error");
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(["blogs"], (blogs = []) =>
        blogs.filter((blog) => blog.id !== deletedId),
      );
    },
    onError: () => {
      showNotification("Oops! error deleting blog", "error");
    },
  });

  const blogs = result.data ?? [];
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return {
    blogs: sortedBlogs,
    isPending: result.isPending,
    addBlog: (blog) => {
      createBlogMutation.mutate(blog);
    },
    likeBlog: (blog) => {
      likeBlogMutation.mutate({
        ...blog,
        likes: blog.likes + 1,
        user: blog.user.id,
      });
    },
    deleteBlog: async (blog) => {
      try {
        await deleteBlogMutation.mutateAsync(blog.id);
        showNotification(`Removed blog: ${blog.title}`);
        return true;
      } catch {
        return false;
      }
    },
  };
};
