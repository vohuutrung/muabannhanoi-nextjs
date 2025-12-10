import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://kbmuhwkemyrvmmlejtbb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtibXVod2tlbXlydm1tbGVqdGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA1NTQsImV4cCI6MjA4MDUwNjU1NH0.cxlWlIO9VE3NVx9OrvID4AOaRG6yecIqjbICMXW4oSE"
);
