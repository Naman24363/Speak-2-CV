# Speak2CV

A Django-based voice-enabled resume builder. Create professional resumes by typing or speaking, preview in real-time, and export to PDF or Word.

## Features

- **Resume Builder** - Create structured resumes with education, experience, projects, and skills
- **Voice Input** - Dictate content using speech recognition (Web Speech API)
- **Live Preview** - See your formatted resume as you edit
- **PDF Export** - Generate professional PDF documents
- **DOCX Export** - Download as Word files for further editing
- **Multiple Resumes** - Create and manage different resume versions

## Tech Stack

- **Backend:** Django 6.0
- **Database:** SQLite (default)
- **PDF Generation:** ReportLab
- **Word Export:** python-docx
- **Speech Recognition:** Web Speech API (browser-based)

## Project Structure

```
speak2cv/
├── builder/                 # Main application
│   ├── models.py           # Resume data model
│   ├── views.py            # Request handlers & export logic
│   ├── urls.py             # URL routing
│   └── management/         # Custom Django commands
├── config/                  # Project settings
├── static/
│   ├── css/                # Stylesheets
│   └── js/                 # JavaScript (speech input, UI)
├── templates/              # HTML templates
└── requirements.txt
```

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/speak2cv.git
cd speak2cv
```

### 2. Create virtual environment

```bash
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Linux/Mac
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Create .env file

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
```

### 5. Run migrations

```bash
python manage.py migrate
```

### 6. Run development server

```bash
python manage.py runserver
```

Visit `http://127.0.0.1:8000` in your browser.

## How to Use

1. Click **New Resume** on the home page
2. Fill in basic info (name, email, phone, location)
3. Add sections: education, work experience, projects, skills
4. Use the **microphone icon** to dictate content via voice
5. Preview your formatted resume
6. Export as **PDF** or **DOCX**

💡 **Tip:** Voice input works best in Chrome/Edge browsers with microphone permissions enabled.

## Environment Variables

| Variable        | Description                     |
| --------------- | ------------------------------- |
| `SECRET_KEY`    | Django secret key               |
| `DEBUG`         | Set to `False` in production    |
| `ALLOWED_HOSTS` | Comma-separated allowed domains |
