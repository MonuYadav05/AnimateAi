/*
  # Create messages table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `content` (text, not null)
      - `role` (text, 'user' or 'assistant')
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `messages` table
    - Add policy for users to manage messages in their projects
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  role text CHECK (role IN ('user', 'assistant')) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage messages in their projects"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = messages.project_id 
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = messages.project_id 
      AND projects.user_id = auth.uid()
    )
  );