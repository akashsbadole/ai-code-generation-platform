import { NextRequest, NextResponse } from 'next/server'

interface TemplateGenerationRequest {
  projectContext: {
    name: string
    description: string
    type: string
    scale: string
    architecture: string
    deployment: string
  }
  selectedTech: { [key: string]: { name: string, version: string } }
  requirements: {
    functional: string
    nonFunctional: string
    businessLogic: string
    integrations: string
  }
  aiProvider: string
  templateId: string
}

interface GeneratedFile {
  path: string
  content: string
  language: string
}

interface CodeGenerationResponse {
  files: GeneratedFile[]
  projectStructure: string[]
  setupCommands: string[]
  dependencies: { [key: string]: string }
  explanation: string
}

// Template definitions
const templates = {
  'react-portfolio': {
    files: [
      {
        path: 'package.json',
        content: (context: any) => `{
  "name": "${context.name || 'portfolio'}",
  "version": "1.0.0",
  "description": "${context.description || 'Modern portfolio website'}",
  "main": "src/index.js",
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "5.0.0",
    "styled-components": "^5.3.0"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}`,
        language: 'json'
      },
      {
        path: 'src/App.js',
        content: (context: any) => `import React from 'react';
import styled from 'styled-components';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';

const AppContainer = styled.div\`
  font-family: 'Arial', sans-serif;
  line-height: 1.6;
  color: #333;
\`;

function App() {
  return (
    <AppContainer>
      <Header />
      <Hero title="${context.name || 'Welcome to My Portfolio'}" 
             subtitle="${context.description || 'Frontend Developer & UI/UX Designer'}" />
      <About />
      <Projects />
      <Contact />
      <Footer />
    </AppContainer>
  );
}

export default App;`,
        language: 'javascript'
      }
    ],
    setupCommands: ['npm install', 'npm start'],
    dependencies: {
      'react': '^18.0.0',
      'react-dom': '^18.0.0',
      'react-scripts': '5.0.0',
      'styled-components': '^5.3.0'
    }
  },
  'html-landing': {
    files: [
      {
        path: 'index.html',
        content: (context: any) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${context.name || 'Landing Page'}</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    <!-- Header -->
    <header class="header">
        <nav class="nav">
            <div class="nav-container">
                <div class="nav-logo">
                    <h1>${context.name || 'Brand'}</h1>
                </div>
                <ul class="nav-menu">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>
        </nav>
    </header>

    <!-- Hero Section -->
    <section id="home" class="hero">
        <div class="hero-content">
            <h1 class="hero-title">${context.name || 'Welcome to Our Platform'}</h1>
            <p class="hero-subtitle">${context.description || 'Discover amazing features and possibilities'}</p>
            <div class="hero-buttons">
                <button class="btn btn-primary">Get Started</button>
                <button class="btn btn-secondary">Learn More</button>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features">
        <div class="container">
            <h2 class="section-title">Key Features</h2>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">🚀</div>
                    <h3>Fast Performance</h3>
                    <p>Lightning-fast loading times and smooth interactions</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">🎨</div>
                    <h3>Beautiful Design</h3>
                    <p>Modern, clean interface that delights users</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">📱</div>
                    <h3>Responsive</h3>
                    <p>Works perfectly on all devices and screen sizes</p>
                </div>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about">
        <div class="container">
            <h2 class="section-title">About Us</h2>
            <p class="about-text">
                ${context.description || 'We are dedicated to creating amazing digital experiences that help businesses grow and succeed in the modern world.'}
            </p>
        </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <form class="contact-form">
                <input type="text" placeholder="Your Name" required>
                <input type="email" placeholder="Your Email" required>
                <textarea placeholder="Your Message" rows="5" required></textarea>
                <button type="submit" class="btn btn-primary">Send Message</button>
            </form>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; 2024 ${context.name || 'Company'}. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`,
        language: 'html'
      },
      {
        path: 'styles.css',
        content: (context: any) => `/* Reset and Base Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    line-height: 1.6;
    color: #333;
    overflow-x: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header Styles */
.header {
    background: #fff;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: fixed;
    width: 100%;
    top: 0;
    z-index: 1000;
}

.nav {
    padding: 1rem 0;
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo h1 {
    color: #667eea;
    font-size: 1.5rem;
    font-weight: 700;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
    transition: color 0.3s ease;
}

.nav-menu a:hover {
    color: #667eea;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 120px 20px 80px;
    text-align: center;
    margin-top: 80px;
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    animation: fadeInUp 1s ease;
}

.hero-subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    animation: fadeInUp 1s ease 0.2s;
    animation-fill-mode: both;
}

.hero-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    animation: fadeInUp 1s ease 0.4s;
    animation-fill-mode: both;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background: #fff;
    color: #667eea;
}

.btn-primary:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: #fff;
    border: 2px solid #fff;
}

.btn-secondary:hover {
    background: #fff;
    color: #667eea;
}

/* Features Section */
.features {
    padding: 80px 20px;
    background: #f8f9fa;
}

.section-title {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 3rem;
    color: #333;
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
}

.feature-card {
    background: #fff;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    transition: transform 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.feature-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #333;
}

.feature-card p {
    color: #666;
    line-height: 1.6;
}

/* About Section */
.about {
    padding: 80px 20px;
    background: #fff;
}

.about-text {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    font-size: 1.1rem;
    color: #666;
    line-height: 1.8;
}

/* Contact Section */
.contact {
    padding: 80px 20px;
    background: #f8f9fa;
}

.contact-form {
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.contact-form input,
.contact-form textarea {
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
}

.contact-form input:focus,
.contact-form textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Footer */
.footer {
    background: #333;
    color: #fff;
    text-align: center;
    padding: 2rem 20px;
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .nav-menu {
        display: none;
    }
    
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
}`,
        language: 'css'
      },
      {
        path: 'script.js',
        content: (context: any) => `// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const name = formData.get('name') || this.querySelector('input[type="text"]').value;
    const email = formData.get('email') || this.querySelector('input[type="email"]').value;
    const message = formData.get('message') || this.querySelector('textarea').value;
    
    // Basic validation
    if (!name || !email || !message) {
        alert('Please fill in all fields');
        return;
    }
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});`,
        language: 'javascript'
      }
    ],
    setupCommands: ['Open index.html in a web browser'],
    dependencies: {}
  },
  'node-api': {
    files: [
      {
        path: 'package.json',
        content: (context: any) => `{
  "name": "${context.name || 'node-api'}",
  "version": "1.0.0",
  "description": "${context.description || 'RESTful API server with Node.js'}",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "morgan": "^1.10.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2"
  }
}`,
        language: 'json'
      },
      {
        path: 'src/index.js',
        content: (context: any) => `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ${context.name || 'Node.js API'}',
    version: '1.0.0',
    endpoints: {
      'GET /': 'Server information',
      'GET /api/users': 'Get all users',
      'POST /api/users': 'Create a new user',
      'GET /api/users/:id': 'Get user by ID',
      'PUT /api/users/:id': 'Update user',
      'DELETE /api/users/:id': 'Delete user'
    }
  });
});

