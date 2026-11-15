-- ==============================================================================
-- FORGE OS: PostgreSQL Relational Schema & Row Level Security (RLS) Migrations
-- Target Database: Supabase PostgreSQL
-- Timezone: Asia/Kolkata
-- ==============================================================================

-- 1. Profiles Table (Derived from auth.uid())
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    degree TEXT DEFAULT 'B.Tech Computer Science Engineering',
    current_year INT DEFAULT 2,
    current_semester INT DEFAULT 3,
    github_username TEXT,
    onboarding_completed BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('Asia/Kolkata', NOW()),
    updated_at TIMESTAMPTZ DEFAULT timezone('Asia/Kolkata', NOW())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only read own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can only update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid());

-- 2. User Settings Table
CREATE TABLE IF NOT EXISTS public.user_settings (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    daily_study_hours NUMERIC(3,1) DEFAULT 2.5,
    academic_mode VARCHAR(20) DEFAULT 'normal' CHECK (academic_mode IN ('normal', 'examination', 'vacation')),
    exam_start_date DATE,
    exam_end_date DATE,
    notification_time TIME DEFAULT '18:00:00',
    browser_notifications_enabled BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT timezone('Asia/Kolkata', NOW())
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own settings"
    ON public.user_settings FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- 3. Roadmap Phases (1 to 6)
CREATE TABLE IF NOT EXISTS public.roadmap_phases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    phase_number INT NOT NULL CHECK (phase_number BETWEEN 1 AND 6),
    name TEXT NOT NULL,
    focus_area TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    weeks_count INT DEFAULT 13,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
    major_project_title TEXT,
    checkpoint_title TEXT,
    UNIQUE(user_id, phase_number)
);

ALTER TABLE public.roadmap_phases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own roadmap phases"
    ON public.roadmap_phases FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- 4. Daily Plans Table
CREATE TABLE IF NOT EXISTS public.daily_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    phase_number INT NOT NULL,
    week_number INT NOT NULL,
    day_number INT NOT NULL,
    day_title TEXT NOT NULL,
    daily_objective TEXT,
    planned_hours NUMERIC(3,1) DEFAULT 2.5,
    actual_hours NUMERIC(3,1) DEFAULT 0.0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'rest_day')),
    mode VARCHAR(20) DEFAULT 'normal',
    created_at TIMESTAMPTZ DEFAULT timezone('Asia/Kolkata', NOW()),
    UNIQUE(user_id, date)
);

ALTER TABLE public.daily_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own daily plans"
    ON public.daily_plans FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- 5. Learning Tasks Table
CREATE TABLE IF NOT EXISTS public.learning_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_plan_id UUID NOT NULL REFERENCES public.daily_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    session_type VARCHAR(20) NOT NULL CHECK (session_type IN ('dsa', 'engineering', 'practice', 'reasoning', 'academic')),
    topic TEXT NOT NULL,
    objective TEXT NOT NULL,
    duration_minutes INT NOT NULL,
    priority VARCHAR(10) DEFAULT 'p0' CHECK (priority IN ('p0', 'p1', 'p2')),
    status VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed', 'skipped')),
    visual_lesson_id TEXT,
    challenge_prompt TEXT,
    evidence_required BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    reflection_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('Asia/Kolkata', NOW())
);

ALTER TABLE public.learning_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own learning tasks"
    ON public.learning_tasks FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- 6. Evidence Table
CREATE TABLE IF NOT EXISTS public.evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.learning_tasks(id) ON DELETE SET NULL,
    evidence_type VARCHAR(30) NOT NULL CHECK (evidence_type IN ('github_repo', 'github_commit', 'github_pr', 'deployed_url', 'screenshot', 'file_upload', 'technical_writeup', 'test_results')),
    title TEXT NOT NULL,
    url TEXT,
    file_path TEXT,
    file_size_bytes BIGINT,
    mime_type TEXT,
    verification_level INT DEFAULT 1 CHECK (verification_level BETWEEN 1 AND 5),
    verification_metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT timezone('Asia/Kolkata', NOW())
);

ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own evidence"
    ON public.evidence FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- 7. DSA Problems & Spaced Repetition Queue
