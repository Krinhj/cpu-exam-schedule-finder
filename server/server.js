require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Example endpoint to test Supabase connection
app.get("/api/test", async (req, res) => {
  try {
    // Replace 'your_table' with your actual table name
    const { data, error } = await supabase
      .from("exam_periods")
      .select("*")
      .limit(1);

    if (error) throw error;

    res.json({
      success: true,
      message: "Successfully connected to Supabase",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error connecting to Supabase",
      error: error.message,
    });
  }
});

// Endpoint to get the active exam period
app.get("/api/active-exam-period", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("exam_periods")
      .select("school_year, semester, exam_type")
      .eq("is_active", true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No active exam period found
        return res.status(404).json({
          success: false,
          message: "No active exam period found",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: {
        school_year: data.school_year,
        semester: data.semester,
        exam_type: data.exam_type
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching active exam period",
      error: error.message,
    });
  }
});

// Endpoint to get exam schedule details
app.get("/api/exam-schedule", async (req, res) => {
  try {
    const { subject_code, class_time, class_days, teacher } = req.query;

    // Validate required parameters - only subject_code is required
    if (!subject_code) {
      return res.status(400).json({
        success: false,
        message: "Subject code is required",
      });
    }

    console.log("Starting flexible database query for:", { subject_code, class_time, class_days, teacher });

    // First, check if this is a room-only subject in the active exam period
    const { data: subjectData, error: subjectError } = await supabase
      .from("subjects")
      .select(`
        subject_code,
        is_room_only,
        room_list,
        time_blocks!inner (
          exam_date,
          start_time,
          end_time,
          exam_periods!inner (
            is_active
          )
        )
      `)
      .ilike("subject_code", subject_code)
      .eq("time_blocks.exam_periods.is_active", true);

    if (subjectError) {
      console.log('Subject query error:', subjectError);
      throw subjectError;
    }

    // Handle room-only subjects
    if (subjectData && subjectData.length > 0 && subjectData[0].is_room_only) {
      console.log("Found room-only subject");
      const roomOnlySchedule = {
        exam_date: subjectData[0].time_blocks.exam_date,
        start_time: subjectData[0].time_blocks.start_time,
        end_time: subjectData[0].time_blocks.end_time,
        exam_room: subjectData[0].room_list,
        proctor: "N/A - Room Only Subject",
        is_room_only: true
      };

      return res.json({
        success: true,
        data: [roomOnlySchedule], // Return as array for consistency
        total_results: 1,
        is_room_only: true
      });
    }

    // For regular subjects, build flexible query for active exam period only
    let query = supabase
      .from("class_rows")
      .select(`
        class_time,
        class_days,
        teacher,
        exam_room,
        proctor,
        subjects!inner (
          subject_code,
          time_blocks!inner (
            exam_date,
            start_time,
            end_time,
            exam_periods!inner (
              is_active
            )
          )
        )
      `)
      .ilike("subjects.subject_code", subject_code)
      .eq("subjects.time_blocks.exam_periods.is_active", true);

    // Add optional filters if provided
    if (class_time) {
      query = query.eq("class_time", class_time);
    }
    if (class_days) {
      query = query.eq("class_days", class_days);
    }
    if (teacher) {
      query = query.ilike("teacher", `%${teacher}%`); // Use case-insensitive partial match
    }

    // Limit results to prevent too many returns
    query = query.limit(15);

    const { data, error } = await query;

    console.log("Database query completed");

    if (error) {
      console.log('Database error:', error);
      throw error;
    }

    console.log(`Found ${data?.length || 0} results`);

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No exam schedules found for the given parameters",
      });
    }

    // Transform multiple results
    const examSchedules = data.map(row => ({
      exam_date: row.subjects.time_blocks.exam_date,
      start_time: row.subjects.time_blocks.start_time,
      end_time: row.subjects.time_blocks.end_time,
      exam_room: row.exam_room,
      proctor: row.proctor,
      subject_code: row.subjects.subject_code,
      class_time: row.class_time,
      class_days: row.class_days,
      teacher: row.teacher,
      is_room_only: false
    }));

    res.json({
      success: true,
      data: examSchedules,
      total_results: examSchedules.length,
      is_room_only: false
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching exam schedule",
      error: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