// Sample data
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', createdAt: new Date() },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', createdAt: new Date() }
];

// Routes
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    createdAt: new Date()
  };
  
  users.push(newUser);
  res.status(201).json(newUser);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

app.put('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  const { name, email } = req.body;
  
  if (name) user.name = name;
  if (email) user.email = email;
  
  res.json(user);
});

app.delete('/api/users/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
  
  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users.splice(userIndex, 1);
  res.status(204).send();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(\`Server is running on port \${PORT}\`);
  console.log(\`Visit: http://localhost:\${PORT}\`);
});`,
        language: 'javascript'
      }
    ],
    setupCommands: ['npm install', 'npm run dev'],
    dependencies: {
      'express': '^4.18.2',
      'cors': '^2.8.5',
      'helmet': '^7.0.0',
      'morgan': '^1.10.0',
      'dotenv': '^16.3.1'
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { projectContext, selectedTech, templateId } = body

    if (!templateId) {
      return NextResponse.json(
        { error: 'No template selected' },
        { status: 400 }
      )
    }

    const template = templates[templateId as keyof typeof templates]

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    // Generate files based on template
    const files = template.files.map((fileConfig: any) => ({
      path: fileConfig.path,
      content: typeof fileConfig.content === 'function' 
        ? fileConfig.content(projectContext) 
        : fileConfig.content,
      language: fileConfig.language
    }))

    const generatedCode: CodeGenerationResponse = {
      files,
      projectStructure: files.map(f => f.path),
      setupCommands: template.setupCommands,
      dependencies: template.dependencies,
      explanation: `Generated code from template "${templateId}". This provides a quick starting point without requiring AI assistance.`
    }

    return NextResponse.json(generatedCode)

  } catch (error) {
    console.error('Template-based code generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate code from template', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}