CREATE TABLE IF NOT EXISTS public.dsa_problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    platform VARCHAR(30) DEFAULT 'leetcode',
    url TEXT,
    topic VARCHAR(50) NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    language VARCHAR(20) DEFAULT 'cpp',
    solved_independently BOOLEAN DEFAULT true,
    used_hints BOOLEAN DEFAULT false,
    brute_force_notes TEXT,
    optimal_notes TEXT,
    time_complexity VARCHAR(20) NOT NULL,
    space_complexity VARCHAR(20) NOT NULL,
    first_solved_at TIMESTAMPTZ DEFAULT timezone('Asia/Kolkata', NOW())
);

ALTER TABLE public.dsa_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own DSA problems"
    ON public.dsa_problems FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.revision_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_id UUID NOT NULL REFERENCES public.dsa_problems(id) ON DELETE CASCADE,
    interval_stage INT DEFAULT 1 CHECK (interval_stage BETWEEN 1 AND 4),
    next_revision_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'archived')),
    repetition_count INT DEFAULT 0,
    last_reviewed_at TIMESTAMPTZ,
    UNIQUE(user_id, problem_id)
);

ALTER TABLE public.revision_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own revision queue"
    ON public.revision_queue FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- 8. Skill Matrix Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category VARCHAR(30) NOT NULL,
    name TEXT NOT NULL,
    current_level INT DEFAULT 0 CHECK (current_level BETWEEN 0 AND 5),
    target_level INT DEFAULT 4 CHECK (target_level BETWEEN 1 AND 5),
    last_practiced_at TIMESTAMPTZ,
    UNIQUE(user_id, name)
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own skills"
    ON public.skills FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- 9. Engineering Journal Entries Table
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    entry_type VARCHAR(30) DEFAULT 'daily' CHECK (entry_type IN ('daily', 'weekly', 'architecture_decision')),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    key_learnings TEXT[],
    blockers TEXT[],
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT timezone('Asia/Kolkata', NOW())
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own journal entries"
    ON public.journal_entries FOR ALL
    TO authenticated
    USING (user_id = auth.uid());

-- 10. Corrected Atomic Task Completion Function (Fixing AND/OR Precedence)
CREATE OR REPLACE FUNCTION record_task_completion_atomic(
    p_task_id UUID,
    p_problem_id UUID DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_task RECORD;
    v_today DATE := (NOW() AT TIME ZONE 'Asia/Kolkata')::DATE;
BEGIN
    -- Verify task ownership and fetch details
    SELECT * INTO v_task 
    FROM public.learning_tasks 
    WHERE id = p_task_id AND user_id = v_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Task not found or access denied';
    END IF;

    -- Idempotent check: if already completed, do nothing
    IF v_task.status = 'completed' THEN
        RETURN jsonb_build_object('success', true, 'message', 'Already completed');
    END IF;

    -- 1. Mark task complete
    UPDATE public.learning_tasks
    SET status = 'completed', completed_at = timezone('Asia/Kolkata', NOW())
    WHERE id = p_task_id AND user_id = v_user_id;

    -- 2. Update Daily Plan actual hours atomically
    UPDATE public.daily_plans
    SET actual_hours = actual_hours + (v_task.duration_minutes / 60.0),
        status = CASE 
            WHEN NOT EXISTS (
                SELECT 1 FROM public.learning_tasks 
                WHERE daily_plan_id = v_task.daily_plan_id AND status != 'completed'
            ) THEN 'completed'
            ELSE 'in_progress'
        END
    WHERE id = v_task.daily_plan_id AND user_id = v_user_id;

    -- 3. If DSA problem is linked, add to revision queue
    IF p_problem_id IS NOT NULL THEN
        INSERT INTO public.revision_queue (user_id, problem_id, interval_stage, next_revision_date, status)
        VALUES (v_user_id, p_problem_id, 1, v_today + INTERVAL '1 day', 'pending')
        ON CONFLICT (user_id, problem_id) DO UPDATE 
        SET next_revision_date = v_today + INTERVAL '1 day', status = 'pending';
    END IF;

    -- 4. Corrected Skill Update Query (Explicit Parentheses to fix AND/OR precedence bug)
    UPDATE public.skills
    SET last_practiced_at = timezone('Asia/Kolkata', NOW())
    WHERE user_id = v_user_id 
      AND (name = 'C++' OR name = 'DSA' OR name = 'JavaScript ES6+ Deep Dive');

    RETURN jsonb_build_object('success', true, 'taskId', p_task_id, 'date', v_today);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

