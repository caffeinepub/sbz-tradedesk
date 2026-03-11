import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { DocumentInput, UserRole } from "../backend.d";
import { useActor } from "./useActor";

// ── User Queries ──────────────────────────────────────────────
export function useCallerProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerProfile"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCallerRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerRole"],
    queryFn: async () => {
      if (!actor) return "guest";
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllUsers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !isFetching,
  });
}

// ── Document Queries ──────────────────────────────────────────
export function useUserDocuments() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userDocuments"],
    queryFn: async () => {
      if (!actor) return [];
      const profile = await actor.getCallerUserProfile();
      if (!profile) return [];
      return actor.listUserDocuments(profile.id);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllDocuments() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allDocuments"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDocuments();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDocument(docId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["document", docId],
    queryFn: async () => {
      if (!actor || !docId) return null;
      return actor.getDocument(docId);
    },
    enabled: !!actor && !isFetching && !!docId,
  });
}

export function useSearchDocuments(field: string, value: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["searchDocuments", field, value],
    queryFn: async () => {
      if (!actor || !value) return [];
      return actor.searchDocumentsByField(field, value);
    },
    enabled: !!actor && !isFetching && !!value,
  });
}

// ── Mutations ─────────────────────────────────────────────────
export function useCreateDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: DocumentInput) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createDocument(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
    },
  });
}

export function useUpdateDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      docId,
      input,
    }: { docId: string; input: DocumentInput }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateDocument(docId, input);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["document", vars.docId] });
      queryClient.invalidateQueries({ queryKey: ["userDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
    },
  });
}

export function useDeleteDocument() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (docId: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteDocument(docId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userDocuments"] });
      queryClient.invalidateQueries({ queryKey: ["allDocuments"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.saveCallerUserProfile(name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useUpdateUserName() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newName: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateUserName(newName);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["callerProfile"] });
    },
  });
}

export function useAssignRole() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.assignCallerUserRole(user, role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allUsers"] });
    },
  });
}
