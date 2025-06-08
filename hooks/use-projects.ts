'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store/auth-store';
import { useAppStore } from '@/lib/store/app-store';
import { supabase } from '@/lib/supabase/client';
import { Project } from '@/lib/supabase/types';

export function useProjects() {
  const { user } = useAuthStore();
  const { 
    projects, 
    currentProject, 
    setProjects, 
    setCurrentProject, 
    addProject,
    updateProject 
  } = useAppStore();

  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);

  const fetchProjects = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }

    setProjects(data || []);
  };

  const createProject = async (name: string, description?: string) => {
    if (!user) return { error: new Error('User not authenticated') };

    const { data, error } = await supabase
      .from('projects')
      .insert({
        name,
        description,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return { error };
    }

    addProject(data);
    return { data, error: null };
  };

  const updateProjectDetails = async (projectId: string, updates: Partial<Project>) => {
    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', projectId)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      return { error };
    }

    updateProject(data);
    return { data, error: null };
  };

  const deleteProject = async (projectId: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (error) {
      console.error('Error deleting project:', error);
      return { error };
    }

    setProjects(projects.filter(p => p.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }

    return { error: null };
  };

  return {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    updateProject: updateProjectDetails,
    deleteProject,
    refreshProjects: fetchProjects,
  };
}