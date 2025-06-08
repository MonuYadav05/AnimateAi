export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          project_id: string;
          content: string;
          role: 'user' | 'assistant';
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          content: string;
          role: 'user' | 'assistant';
          created_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          content?: string;
          role?: 'user' | 'assistant';
          created_at?: string;
        };
      };
      animations: {
        Row: {
          id: string;
          project_id: string;
          video_url: string | null;
          manim_code: string | null;
          status: 'pending' | 'rendering' | 'completed' | 'error';
          error_message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          video_url?: string | null;
          manim_code?: string | null;
          status?: 'pending' | 'rendering' | 'completed' | 'error';
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          video_url?: string | null;
          manim_code?: string | null;
          status?: 'pending' | 'rendering' | 'completed' | 'error';
          error_message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Project = Database['public']['Tables']['projects']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type Animation = Database['public']['Tables']['animations']['Row'];