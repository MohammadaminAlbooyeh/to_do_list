# To-Do List Application

This is a full-stack To-Do List application built with a React frontend and a Flask backend, containerized using Docker and orchestrated with Docker Compose.

## Features
- Add, edit, and delete to-do items
- Persistent storage using SQLite
- RESTful API backend
- Responsive React UI
- Easy deployment with Docker

## Project Structure

```
to_do_list/
├── backend/
│   ├── app.py           # Flask API server
│   ├── Dockerfile       # Backend Docker image
│   ├── requirements.txt # Backend Python dependencies
│   └── todo.db          # SQLite database
├── frontend/
│   ├── App.js           # Main React component
│   ├── Dockerfile       # Frontend Docker image
│   ├── index.js         # React entry point
│   ├── package.json     # Frontend dependencies
│   ├── public/
│   │   └── index.html   # HTML template
│   └── src/
│       ├── App.js       # React app logic
│       └── index.js     # React app entry
├── docker-compose.yml   # Multi-container orchestration
├── requirements.txt     # (Optional) root dependencies
└── README.md            # Project documentation
```

## Prerequisites
- Docker & Docker Compose installed

## Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MohammadaminAlbooyeh/to_do_list.git
   cd to_do_list
   ```

2. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## Development

### Backend (Flask)
```
cd backend
pip install -r requirements.txt
python app.py
```

### Frontend (React)
```
cd frontend
npm install
npm start
```

## API Endpoints
- `GET /todos` - List all to-dos
- `POST /todos` - Add a new to-do
- `PUT /todos/<id>` - Update a to-do
- `DELETE /todos/<id>` - Delete a to-do

## License
MIT
