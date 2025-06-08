'use client';

import { create } from 'zustand';
import { Project, Message, Animation } from '@/lib/supabase/types';

interface AppState {
  // Projects
  projects: Project[];
  currentProject: Project | null;
  setProjects: (projects: Project[]) => void;
  setCurrentProject: (project: Project | null) => void;
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;

  // Messages
  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  
  // Animations
  animations: Animation[];
  currentAnimation: Animation | null;
  setAnimations: (animations: Animation[]) => void;
  setCurrentAnimation: (animation: Animation | null) => void;
  addAnimation: (animation: Animation) => void;
  updateAnimation: (animation: Animation) => void;

  // UI State
  isGenerating: boolean;
  setIsGenerating: (isGenerating: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Projects
  projects: [],
  currentProject: null,
  setProjects: (projects) => set({ projects }),
  setCurrentProject: (currentProject) => set({ currentProject }),
  addProject: (project) => set({ projects: [...get().projects, project] }),
  updateProject: (updatedProject) => set({
    projects: get().projects.map(p => p.id === updatedProject.id ? updatedProject : p),
    currentProject: get().currentProject?.id === updatedProject.id ? updatedProject : get().currentProject
  }),

  // Messages
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set({ messages: [...get().messages, message] }),

  // Animations
  animations: [],
  currentAnimation: null,
  setAnimations: (animations) => set({ animations }),
  setCurrentAnimation: (currentAnimation) => set({ currentAnimation }),
  addAnimation: (animation) => set({ animations: [...get().animations, animation] }),
  updateAnimation: (updatedAnimation) => set({
    animations: get().animations.map(a => a.id === updatedAnimation.id ? updatedAnimation : a),
    currentAnimation: get().currentAnimation?.id === updatedAnimation.id ? updatedAnimation : get().currentAnimation
  }),

  // UI State
  isGenerating: false,
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));