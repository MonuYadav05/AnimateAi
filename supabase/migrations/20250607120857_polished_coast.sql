/*
  # Create animations table

  1. New Tables
    - `animations`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to projects)
      - `video_url` (text, nullable - populated when rendering completes)
      - `manim_code` (text, nullable - the generated Python code)
      - `status` (text, 'pending', 'rendering', 'completed', 'error')
      - `error_message` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `animations` table
    - Add policy for users to manage animations in their projects
*/

CREATE TABLE IF NOT EXISTS animations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  video_url text,
  manim_code text,
  status text CHECK (status IN ('pending', 'rendering', 'completed', 'error')) DEFAULT 'pending',
  error_message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE animations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage animations in their projects"
  ON animations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = animations.project_id 
      AND projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = animations.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Trigger to automatically update updated_at
CREATE TRIGGER update_animations_updated_at
  BEFORE UPDATE ON animations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();