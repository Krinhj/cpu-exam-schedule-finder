# CPU Exam Schedule Finder - API Server

Express.js backend API for the CPU Exam Schedule Finder application.

**Live API:** Deployed on Render

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (see below)
# Copy .env.example to .env and configure

# Start development server
npm start
```

## 🔧 Environment Setup

Create a `.env` file in the server directory:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# Server Configuration
PORT=3000
```

## 📡 API Endpoints

### GET `/api/test`
Test database connection and API functionality.

**Response:**
```json
{
  "success": true,
  "message": "Successfully connected to Supabase",
  "data": [...]
}
```

### GET `/api/active-exam-period`
Get the currently active exam period information.

**Response:**
```json
{
  "success": true,
  "data": {
    "school_year": "2025-2026",
    "semester": "First",
    "exam_type": "Prelim"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "No active exam period found"
}
```

### GET `/api/exam-schedule`
Search for exam schedules with flexible filtering.

**Query Parameters:**
- `subject_code` (required) - Subject code to search for
- `class_time` (optional) - Class time in format "HHMM-HHMM" (e.g., "1430-1530")
- `class_days` (optional) - Class days (e.g., "MW", "TTh")
- `teacher` (optional) - Teacher name (partial match supported)

**Example Request:**
```
GET /api/exam-schedule?subject_code=GESocSci 4&teacher=Prof. Smith
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "exam_date": "2025-09-15",
      "start_time": "08:30",
      "end_time": "10:00",
      "exam_room": "Room 101",
      "proctor": "Prof. Smith, J",
      "subject_code": "GESocSci 4",
      "class_time": "1430-1530",
      "class_days": "MW",
      "teacher": "Prof. Smith, J",
      "is_room_only": false
    }
  ],
  "total_results": 1,
  "is_room_only": false
}
```

**Room-Only Subject Response:**
```json
{
  "success": true,
  "data": [
    {
      "exam_date": "2025-09-15",
      "start_time": "08:30",
      "end_time": "10:00",
      "exam_room": "Gym A, Gym B",
      "proctor": "N/A - Room Only Subject",
      "subject_code": "PE 2",
      "is_room_only": true
    }
  ],
  "total_results": 1,
  "is_room_only": true
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "No exam schedules found for the given parameters"
}
```

## 🗄️ Database Schema

The API connects to a Supabase PostgreSQL database with the following structure:

```
exam_periods
├── id (uuid, primary key)
├── school_year (text)
├── semester (text)
├── exam_type (text)
├── is_active (boolean)
└── created_at (timestamp)

time_blocks
├── id (uuid, primary key)
├── exam_period_id (uuid, foreign key)
├── exam_date (date)
├── start_time (time)
├── end_time (time)
└── created_at (timestamp)

subjects
├── id (uuid, primary key)
├── time_block_id (uuid, foreign key)
├── subject_code (text)
├── is_room_only (boolean)
├── room_list (text)
└── created_at (timestamp)

class_rows
├── id (uuid, primary key)
├── subject_id (uuid, foreign key)
├── class_time (text)
├── class_days (text)
├── teacher (text)
├── proctor (text)
├── exam_room (text)
└── created_at (timestamp)
```

## 🔍 Search Logic

The API implements flexible search logic:

1. **Room-Only Subjects**: Special handling for subjects that only need room assignments
2. **Flexible Filtering**: Supports searching by subject code only, or with additional filters
3. **Partial Matching**: Teacher names support case-insensitive partial matches
4. **Active Period Only**: All searches are limited to the currently active exam period
5. **Result Limiting**: Maximum 15 results returned to prevent excessive data transfer

## 🌐 Deployment (Render)

1. **Connect Repository** - Link your GitHub repository to Render
2. **Set Environment Variables:**
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   PORT=3000
   ```
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`

### Health Checks
Use the `/api/test` endpoint for health monitoring and database connectivity checks.

## 🛠️ Development Notes

- **CORS Enabled** - Configured to accept requests from frontend applications
- **Error Handling** - Proper HTTP status codes and error messages
- **Logging** - Console logging for debugging and monitoring
- **Security** - Uses Supabase's built-in security features
- **Performance** - Efficient database queries with proper indexing

## 📦 Dependencies

**Runtime Dependencies:**
- express (5.x) - Web application framework
- @supabase/supabase-js - Database client
- cors - Cross-origin resource sharing
- dotenv - Environment variable management

**No Dev Dependencies** - Simple Node.js application

## 🧪 Testing

Manual testing endpoints:
- `GET /api/test` - Database connection test
- `GET /api/active-exam-period` - Active period retrieval
- `GET /api/exam-schedule?subject_code=TEST` - Search functionality

## 🔒 Security Considerations

- Environment variables for sensitive configuration
- Supabase handles database security and access control
- Input validation on required parameters
- No direct SQL injection vulnerabilities (using Supabase client)
- CORS configured for specific frontend domains in production

## 📝 Logging

The server logs:
- Startup confirmation with port number
- Database query parameters for debugging
- Error messages for troubleshooting
- Search result counts for monitoring