-- Enable Row Level Security
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;

-- Create policies for User table
CREATE POLICY "Users can view their own profile"
    ON "User" FOR SELECT
    USING (auth.uid()::text = id);

CREATE POLICY "Users can update their own profile"
    ON "User" FOR UPDATE
    USING (auth.uid()::text = id);

-- Create policies for Post table
CREATE POLICY "Users can view their own posts"
    ON "Post" FOR SELECT
    USING (auth.uid()::text = "userId");

CREATE POLICY "Users can create their own posts"
    ON "Post" FOR INSERT
    WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update their own posts"
    ON "Post" FOR UPDATE
    USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete their own posts"
    ON "Post" FOR DELETE
    USING (auth.uid()::text = "userId");
