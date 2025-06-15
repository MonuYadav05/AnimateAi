'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useProjects } from '@/hooks/use-projects';
import { useAuth } from '@/hooks/use-auth';
import { Plus, Settings, LogOut, FolderOpen, Sparkles, Loader2, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

export function Sidebar() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const { projects, currentProject, setCurrentProject, createProject } = useProjects();
  const { signOut } = useAuth();

  const handleCreateProject = async () => {
    if (!projectName.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    setIsCreating(true);

    try {
      const { data, error } = await createProject(projectName, projectDescription);

      if (error) {
        toast.error('Failed to create project');
      } else {
        setCurrentProject(data!);
        setIsCreateDialogOpen(false);
        setProjectName('');
        setProjectDescription('');
        toast.success('Project created successfully!');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  return (
    <div className="flex flex-col h-full w-80 glass-effect border-r border-white/10 shadow-glow">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <Sparkles className="h-7 w-7 text-blue-400 animate-float" />
            <div className="absolute inset-0 h-7 w-7 text-blue-400 animate-ping opacity-20">
              <Sparkles className="h-7 w-7" />
            </div>
          </div>
          <h1 className="font-montserrat font-bold text-xl gradient-text">
            AnimateAI
          </h1>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02] shadow-glow">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-effect border-white/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-montserrat gradient-text">Create New Project</DialogTitle>
              <DialogDescription className="text-slate-300">
                Start a new animation project. Give it a name and optional description.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="project-name" className="text-slate-200 font-medium">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="My Animation Project"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="project-description" className="text-slate-200 font-medium">Description (Optional)</Label>
                <Input
                  id="project-description"
                  placeholder="Describe what you want to animate..."
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="bg-white/5 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 min-h-[100px] resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateProject}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all duration-200"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects List */}
      <ScrollArea className="flex-1 p-4 scrollbar-thin">
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="text-center text-slate-400 py-12 animate-fade-in">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm font-medium mb-1">No projects yet</p>
              <p className="text-xs opacity-75">Create your first project to get started</p>
            </div>
          ) : (
            projects.map((project, index) => (
              <Button
                key={project.id}
                variant={currentProject?.id === project.id ? 'secondary' : 'ghost'}
                className={`w-full justify-start h-auto p-4 text-left transition-all duration-200 animate-fade-in ${currentProject?.id === project.id
                  ? 'bg-blue-500/20 border border-blue-400/30 shadow-glow text-blue-100'
                  : 'hover:bg-white/5 border border-transparent hover:border-white/10 text-slate-300 hover:text-white'
                  }`}
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setCurrentProject(project)}
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate mb-1">{project.name}</div>
                  {project.description && (
                    <div className="text-xs opacity-75 truncate mb-2">
                      {project.description}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-xs opacity-60">
                    <Calendar className="h-3 w-3" />
                    {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <Settings className="h-4 w-4 mr-3" />
          Settings
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}