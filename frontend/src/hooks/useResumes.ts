import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resumeService, ResumeCreate, Resume } from "../services/resumeService.ts";

export const useResumesQuery = (page = 1, limit = 10, search = "") => {
  return useQuery({
    queryKey: ["resumes", page, limit, search],
    queryFn: () => resumeService.listResumes(page, limit, search),
  });
};

export const useCreateResumeMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: ResumeCreate) => resumeService.createResume(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
};

export const useDeleteResumeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resumeService.deleteResume(id),
    // Optimistic Update configuration
    onMutate: async (deletedId: string) => {
      // Cancel outgoing queries so they do not overwrite the optimistic cache update
      await queryClient.cancelQueries({ queryKey: ["resumes"] });

      // Snapshot the current cache state for all "resumes" queries
      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.findAll({ queryKey: ["resumes"] });
      const previousQueries = queries.map((q) => ({
        queryKey: q.queryKey,
        state: q.state.data,
      }));

      // Optimistically update caches
      queries.forEach((q) => {
        const oldData: any = q.state.data;
        if (oldData && oldData.items) {
          queryClient.setQueryData(q.queryKey, {
            ...oldData,
            items: oldData.items.filter((item: Resume) => item.id !== deletedId),
          });
        }
      });

      // Return context carrying snapshot data for potential error rollbacks
      return { previousQueries };
    },
    onError: (_err, _deletedId, context) => {
      // Rollback cache state if the server operation failed
      if (context?.previousQueries) {
        context.previousQueries.forEach((q) => {
          queryClient.setQueryData(q.queryKey, q.state);
        });
      }
    },
    onSettled: () => {
      // Refetch after completion to confirm state matches DB exactly
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
};

export const useDuplicateResumeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (resume: Resume) => {
      // Call create api with modified title
      return resumeService.createResume({
        title: `${resume.title} (Copy)`,
        summary: resume.summary,
        template: resume.template,
      });
    },
    // Optimistic Update configuration
    onMutate: async (resumeToDuplicate: Resume) => {
      await queryClient.cancelQueries({ queryKey: ["resumes"] });

      const queryCache = queryClient.getQueryCache();
      const queries = queryCache.findAll({ queryKey: ["resumes"] });
      const previousQueries = queries.map((q) => ({
        queryKey: q.queryKey,
        state: q.state.data,
      }));

      // Generate a mock duplicated item for instant UI update
      const tempDuplicatedResume: Resume = {
        ...resumeToDuplicate,
        id: `temp-id-${Math.random()}`,
        title: `${resumeToDuplicate.title} (Copy)`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queries.forEach((q) => {
        const oldData: any = q.state.data;
        if (oldData && oldData.items) {
          queryClient.setQueryData(q.queryKey, {
            ...oldData,
            items: [tempDuplicatedResume, ...oldData.items],
          });
        }
      });

      return { previousQueries };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousQueries) {
        context.previousQueries.forEach((q) => {
          queryClient.setQueryData(q.queryKey, q.state);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
  });
};
