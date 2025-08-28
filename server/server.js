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

// Endpoint to get exam schedule details
app.get("/api/exam-schedule", async (req, res) => {
  try {
    const { subject_code, class_time, class_days, teacher } = req.query;

    // Validate required parameters
    if (!subject_code || !class_time || !class_days || !teacher) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters",
      });
    }

    const { data, error } = await supabase
      .from("class_rows")
      .select(
        `
        exam_room,
        proctor,
        subjects!inner (
          subject_code,
          time_blocks!inner (
            exam_date,
            start_time,
            end_time
          )
        )
      `
      )
      .eq("subjects.subject_code", subject_code)
      .eq("class_time", class_time)
      .eq("class_days", class_days)
      .eq("teacher", teacher)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No exam schedule found for the given parameters",
      });
    }

    // Transform the response to match the desired format
    const examSchedule = {
      exam_date: data.subjects.time_blocks.exam_date,
      start_time: data.subjects.time_blocks.start_time,
      end_time: data.subjects.time_blocks.end_time,
      exam_room: data.exam_room,
      proctor: data.proctor,
    };

    res.json({
      success: true,
      data: examSchedule,
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
