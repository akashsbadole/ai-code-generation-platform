"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/theme-toggle"
import { 
  Download, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  Sparkles, 
  Code, 
  Wand2, 
  FileText, 
  FolderOpen, 
  Play, 
  Settings, 
  Upload, 
  Image, 
  Palette,
  Zap,
  Users,
  History,
  Eye,
  RefreshCw,
  Save,
  Share2,
  Rocket,
  Lightbulb,
  Target,
  Layers,
  GitBranch,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  Server,
  Shield,
  Edit
} from "lucide-react"
import dynamic from 'next/dynamic'

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { 
  ssr: false,
  loading: () => (
    <div className="h-96 flex items-center justify-center bg-muted rounded-lg">
      <div className="text-center space-y-2">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Loading editor...</p>
      </div>
    </div>
  )
})

const technologies = {
  Frontend: [
    { name: "HTML", versions: ["5"], icon: <Monitor className="w-4 h-4" /> },
    { name: "CSS", versions: ["3"], icon: <Palette className="w-4 h-4" /> },
    { name: "JavaScript", versions: ["ES2023", "ES2022", "ES2021"], icon: <Code className="w-4 h-4" /> },
    { name: "React", versions: ["18", "17", "16"], icon: <Sparkles className="w-4 h-4" /> },
    { name: "Vue.js", versions: ["3", "2"], icon: <Zap className="w-4 h-4" /> },
    { name: "Angular", versions: ["17", "16", "15"], icon: <Target className="w-4 h-4" /> },
    { name: "Svelte", versions: ["4", "3"], icon: <Lightbulb className="w-4 h-4" /> },
    { name: "Next.js", versions: ["14", "13"], icon: <Rocket className="w-4 h-4" /> },
    { name: "Nuxt.js", versions: ["3", "2"], icon: <Layers className="w-4 h-4" /> }
  ],
  Backend: [
    { name: "Node.js", versions: ["20", "18", "16"], icon: <Server className="w-4 h-4" /> },
    { name: "Python", versions: ["3.12", "3.11", "3.10"], icon: <Code className="w-4 h-4" /> },
    { name: "Java", versions: ["21", "17", "11"], icon: <Database className="w-4 h-4" /> },
    { name: "C#", versions: ["12", "11", "10"], icon: <Settings className="w-4 h-4" /> },
    { name: "Go", versions: ["1.22", "1.21", "1.20"], icon: <Zap className="w-4 h-4" /> },
    { name: "Rust", versions: ["1.77", "1.76", "1.75"], icon: <Code className="w-4 h-4" /> },
    { name: "PHP", versions: ["8.3", "8.2", "8.1"], icon: <Code className="w-4 h-4" /> }
  ],
  Database: [
    { name: "PostgreSQL", versions: ["16", "15", "14"], icon: <Database className="w-4 h-4" /> },
    { name: "MySQL", versions: ["8.3", "8.2", "8.1"], icon: <Database className="w-4 h-4" /> },
    { name: "MongoDB", versions: ["7.0", "6.0", "5.0"], icon: <Database className="w-4 h-4" /> },
    { name: "SQLite", versions: ["3.45", "3.44", "3.43"], icon: <Database className="w-4 h-4" /> },
    { name: "Redis", versions: ["7.2", "7.0", "6.2"], icon: <Database className="w-4 h-4" /> }
  ],
  Mobile: [
    { name: "React Native", versions: ["0.73", "0.72", "0.71"], icon: <Smartphone className="w-4 h-4" /> },
    { name: "Flutter", versions: ["3.19", "3.16", "3.13"], icon: <Smartphone className="w-4 h-4" /> },
    { name: "Swift", versions: ["5.10", "5.9", "5.8"], icon: <Smartphone className="w-4 h-4" /> },
    { name: "Kotlin", versions: ["1.9", "1.8", "1.7"], icon: <Smartphone className="w-4 h-4" /> }
  ]
}

const aiProviders = [
  { 
    id: "zai", 
    name: "Z.ai", 
    description: "Built-in AI assistant", 
    icon: <Sparkles className="w-5 h-5" />,
    color: "from-purple-500 to-pink-500"
  },
  { 
    id: "claude", 
    name: "Claude AI", 
    description: "Anthropic's Claude AI", 
    icon: <Code className="w-5 h-5" />,
    color: "from-blue-500 to-cyan-500"
  },
  { 
    id: "openai", 
    name: "OpenAI", 
    description: "GPT-4 and other models", 
    icon: <Target className="w-5 h-5" />,
    color: "from-green-500 to-emerald-500"
  },
  { 
    id: "google", 
    name: "Google AI", 
    description: "Gemini and other Google models", 
    icon: <Cloud className="w-5 h-5" />,
    color: "from-orange-500 to-red-500"
  },
  { 
    id: "image", 
    name: "Image Upload", 
    description: "Generate code from uploaded images", 
    icon: <Image className="w-5 h-5" />, // eslint-disable-line jsx-a11y/alt-text
    color: "from-indigo-500 to-purple-500"
  },
  { 
    id: "figma", 
    name: "Figma", 
    description: "Convert Figma designs to code", 
    icon: <Palette className="w-5 h-5" />,
    color: "from-pink-500 to-rose-500"
  },
  { 
    id: "template", 
    name: "Template", 
    description: "Generate code from templates without AI", 
    icon: <Layers className="w-5 h-5" />,
    color: "from-gray-500 to-slate-500"
  }
]

const templates = [
  { 
    id: "react-portfolio", 
    name: "React Portfolio", 
    description: "Modern portfolio website with React",
    icon: <Code className="w-4 h-4" />
  },
  { 
    id: "node-api", 
    name: "Node.js API", 
    description: "RESTful API server with Node.js",
    icon: <Server className="w-4 h-4" />
  },
  { 
    id: "python-web", 
    name: "Python Web App", 
    description: "Web application using Python Flask",
    icon: <Code className="w-4 h-4" />
  },
  { 
    id: "html-landing", 
    name: "HTML Landing Page", 
    description: "Responsive landing page with HTML/CSS",
    icon: <Monitor className="w-4 h-4" />
  },
  { 
    id: "mobile-app", 
    name: "Mobile App Template", 
    description: "Cross-platform mobile app template",
    icon: <Smartphone className="w-4 h-4" />
  },
  { 
    id: "dashboard", 
    name: "Admin Dashboard", 
    description: "Admin dashboard with charts and tables",
    icon: <Database className="w-4 h-4" />
  }
]

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

interface VersionHistory {
  id: string
  timestamp: Date
  files: { [key: string]: string }
  description: string
}

export default function CodeGenerationPlatform() {
  const [selectedTech, setSelectedTech] = useState<{[key: string]: { name: string, version: string }}>({})
  const [selectedAIProvider, setSelectedAIProvider] = useState("zai")
  const [apiKeys, setApiKeys] = useState({
    claude: "",
    openai: "",
    google: ""
  })
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [figmaUrl, setFigmaUrl] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [projectContext, setProjectContext] = useState({
    name: "",
    description: "",
    type: "",
    scale: "",
    architecture: "",
    deployment: ""
  })
  const [requirements, setRequirements] = useState({
    functional: "",
    nonFunctional: "",
    businessLogic: "",
    integrations: ""
  })
  const [generatedCode, setGeneratedCode] = useState<CodeGenerationResponse | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [editedFiles, setEditedFiles] = useState<{[key: string]: string}>({})
  const [activeTab, setActiveTab] = useState("input")
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationStatus, setGenerationStatus] = useState("")
  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([])
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [collaborators, setCollaborators] = useState<string[]>([])
  const [isCollaborating, setIsCollaborating] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [aiProcessing, setAiProcessing] = useState(false)
  const [aiResults, setAiResults] = useState<{
    optimizedCode?: string
    refactoredCode?: string
    explanation?: string
    improvements?: string[]
    changes?: string[]
  }>({})
  const [savedApiKeys, setSavedApiKeys] = useState<{provider: string, isActive: boolean}[]>([])
  const [isLoadingKeys, setIsLoadingKeys] = useState(false)

  const progressInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [])

  useEffect(() => {
    loadSavedApiKeys()
  }, [])

  const loadSavedApiKeys = async () => {
    setIsLoadingKeys(true)
    try {
      const response = await fetch('/api/api-keys')
      if (response.ok) {
        const keys = await response.json()
        setSavedApiKeys(keys)
        
        // Update the local apiKeys state with saved keys
        const newApiKeys = { ...apiKeys }
        keys.forEach((key: any) => {
          if (key.isActive) {
            newApiKeys[key.provider as keyof typeof apiKeys] = '***saved***'
          }
        })
        setApiKeys(newApiKeys)
      }
    } catch (error) {
      console.error('Error loading API keys:', error)
    } finally {
      setIsLoadingKeys(false)
    }
  }

  const saveApiKey = async (provider: string, apiKey: string) => {
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, apiKey })
      })

      if (response.ok) {
        await loadSavedApiKeys()
        return true
      }
      return false
    } catch (error) {
      console.error('Error saving API key:', error)
      return false
    }
  }

  const getStoredApiKey = async (provider: string): Promise<string> => {
    try {
      const response = await fetch(`/api/api-keys/${provider}`)
      if (response.ok) {
        const data = await response.json()
        return data.apiKey
      }
      return ''
    } catch (error) {
      console.error('Error getting stored API key:', error)
      return ''
    }
  }

  const deleteApiKey = async (provider: string) => {
    try {
      const response = await fetch(`/api/api-keys/${provider}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadSavedApiKeys()
        // Clear from local state
        setApiKeys(prev => ({
          ...prev,
          [provider]: ''
        }))
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting API key:', error)
      return false
    }
  }

  const handleTechSelect = (category: string, tech: string, version: string) => {
    setSelectedTech(prev => ({
      ...prev,
      [category]: { name: tech, version }
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedImage(file)
    }
  }

  const saveVersion = (description: string) => {
    const newVersion: VersionHistory = {
      id: Date.now().toString(),
      timestamp: new Date(),
      files: { ...editedFiles },
      description
    }
    setVersionHistory(prev => [newVersion, ...prev])
  }

  const restoreVersion = (versionId: string) => {
    const version = versionHistory.find(v => v.id === versionId)
    if (version) {
      setEditedFiles(version.files)
    }
  }

  const generateCode = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setGenerationStatus("Initializing AI models...")
    
    // Simulate progress
    progressInterval.current = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 90) {
          if (progressInterval.current) {
            clearInterval(progressInterval.current)
          }
          return prev
        }
        return prev + 10
      })
    }, 200)

    // Update status messages
    const statusMessages = [
      "Initializing AI models...",
      "Analyzing requirements...",
      "Designing architecture...",
      "Generating code structure...",
      "Writing implementation...",
      "Optimizing performance...",
      "Adding documentation...",
      "Finalizing project..."
    ]
    
    let statusIndex = 0
    const statusInterval = setInterval(() => {
      if (statusIndex < statusMessages.length) {
        setGenerationStatus(statusMessages[statusIndex])
        statusIndex++
      } else {
        clearInterval(statusInterval)
      }
    }, 250)
    
    // Default to HTML if no technology is selected
    const techToUse = Object.keys(selectedTech).length === 0 ? 
      { Frontend: { name: "HTML", version: "5" } } : 
      selectedTech

    try {
      let response
      const requestBody: any = {
        projectContext,
        selectedTech: techToUse,
        requirements,
        aiProvider: selectedAIProvider,
        apiKeys: apiKeys
      }

      // Add provider-specific data
      if (selectedAIProvider === "image" && uploadedImage) {
        const formData = new FormData()
        formData.append('image', uploadedImage)
        formData.append('projectContext', JSON.stringify(projectContext))
        formData.append('selectedTech', JSON.stringify(techToUse))
        formData.append('requirements', JSON.stringify(requirements))
        formData.append('aiProvider', selectedAIProvider)
        
        response = await fetch('/api/generate-from-image', {
          method: 'POST',
          body: formData
        })
      } else if (selectedAIProvider === "figma" && figmaUrl) {
        requestBody.figmaUrl = figmaUrl
        response = await fetch('/api/generate-from-figma', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })
      } else if (selectedAIProvider === "template" && selectedTemplate) {
        requestBody.templateId = selectedTemplate
        response = await fetch('/api/generate-from-template', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })
      } else {
        response = await fetch('/api/generate-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        })
      }

      if (!response?.ok) {
        throw new Error('Failed to generate code')
      }

      const data: CodeGenerationResponse = await response.json()
      setGeneratedCode(data)
      
      // Select the first file by default
      if (data.files && data.files.length > 0) {
        setSelectedFile(data.files[0].path)
      }
      
      // Save initial version
      saveVersion("Initial generation")
      
      setGenerationProgress(100)
      setGenerationStatus("Generation complete!")
      
      setTimeout(() => {
        setActiveTab("code")
        if (progressInterval.current) {
          clearInterval(progressInterval.current)
        }
      }, 1000)
      
    } catch (error) {
      console.error('Error generating code:', error)
      setGenerationStatus("Error occurred. Using fallback generation...")
      
      // Fallback to mock data for demo purposes
      let mockData: CodeGenerationResponse
      
      if (selectedAIProvider === "image") {
        mockData = {
          files: [
            {
              path: "index.html",
              content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectContext.name || 'Generated from Image'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .hero {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 60px 40px;
            text-align: center;
            color: white;
            margin: 40px 0;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .hero h1 {
            font-size: 3rem;
            margin-bottom: 20px;
            font-weight: 700;
        }
        
        .hero p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 60px 0;
        }
        
        .feature {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            text-align: center;
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: transform 0.3s ease;
        }
        
        .feature:hover {
            transform: translateY(-5px);
        }
        
        .feature h3 {
            margin-bottom: 15px;
            font-size: 1.5rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="hero">
            <h1>${projectContext.name || 'Generated from Image'}</h1>
            <p>${projectContext.description || 'Modern web application generated from image'}</p>
        </div>
        
        <div class="features">
            <div class="feature">
                <h3>🎨 Modern Design</h3>
                <p>Clean, responsive design with glassmorphism effects</p>
            </div>
            <div class="feature">
                <h3>⚡ Fast Performance</h3>
                <p>Optimized for speed and user experience</p>
            </div>
            <div class="feature">
                <h3>📱 Mobile Responsive</h3>
                <p>Works perfectly on all devices and screen sizes</p>
            </div>
        </div>
    </div>
</body>
</html>`,
              language: "html"
            }
          ],
          projectStructure: ["index.html"],
          setupCommands: ["Open index.html in a web browser"],
          dependencies: {},
          explanation: "Generated a modern, responsive HTML application with glassmorphism design effects based on the uploaded image. The design features a gradient background, glass-like cards, and smooth animations."
        }
      } else if (selectedAIProvider === "figma") {
        mockData = {
          files: [
            {
              path: "index.html",
              content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectContext.name || 'Generated from Figma'}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8fafc;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background: white;
            padding: 20px 0;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: sticky;
            top: 0;
            z-index: 100;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: #667eea;
        }
        
        .nav-links {
            display: flex;
            gap: 30px;
            list-style: none;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #64748b;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .nav-links a:hover {
            color: #667eea;
        }
        
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 120px 20px;
            border-radius: 20px;
            text-align: center;
            margin: 40px 0;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            font-weight: 800;
        }
        
        .hero p {
            font-size: 1.3rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .cta-button {
            display: inline-block;
            background: white;
            color: #667eea;
            padding: 15px 30px;
            border-radius: 50px;
            text-decoration: none;
            font-weight: 600;
            margin-top: 30px;
            transition: transform 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 40px;
            margin: 80px 0;
        }
        
        .feature {
            background: white;
            padding: 40px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s ease;
        }
        
        .feature:hover {
            transform: translateY(-5px);
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 1.5rem;
        }
        
        .feature h3 {
            margin-bottom: 15px;
            font-size: 1.5rem;
            color: #1e293b;
        }
        
        .feature p {
            color: #64748b;
            line-height: 1.8;
        }
        
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .nav-links {
                display: none;
            }
            
            .features {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <nav>
            <div class="logo">${projectContext.name || 'Brand'}</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>
    
    <div class="container">
        <section class="hero">
            <h1>${projectContext.name || 'Welcome to Our Platform'}</h1>
            <p>${projectContext.description || 'Transform your ideas into reality with our cutting-edge solutions'}</p>
            <a href="#features" class="cta-button">Get Started</a>
        </section>
        
        <section class="features" id="features">
            <div class="feature">
                <div class="feature-icon">🚀</div>
                <h3>Lightning Fast</h3>
                <p>Blazing fast performance with optimized code and modern technologies</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🎨</div>
                <h3>Beautiful Design</h3>
                <p>Stunning visuals and intuitive user experience crafted with precision</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🔒</div>
                <h3>Secure & Reliable</h3>
                <p>Enterprise-grade security with 99.9% uptime guarantee</p>
            </div>
        </section>
    </div>
</body>
</html>`,
              language: "html"
            }
          ],
          projectStructure: ["index.html"],
          setupCommands: ["Open index.html in a web browser"],
          dependencies: {},
          explanation: "Generated a modern, responsive website from Figma design with professional styling, navigation, hero section, and feature cards. The design includes smooth animations, hover effects, and mobile responsiveness."
        }
      } else if (selectedAIProvider === "template") {
        mockData = {
          files: [
            {
              path: "index.html",
              content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectContext.name || 'Template Generated'}</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            line-height: 1.6;
            color: #1e293b;
            background: #ffffff;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header Styles */
        header {
            background: #ffffff;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: 700;
            color: #3b82f6;
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #64748b;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .nav-links a:hover {
            color: #3b82f6;
        }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 120px 0;
            margin-top: 80px;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
        }
        
        .hero p {
            font-size: 1.25rem;
            opacity: 0.9;
            max-width: 600px;
            margin: 0 auto 2rem;
        }
        
        .cta-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-primary {
            background: #ffffff;
            color: #3b82f6;
        }
        
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .btn-secondary {
            background: transparent;
            color: white;
            border: 2px solid white;
        }
        
        .btn-secondary:hover {
            background: white;
            color: #3b82f6;
        }
        
        /* Features Section */
        .features {
            padding: 80px 0;
            background: #f8fafc;
        }
        
        .section-header {
            text-align: center;
            margin-bottom: 4rem;
        }
        
        .section-header h2 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 1rem;
        }
        
        .section-header p {
            font-size: 1.125rem;
            color: #64748b;
            max-width: 600px;
            margin: 0 auto;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }
        
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            text-align: center;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 25px rgba(0,0,0,0.1);
        }
        
        .feature-icon {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            font-size: 1.5rem;
        }
        
        .feature-card h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 1rem;
        }
        
        .feature-card p {
            color: #64748b;
            line-height: 1.6;
        }
        
        /* Stats Section */
        .stats {
            padding: 80px 0;
            background: white;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            text-align: center;
        }
        
        .stat-item h3 {
            font-size: 2.5rem;
            font-weight: 700;
            color: #3b82f6;
            margin-bottom: 0.5rem;
        }
        
        .stat-item p {
            color: #64748b;
            font-weight: 500;
        }
        
        /* Footer */
        footer {
            background: #1e293b;
            color: white;
            padding: 40px 0;
            text-align: center;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .footer-section h4 {
            margin-bottom: 1rem;
            color: #3b82f6;
        }
        
        .footer-section ul {
            list-style: none;
        }
        
        .footer-section ul li {
            margin-bottom: 0.5rem;
        }
        
        .footer-section a {
            color: #94a3b8;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .footer-section a:hover {
            color: #3b82f6;
        }
        
        .footer-bottom {
            border-top: 1px solid #334155;
            padding-top: 2rem;
            margin-top: 2rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .nav-links {
                display: none;
            }
            
            .cta-buttons {
                flex-direction: column;
                align-items: center;
            }
            
            .features-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <nav class="container">
            <div class="logo">${projectContext.name || 'BrandName'}</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="container">
            <h1>${projectContext.name || 'Welcome to Our Platform'}</h1>
            <p>${projectContext.description || 'Transform your ideas into reality with our cutting-edge solutions and innovative approach'}</p>
            <div class="cta-buttons">
                <a href="#features" class="btn btn-primary">
                    <i class="fas fa-rocket"></i>
                    Get Started
                </a>
                <a href="#about" class="btn btn-secondary">
                    <i class="fas fa-play"></i>
                    Learn More
                </a>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
        <div class="container">
            <div class="section-header">
                <h2>Why Choose Us</h2>
                <p>We provide the best solutions for your business needs</p>
            </div>
            <div class="features-grid">
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-rocket"></i>
                    </div>
                    <h3>Fast Performance</h3>
                    <p>Lightning-fast loading times and optimized performance for the best user experience</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h3>Secure & Reliable</h3>
                    <p>Enterprise-grade security with 99.9% uptime and reliable infrastructure</p>
                </div>
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <h3>Mobile Responsive</h3>
                    <p>Perfectly designed for all devices and screen sizes with responsive layout</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
        <div class="container">
            <div class="section-header">
                <h2>Our Impact</h2>
                <p>Numbers that speak for themselves</p>
            </div>
            <div class="stats-grid">
                <div class="stat-item">
                    <h3>1000+</h3>
                    <p>Happy Clients</p>
                </div>
                <div class="stat-item">
                    <h3>50+</h3>
                    <p>Projects Completed</p>
                </div>
                <div class="stat-item">
                    <h3>24/7</h3>
                    <p>Support Available</p>
                </div>
                <div class="stat-item">
                    <h3>99%</h3>
                    <p>Client Satisfaction</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h4>About Us</h4>
                    <p>We are a team of passionate developers and designers creating amazing digital experiences.</p>
                </div>
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </div>
                <div class="footer-section">
                    <h4>Services</h4>
                    <ul>
                        <li><a href="#">Web Development</a></li>
                        <li><a href="#">Mobile Apps</a></li>
                        <li><a href="#">UI/UX Design</a></li>
                        <li><a href="#">Consulting</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 ${projectContext.name || 'BrandName'}. All rights reserved.</p>
            </div>
        </div>
    </footer>
</body>
</html>`,
              language: "html"
            }
          ],
          projectStructure: ["index.html"],
          setupCommands: ["Open index.html in a web browser"],
          dependencies: {},
          explanation: "Generated a complete, professional website template from a pre-built design without AI. The template includes a responsive navigation bar, hero section with call-to-action buttons, features grid, statistics section, and comprehensive footer with Font Awesome icons."
        }
      } else {
        mockData = {
          files: [
            {
              path: "index.html",
              content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${projectContext.name || 'My App'}</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <div class="container">
                <nav class="navbar">
                    <div class="nav-brand">
                        <i class="fas fa-rocket"></i>
                        <span>${projectContext.name || 'My App'}</span>
                    </div>
                    <ul class="nav-menu">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#features">Features</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
            </div>
        </header>

        <main class="main-content">
            <section class="hero" id="home">
                <div class="container">
                    <div class="hero-content">
                        <h1 class="hero-title">
                            Welcome to <span class="gradient-text">${projectContext.name || 'My App'}</span>
                        </h1>
                        <p class="hero-description">
                            ${projectContext.description || 'A modern web application built with cutting-edge technology'}
                        </p>
                        <div class="hero-actions">
                            <button class="btn btn-primary">
                                <i class="fas fa-play"></i>
                                Get Started
                            </button>
                            <button class="btn btn-secondary">
                                <i class="fas fa-info-circle"></i>
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section class="features" id="features">
                <div class="container">
                    <h2 class="section-title">Amazing Features</h2>
                    <div class="features-grid">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-bolt"></i>
                            </div>
                            <h3>Lightning Fast</h3>
                            <p>Optimized for speed and performance</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-shield-alt"></i>
                            </div>
                            <h3>Secure</h3>
                            <p>Enterprise-grade security features</p>
                        </div>
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-mobile-alt"></i>
                            </div>
                            <h3>Responsive</h3>
                            <p>Works perfectly on all devices</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="about" id="about">
                <div class="container">
                    <div class="about-content">
                        <div class="about-text">
                            <h2 class="section-title">About This Project</h2>
                            <p>This project was generated using AI-powered code generation with ${techToUse.Frontend?.name || 'HTML'} technology.</p>
                            <p>The application includes modern design patterns, responsive layout, and interactive features.</p>
                        </div>
                        <div class="about-image">
                            <div class="placeholder-image">
                                <i class="fas fa-code"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <footer class="app-footer">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-section">
                        <h4>${projectContext.name || 'My App'}</h4>
                        <p>Generated with AI technology</p>
                    </div>
                    <div class="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><a href="#home">Home</a></li>
                            <li><a href="#features">Features</a></li>
                            <li><a href="#about">About</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h4>Connect</h4>
                        <div class="social-links">
                            <a href="#"><i class="fab fa-github"></i></a>
                            <a href="#"><i class="fab fa-twitter"></i></a>
                            <a href="#"><i class="fab fa-linkedin"></i></a>
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2024 ${projectContext.name || 'My App'}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
              language: "html"
            },
            {
              path: "styles.css",
              content: `/* Modern CSS for ${projectContext.name || 'My App'} */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --accent-color: #f093fb;
    --text-dark: #1e293b;
    --text-light: #64748b;
    --bg-light: #f8fafc;
    --bg-white: #ffffff;
    --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
    --shadow-xl: 0 20px 25px rgba(0,0,0,0.1);
    --transition: all 0.3s ease;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--text-dark);
    background-color: var(--bg-light);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Header Styles */
.app-header {
    background: var(--bg-white);
    box-shadow: var(--shadow-sm);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
}

.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
}

.nav-brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-color);
}

.nav-brand i {
    font-size: 1.8rem;
}

.nav-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
}

.nav-menu a {
    text-decoration: none;
    color: var(--text-light);
    font-weight: 500;
    transition: var(--transition);
    position: relative;
}

.nav-menu a:hover {
    color: var(--primary-color);
}

.nav-menu a::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary-color);
    transition: var(--transition);
}

.nav-menu a:hover::after {
    width: 100%;
}

/* Main Content */
.main-content {
    margin-top: 80px;
}

/* Hero Section */
.hero {
    background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    color: white;
    padding: 120px 0;
    position: relative;
    overflow: hidden;
}

.hero::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="1" fill="white" opacity="0.1"/><circle cx="10" cy="90" r="1" fill="white" opacity="0.1"/><circle cx="90" cy="40" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
    opacity: 0.1;
}

.hero-content {
    position: relative;
    z-index: 1;
    text-align: center;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    line-height: 1.2;
}

.gradient-text {
    background: linear-gradient(45deg, #fff, #f0f0f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-description {
    font-size: 1.25rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto 2rem;
    line-height: 1.6;
}

.hero-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
}

.btn-primary {
    background: var(--bg-white);
    color: var(--primary-color);
    box-shadow: var(--shadow-md);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.btn-secondary {
    background: transparent;
    color: white;
    border: 2px solid white;
}

.btn-secondary:hover {
    background: white;
    color: var(--primary-color);
}

/* Features Section */
.features {
    padding: 80px 0;
    background: var(--bg-white);
}

.section-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 3rem;
    color: var(--text-dark);
}

.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.feature-card {
    background: var(--bg-white);
    padding: 2rem;
    border-radius: 15px;
    box-shadow: var(--shadow-md);
    text-align: center;
    transition: var(--transition);
    border: 1px solid rgba(0,0,0,0.05);
}

.feature-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-xl);
}

.feature-icon {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    font-size: 1.5rem;
    color: white;
}

.feature-card h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 1rem;
}

.feature-card p {
    color: var(--text-light);
    line-height: 1.6;
}

/* About Section */
.about {
    padding: 80px 0;
    background: var(--bg-light);
}

.about-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
}

.about-text h2 {
    margin-bottom: 1.5rem;
}

.about-text p {
    color: var(--text-light);
    margin-bottom: 1rem;
    line-height: 1.8;
}

.about-image {
    display: flex;
    justify-content: center;
}

.placeholder-image {
    width: 300px;
    height: 300px;
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    color: white;
    box-shadow: var(--shadow-lg);
}

/* Footer */
.app-footer {
    background: var(--text-dark);
    color: white;
    padding: 60px 0 20px;
}

.footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.footer-section h4 {
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.footer-section ul {
    list-style: none;
}

.footer-section ul li {
    margin-bottom: 0.5rem;
}

.footer-section a {
    color: #94a3b8;
    text-decoration: none;
    transition: var(--transition);
}

.footer-section a:hover {
    color: var(--primary-color);
}

.social-links {
    display: flex;
    gap: 1rem;
}

.social-links a {
    width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
}

.social-links a:hover {
    background: var(--primary-color);
    transform: translateY(-2px);
}

.footer-bottom {
    border-top: 1px solid #334155;
    padding-top: 2rem;
    text-align: center;
    color: #94a3b8;
}

/* Responsive Design */
@media (max-width: 768px) {
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-description {
        font-size: 1.1rem;
    }
    
    .nav-menu {
        display: none;
    }
    
    .about-content {
        grid-template-columns: 1fr;
        gap: 2rem;
    }
    
    .features-grid {
        grid-template-columns: 1fr;
    }
    
    .hero-actions {
        flex-direction: column;
        align-items: center;
    }
    
    .btn {
        width: 200px;
        justify-content: center;
    }
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

.feature-card {
    animation: fadeInUp 0.6s ease forwards;
}

.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }

/* Scroll animations */
.scroll-animate {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.scroll-animate.visible {
    opacity: 1;
    transform: translateY(0);
}`,
              language: "css"
            },
            {
              path: "script.js",
              content: `// Modern JavaScript for ${projectContext.name || 'My App'}

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
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

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.feature-card, .about-text, .about-image').forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });

    // Header scroll effect
    let lastScroll = 0;
    const header = document.querySelector('.app-header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        }
        
        lastScroll = currentScroll;
    });

    // Button click effects
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Feature card hover effects
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Dynamic loading animation
    function createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<div class="spinner"></div>';
        return spinner;
    }

    // Form validation (if forms are added later)
    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
            } else {
                input.classList.remove('error');
            }
        });
        
        return isValid;
    }

    // Add loading states to buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                this.disabled = true;
                
                // Simulate loading state
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.disabled = false;
                }, 2000);
            }
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = \`translateY(\${scrolled * 0.5}px)\`;
        }
    });

    // Mobile menu toggle (for responsive design)
    function createMobileMenu() {
        const navbar = document.querySelector('.navbar');
        const navBrand = document.querySelector('.nav-brand');
        
        const menuToggle = document.createElement('button');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        
        navBrand.appendChild(menuToggle);
        
        menuToggle.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('active');
        });
    }

    // Initialize mobile menu if screen is small
    if (window.innerWidth <= 768) {
        createMobileMenu();
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768) {
            if (!document.querySelector('.mobile-menu-toggle')) {
                createMobileMenu();
            }
        } else {
            const menuToggle = document.querySelector('.mobile-menu-toggle');
            if (menuToggle) {
                menuToggle.remove();
            }
        }
    });

    // Add CSS for mobile menu and ripple effects
    const style = document.createElement('style');
    style.textContent = \`
        .mobile-menu-toggle {
            display: none;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: var(--primary-color);
        }
        
        @media (max-width: 768px) {
            .mobile-menu-toggle {
                display: block;
            }
            
            .nav-menu {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background: white;
                flex-direction: column;
                padding: 1rem;
                box-shadow: var(--shadow-md);
                transform: translateY(-100%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .nav-menu.active {
                transform: translateY(0);
                opacity: 1;
                visibility: visible;
            }
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .btn {
            position: relative;
            overflow: hidden;
        }
        
        .btn.loading {
            pointer-events: none;
            opacity: 0.7;
        }
        
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        input.error, textarea.error {
            border-color: #ef4444 !important;
        }
    \`;
    
    document.head.appendChild(style);

    // Console welcome message
    console.log(\`%cWelcome to ${projectContext.name || 'My App'}! 🚀\`, 'color: #667eea; font-size: 20px; font-weight: bold;');
    console.log('%cBuilt with modern web technologies', 'color: #764ba2; font-size: 14px;');
});`,
              language: "javascript"
            }
          ],
          projectStructure: ["index.html", "styles.css", "script.js"],
          setupCommands: ["Open index.html in a web browser", "All files are self-contained"],
          dependencies: {},
          explanation: `Generated a complete, modern web application using ${techToUse.Frontend?.name || 'HTML'} technology. The application includes a responsive navigation bar, hero section with gradient backgrounds, feature cards with hover effects, about section, and comprehensive footer. The CSS includes modern design patterns with CSS variables, smooth animations, and responsive design. The JavaScript adds interactive features like smooth scrolling, scroll animations, button effects, and mobile menu functionality.`
        }
      }
      
      setTimeout(() => {
        setGeneratedCode(mockData)
        setSelectedFile(mockData.files[0].path)
        saveVersion("Initial generation")
        setGenerationProgress(100)
        setGenerationStatus("Generation complete!")
        
        setTimeout(() => {
          setActiveTab("code")
          if (progressInterval.current) {
            clearInterval(progressInterval.current)
          }
        }, 1000)
      }, 2000)
      
    } finally {
      setTimeout(() => {
        setIsGenerating(false)
        if (progressInterval.current) {
          clearInterval(progressInterval.current)
        }
      }, 3000)
    }
  }

  const getLanguageIcon = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        return <Code className="w-4 h-4" />
      case 'html':
        return <FileText className="w-4 h-4" />
      case 'css':
        return <Palette className="w-4 h-4" />
      case 'python':
        return <Code className="w-4 h-4" />
      case 'json':
        return <Settings className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getLanguageMonaco = (language: string) => {
    switch (language.toLowerCase()) {
      case 'javascript':
        return 'javascript'
      case 'typescript':
        return 'typescript'
      case 'html':
        return 'html'
      case 'css':
        return 'css'
      case 'python':
        return 'python'
      case 'json':
        return 'json'
      case 'sql':
        return 'sql'
      case 'java':
        return 'java'
      case 'cpp':
      case 'c++':
        return 'cpp'
      case 'c':
        return 'c'
      case 'go':
        return 'go'
      case 'rust':
        return 'rust'
      case 'php':
        return 'php'
      default:
        return 'plaintext'
    }
  }

  const downloadProject = () => {
    if (!generatedCode) return

    // Create a zip-like structure (simplified - just download main files)
    generatedCode.files.forEach(file => {
      const content = editedFiles[file.path] || file.content
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = file.path.split('/').pop() || 'file'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    })
  }

  const exportProject = (format: 'zip' | 'json' | 'github') => {
    if (!generatedCode) return

    switch (format) {
      case 'json':
        const exportData = {
          projectContext,
          selectedTech,
          requirements,
          generatedCode: {
            ...generatedCode,
            files: generatedCode.files.map(file => ({
              ...file,
              content: editedFiles[file.path] || file.content
            }))
          },
          editedFiles,
          versionHistory,
          exportedAt: new Date().toISOString()
        }
        const jsonContent = JSON.stringify(exportData, null, 2)
        const jsonBlob = new Blob([jsonContent], { type: 'application/json' })
        const jsonUrl = URL.createObjectURL(jsonBlob)
        const jsonLink = document.createElement('a')
        jsonLink.href = jsonUrl
        jsonLink.download = `${projectContext.name || 'project'}_export.json`
        document.body.appendChild(jsonLink)
        jsonLink.click()
        document.body.removeChild(jsonLink)
        URL.revokeObjectURL(jsonUrl)
        break

      case 'github':
        // Generate GitHub repository structure
        const githubFiles = generatedCode.files.map(file => ({
          path: file.path,
          content: editedFiles[file.path] || file.content
        }))
        
        const githubReadme = `# ${projectContext.name}

${projectContext.description}

## Generated by AI Code Generation Platform

### Technology Stack
${Object.entries(selectedTech).map(([category, tech]) => 
  `- **${category}:** ${tech.name} v${tech.version}`
).join('\n')}

### Project Structure
${generatedCode.projectStructure.map(item => `- ${item}`).join('\n')}

### Setup Instructions
\`\`\`bash
${generatedCode.setupCommands.join('\n')}
\`\`\`

### Requirements
${requirements.functional}

---

*This project was automatically generated by AI Code Generation Platform*`

        const githubContent = JSON.stringify({
          files: [...githubFiles, { path: 'README.md', content: githubReadme }],
          repository: {
            name: projectContext.name || 'generated-project',
            description: projectContext.description || 'AI-generated project'
          }
        }, null, 2)
        
        const githubBlob = new Blob([githubContent], { type: 'application/json' })
        const githubUrl = URL.createObjectURL(githubBlob)
        const githubLink = document.createElement('a')
        githubLink.href = githubUrl
        githubLink.download = `${projectContext.name || 'project'}_github.json`
        document.body.appendChild(githubLink)
        githubLink.click()
        document.body.removeChild(githubLink)
        URL.revokeObjectURL(githubUrl)
        break

      case 'zip':
        // For now, just download individual files (in a real app, you'd use a zip library)
        alert('ZIP export would require additional libraries. For now, use individual file downloads.')
        break
    }
  }

  const copyFileContent = () => {
    if (!generatedCode || !selectedFile) return
    const file = generatedCode.files.find(f => f.path === selectedFile)
    if (file) {
      const content = editedFiles[selectedFile] || file.content
      navigator.clipboard.writeText(content)
    }
  }

  const updateFileContent = (content: string) => {
    if (!selectedFile) return
    setEditedFiles(prev => ({
      ...prev,
      [selectedFile]: content
    }))
  }

  const getFileContent = (filePath: string) => {
    return editedFiles[filePath] || generatedCode?.files.find(f => f.path === filePath)?.content || ''
  }

  const hasBeenEdited = (filePath: string) => {
    return editedFiles[filePath] !== undefined
  }

  const startCollaboration = () => {
    setIsCollaborating(true)
    // Simulate adding collaborators
    setCollaborators(['Alice', 'Bob', 'Charlie'])
  }

  const stopCollaboration = () => {
    setIsCollaborating(false)
    setCollaborators([])
  }

  const optimizeCode = async (type: 'performance' | 'readability' | 'security' | 'all') => {
    if (!selectedFile || !generatedCode) return

    setAiProcessing(true)
    setShowAIPanel(true)
    
    try {
      const currentCode = getFileContent(selectedFile)
      const file = generatedCode.files.find(f => f.path === selectedFile)
      
      const response = await fetch('/api/optimize-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: currentCode,
          language: file?.language || 'plaintext',
          optimizationType: type
        })
      })

      if (!response.ok) {
        throw new Error('Failed to optimize code')
      }

      const data = await response.json()
      setAiResults({
        optimizedCode: data.optimizedCode,
        explanation: data.explanation,
        improvements: data.improvements
      })
    } catch (error) {
      console.error('Error optimizing code:', error)
      setAiResults({
        explanation: 'Failed to optimize code. Please try again.',
        improvements: []
      })
    } finally {
      setAiProcessing(false)
    }
  }

  const refactorCode = async (type: 'extract-function' | 'rename-variable' | 'simplify-logic' | 'add-types' | 'convert-to-modern') => {
    if (!selectedFile || !generatedCode) return

    setAiProcessing(true)
    setShowAIPanel(true)
    
    try {
      const currentCode = getFileContent(selectedFile)
      const file = generatedCode.files.find(f => f.path === selectedFile)
      
      const response = await fetch('/api/refactor-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: currentCode,
          language: file?.language || 'plaintext',
          refactorType: type
        })
      })

      if (!response.ok) {
        throw new Error('Failed to refactor code')
      }

      const data = await response.json()
      setAiResults({
        refactoredCode: data.refactoredCode,
        explanation: data.explanation,
        changes: data.changes
      })
    } catch (error) {
      console.error('Error refactoring code:', error)
      setAiResults({
        explanation: 'Failed to refactor code. Please try again.',
        changes: []
      })
    } finally {
      setAiProcessing(false)
    }
  }

  const applyAISuggestion = () => {
    if (!selectedFile) return

    if (aiResults.optimizedCode) {
      updateFileContent(aiResults.optimizedCode)
      saveVersion("AI optimization applied")
    } else if (aiResults.refactoredCode) {
      updateFileContent(aiResults.refactoredCode)
      saveVersion("AI refactoring applied")
    }
    
    setAiResults({})
    setShowAIPanel(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-2"
        >
          <div className="flex items-center justify-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Code className="w-10 h-10 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI Code Generation Platform
            </h1>
            <ThemeToggle />
          </div>
          <p className="text-lg text-muted-foreground">
            Generate complete applications with AI - No setup required
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Lightning Fast
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Code className="w-3 h-3" />
              Modern Tech Stack
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Collaboration Ready
            </Badge>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Project Setup
            </TabsTrigger>
            <TabsTrigger value="code" disabled={!generatedCode} className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Generated Code
              {generatedCode && (
                <Badge variant="secondary" className="ml-1">
                  {generatedCode.files.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Inputs */}
              <div className="space-y-6">
                {/* Project Context */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5 text-primary" />
                        Project Context
                      </CardTitle>
                      <CardDescription>
                        Basic information about your project
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="project-name">Project Name</Label>
                        <Input
                          id="project-name"
                          placeholder="My Awesome Project"
                          value={projectContext.name}
                          onChange={(e) => setProjectContext(prev => ({ ...prev, name: e.target.value }))}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="project-description">Description</Label>
                        <Textarea
                          id="project-description"
                          placeholder="Brief description of your project..."
                          value={projectContext.description}
                          onChange={(e) => setProjectContext(prev => ({ ...prev, description: e.target.value }))}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="project-type">Project Type</Label>
                          <Select value={projectContext.type} onValueChange={(value) => setProjectContext(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="web">Web Application</SelectItem>
                              <SelectItem value="mobile">Mobile App</SelectItem>
                              <SelectItem value="api">API Service</SelectItem>
                              <SelectItem value="desktop">Desktop App</SelectItem>
                              <SelectItem value="cli">CLI Tool</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project-scale">Scale</Label>
                          <Select value={projectContext.scale} onValueChange={(value) => setProjectContext(prev => ({ ...prev, scale: value }))}>
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="Select scale" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="enterprise">Enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="project-architecture">Architecture</Label>
                          <Select value={projectContext.architecture} onValueChange={(value) => setProjectContext(prev => ({ ...prev, architecture: value }))}>
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="Select architecture" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mvc">MVC</SelectItem>
                              <SelectItem value="microservices">Microservices</SelectItem>
                              <SelectItem value="serverless">Serverless</SelectItem>
                              <SelectItem value="monolith">Monolith</SelectItem>
                              <SelectItem value="event-driven">Event-Driven</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="project-deployment">Deployment</Label>
                          <Select value={projectContext.deployment} onValueChange={(value) => setProjectContext(prev => ({ ...prev, deployment: value }))}>
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="Select deployment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cloud">Cloud</SelectItem>
                              <SelectItem value="on-premise">On-Premise</SelectItem>
                              <SelectItem value="hybrid">Hybrid</SelectItem>
                              <SelectItem value="edge">Edge</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Technology Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Wand2 className="w-5 h-5 text-primary" />
                        Technology Stack
                      </CardTitle>
                      <CardDescription>
                        Select the technologies for your project
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(technologies).map(([category, techs]) => (
                          <div key={category} className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                              {category === 'Frontend' && <Monitor className="w-4 h-4" />}
                              {category === 'Backend' && <Server className="w-4 h-4" />}
                              {category === 'Database' && <Database className="w-4 h-4" />}
                              {category === 'Mobile' && <Smartphone className="w-4 h-4" />}
                              {category}
                            </Label>
                            <div className="flex flex-wrap gap-2">
                              {techs.map((tech) => (
                                <motion.div
                                  key={tech.name}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <div className="flex items-center gap-1 p-2 rounded-lg border bg-white/50 hover:bg-white/80 transition-all duration-200">
                                    <Checkbox
                                      id={`${category}-${tech.name}`}
                                      checked={selectedTech[category]?.name === tech.name}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          handleTechSelect(category, tech.name, tech.versions[0])
                                        } else {
                                          setSelectedTech(prev => {
                                            const newTech = { ...prev }
                                            delete newTech[category]
                                            return newTech
                                          })
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={`${category}-${tech.name}`}
                                      className="text-sm cursor-pointer flex items-center gap-1"
                                    >
                                      {tech.icon}
                                      {tech.name}
                                    </label>
                                    {selectedTech[category]?.name === tech.name && (
                                      <Select
                                        value={selectedTech[category].version}
                                        onValueChange={(version) => handleTechSelect(category, tech.name, version)}
                                      >
                                        <SelectTrigger className="w-16 h-6 text-xs">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {tech.versions.map((version) => (
                                            <SelectItem key={version} value={version}>
                                              {version}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    )}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* AI Provider Selection */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        AI Provider
                      </CardTitle>
                      <CardDescription>
                        Choose which AI service to use for code generation
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Select AI Provider</Label>
                        <div className="grid grid-cols-1 gap-2">
                          {aiProviders.map((provider) => (
                            <motion.div
                              key={provider.id}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div 
                                className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                  selectedAIProvider === provider.id 
                                    ? `border-primary bg-gradient-to-r ${provider.color} text-white` 
                                    : 'border-border bg-white/50 hover:bg-white/80'
                                }`}
                                onClick={() => setSelectedAIProvider(provider.id)}
                              >
                                <Checkbox
                                  id={`provider-${provider.id}`}
                                  checked={selectedAIProvider === provider.id}
                                  className="data-[state=checked]:bg-white data-[state=checked]:text-primary"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    {provider.icon}
                                    <label
                                      htmlFor={`provider-${provider.id}`}
                                      className={`text-sm font-medium cursor-pointer ${
                                        selectedAIProvider === provider.id ? 'text-white' : ''
                                      }`}
                                    >
                                      {provider.name}
                                    </label>
                                  </div>
                                  <p className={`text-xs ${
                                    selectedAIProvider === provider.id ? 'text-white/80' : 'text-muted-foreground'
                                  }`}>
                                    {provider.description}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Provider-specific inputs */}
                      {selectedAIProvider === "image" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <Label className="text-sm font-medium">Upload Image</Label>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white/50">
                            <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              id="image-upload"
                            />
                            <label
                              htmlFor="image-upload"
                              className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Click to upload image
                            </label>
                            {uploadedImage && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2"
                              >
                                <p className="text-xs text-green-600 font-medium">
                                  ✓ Uploaded: {uploadedImage.name}
                                </p>
                              </motion.div>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              PNG, JPG, or GIF files
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {selectedAIProvider === "figma" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <Label className="text-sm font-medium">Figma URL</Label>
                          <Input
                            placeholder="https://www.figma.com/file/..."
                            value={figmaUrl}
                            onChange={(e) => setFigmaUrl(e.target.value)}
                            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                          />
                          <p className="text-xs text-muted-foreground">
                            Enter the URL to your Figma design file
                          </p>
                        </motion.div>
                      )}

                      {selectedAIProvider === "template" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <Label className="text-sm font-medium">Select Template</Label>
                          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                            <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-primary/20">
                              <SelectValue placeholder="Choose a template" />
                            </SelectTrigger>
                            <SelectContent>
                              {templates.map((template) => (
                                <SelectItem key={template.id} value={template.id}>
                                  <div className="flex items-center gap-2">
                                    {template.icon}
                                    {template.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground">
                            Generate code from pre-built templates without AI
                          </p>
                        </motion.div>
                      )}

                      {/* API Key Inputs for traditional AI providers */}
                      {(selectedAIProvider === "claude" || selectedAIProvider === "openai" || selectedAIProvider === "google") && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <Label className="text-sm font-medium">API Key</Label>
                            {savedApiKeys.some(key => key.provider === selectedAIProvider && key.isActive) && (
                              <Badge variant="secondary" className="text-xs">
                                ✓ Saved
                              </Badge>
                            )}
                          </div>
                          
                          {savedApiKeys.some(key => key.provider === selectedAIProvider && key.isActive) ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Input
                                  type="password"
                                  value="••••••••••••••••••••••••••••••••"
                                  disabled
                                  className="transition-all duration-200 bg-muted"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setApiKeys(prev => ({
                                      ...prev,
                                      [selectedAIProvider]: ''
                                    }))
                                  }}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => deleteApiKey(selectedAIProvider)}
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                  Delete
                                </Button>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Your API key is securely stored and will be used automatically
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Input
                                type="password"
                                placeholder={`Enter your ${aiProviders.find(p => p.id === selectedAIProvider)?.name} API key`}
                                value={apiKeys[selectedAIProvider as keyof typeof apiKeys]}
                                onChange={(e) => setApiKeys(prev => ({
                                  ...prev,
                                  [selectedAIProvider]: e.target.value
                                }))}
                                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                              />
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const apiKey = apiKeys[selectedAIProvider as keyof typeof apiKeys]
                                    if (apiKey && apiKey !== '***saved***') {
                                      saveApiKey(selectedAIProvider, apiKey)
                                    }
                                  }}
                                  disabled={!apiKeys[selectedAIProvider as keyof typeof apiKeys] || apiKeys[selectedAIProvider as keyof typeof apiKeys] === '***saved***'}
                                >
                                  Save Key
                                </Button>
                                <p className="text-xs text-muted-foreground">
                                  Your API key is encrypted and stored securely
                                </p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Right Column - Requirements */}
              <div className="space-y-6">
                {/* Requirements */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        Requirements
                      </CardTitle>
                      <CardDescription>
                        Define what your project needs to accomplish
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="functional-req">Functional Requirements</Label>
                        <Textarea
                          id="functional-req"
                          placeholder="What should the system do? (e.g., User authentication, data management, reporting...)"
                          value={requirements.functional}
                          onChange={(e) => setRequirements(prev => ({ ...prev, functional: e.target.value }))}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 min-h-20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="non-functional-req">Non-Functional Requirements</Label>
                        <Textarea
                          id="non-functional-req"
                          placeholder="How should the system perform? (e.g., Performance, security, scalability...)"
                          value={requirements.nonFunctional}
                          onChange={(e) => setRequirements(prev => ({ ...prev, nonFunctional: e.target.value }))}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 min-h-20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="business-logic">Business Logic</Label>
                        <Textarea
                          id="business-logic"
                          placeholder="What business rules and workflows need to be implemented?"
                          value={requirements.businessLogic}
                          onChange={(e) => setRequirements(prev => ({ ...prev, businessLogic: e.target.value }))}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 min-h-20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="integrations">Integrations</Label>
                        <Textarea
                          id="integrations"
                          placeholder="What external systems or APIs need to be integrated?"
                          value={requirements.integrations}
                          onChange={(e) => setRequirements(prev => ({ ...prev, integrations: e.target.value }))}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20 min-h-20"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Generate Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Button 
                    onClick={generateCode} 
                    disabled={isGenerating || !projectContext.name}
                    className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isGenerating ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Generating Code...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Complete Application</span>
                        <Rocket className="w-5 h-5" />
                      </div>
                    )}
                  </Button>
                </motion.div>

                {/* Progress Indicator */}
                {isGenerating && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3"
                  >
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{generationStatus}</span>
                            <span className="text-sm text-muted-foreground">{generationProgress}%</span>
                          </div>
                          <Progress value={generationProgress} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="code" className="space-y-6">
            {generatedCode ? (
              <div className="space-y-6">
                {/* Action Bar */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between flex-wrap gap-4"
                >
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold">Generated Code</h2>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Code className="w-3 h-3" />
                      {generatedCode.files.length} files
                    </Badge>
                    {versionHistory.length > 0 && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <History className="w-3 h-3" />
                        {versionHistory.length} versions
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant={isPreviewMode ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIsPreviewMode(!isPreviewMode)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      {isPreviewMode ? "Edit Mode" : "Preview Mode"}
                    </Button>
                    
                    {!isPreviewMode && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Optimize
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => optimizeCode('performance')}>
                            <Zap className="w-4 h-4 mr-2" />
                            Optimize Performance
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => optimizeCode('readability')}>
                            <FileText className="w-4 h-4 mr-2" />
                            Improve Readability
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => optimizeCode('security')}>
                            <Shield className="w-4 h-4 mr-2" />
                            Enhance Security
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => optimizeCode('all')}>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Optimize All
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    
                    {!isPreviewMode && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <Wand2 className="w-4 h-4" />
                            Refactor
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => refactorCode('extract-function')}>
                            <Code className="w-4 h-4 mr-2" />
                            Extract Functions
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => refactorCode('rename-variable')}>
                            <Edit className="w-4 h-4 mr-2" />
                            Rename Variables
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => refactorCode('simplify-logic')}>
                            <GitBranch className="w-4 h-4 mr-2" />
                            Simplify Logic
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => refactorCode('add-types')}>
                            <Target className="w-4 h-4 mr-2" />
                            Add Types
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => refactorCode('convert-to-modern')}>
                            <Rocket className="w-4 h-4 mr-2" />
                            Modern Syntax
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    
                    {isCollaborating ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={stopCollaboration}
                        className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Users className="w-4 h-4" />
                        Stop Collaboration
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={startCollaboration}
                        className="flex items-center gap-2"
                      >
                        <Users className="w-4 h-4" />
                        Start Collaboration
                      </Button>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => saveVersion("Manual save")}
                      className="flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Version
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          Export
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => exportProject('json')}>
                          Export as JSON
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportProject('github')}>
                          Export for GitHub
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => exportProject('zip')}>
                          Export as ZIP
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </motion.div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* File Explorer */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-fit">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FolderOpen className="w-5 h-5 text-primary" />
                          Project Files
                        </CardTitle>
                        <CardDescription>
                          {generatedCode.files.length} files generated
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-96">
                          <div className="space-y-1">
                            {generatedCode.files.map((file) => (
                              <motion.button
                                key={file.path}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedFile(file.path)}
                                className={`w-full text-left p-3 rounded-lg flex items-center gap-2 hover:bg-accent transition-all duration-200 ${
                                  selectedFile === file.path ? 'bg-accent border-l-4 border-primary' : ''
                                }`}
                              >
                                {getLanguageIcon(file.language)}
                                <span className="text-sm truncate flex-1 text-left">{file.path}</span>
                                {hasBeenEdited(file.path) && (
                                  <Badge variant="secondary" className="text-xs">
                                    Edited
                                  </Badge>
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Code Editor / Preview */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="lg:col-span-2"
                  >
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm h-fit">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {isPreviewMode ? <Eye className="w-5 h-5 text-primary" /> : <Code className="w-5 h-5 text-primary" />}
                              {isPreviewMode ? "Live Preview" : "Code Editor"}
                            </CardTitle>
                            <CardDescription>
                              {selectedFile || 'Select a file to view'}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            {!isPreviewMode && (
                              <>
                                <Button variant="outline" size="sm" onClick={copyFileContent}>
                                  <Copy className="w-4 h-4 mr-1" />
                                  Copy
                                </Button>
                                <Button variant="outline" size="sm" onClick={downloadProject}>
                                  <Download className="w-4 h-4 mr-1" />
                                  Download
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {selectedFile ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground font-mono">
                                {selectedFile} {hasBeenEdited(selectedFile) && '(Edited)'}
                              </span>
                              {isCollaborating && (
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-green-600" />
                                  <span className="text-xs text-green-600">
                                    {collaborators.length} collaborating
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {isPreviewMode ? (
                              <div className="border rounded-lg overflow-hidden bg-white">
                                <div className="bg-gray-100 px-4 py-2 border-b flex items-center justify-between">
                                  <span className="text-sm font-medium">Preview</span>
                                  <Badge variant="outline" className="text-xs">
                                    Live Render
                                  </Badge>
                                </div>
                                <div className="p-4 min-h-96">
                                  {selectedFile.endsWith('.html') ? (
                                    <iframe
                                      srcDoc={getFileContent(selectedFile)}
                                      className="w-full h-96 border-0 rounded"
                                      title="Preview"
                                    />
                                  ) : (
                                    <div className="flex items-center justify-center h-96 text-muted-foreground">
                                      <div className="text-center">
                                        <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                        <p>Preview not available for this file type</p>
                                        <p className="text-sm">Switch to Edit Mode to view the code</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="border rounded-lg overflow-hidden">
                                <MonacoEditor
                                  height="400px"
                                  language={getLanguageMonaco(generatedCode.files.find(f => f.path === selectedFile)?.language || 'plaintext')}
                                  value={getFileContent(selectedFile)}
                                  onChange={(value) => updateFileContent(value || '')}
                                  theme="vs-light"
                                  options={{
                                    minimap: { enabled: false },
                                    fontSize: 14,
                                    lineNumbers: 'on',
                                    roundedSelection: false,
                                    scrollBeyondLastLine: false,
                                    automaticLayout: true,
                                    wordWrap: 'on',
                                    folding: true,
                                    showFoldingControls: 'always'
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-96 flex items-center justify-center text-muted-foreground">
                            <div className="text-center space-y-4">
                              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                                <Code className="w-8 h-8 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium">No File Selected</h3>
                                <p className="text-sm">Select a file from the explorer to view its contents</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* AI Results Panel */}
                <AnimatePresence>
                  {showAIPanel && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="lg:col-span-3"
                    >
                      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-primary" />
                              AI Assistant Results
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setShowAIPanel(false)
                                setAiResults({})
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {aiProcessing ? (
                            <div className="flex items-center justify-center py-8">
                              <div className="text-center space-y-4">
                                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
                                <p className="text-sm text-muted-foreground">
                                  AI is analyzing your code...
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {aiResults.explanation && (
                                <Alert>
                                  <Info className="w-4 h-4" />
                                  <AlertDescription>{aiResults.explanation}</AlertDescription>
                                </Alert>
                              )}
                              
                              {aiResults.improvements && aiResults.improvements.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Improvements Made:</h4>
                                  <ul className="space-y-1">
                                    {aiResults.improvements.map((improvement, index) => (
                                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        {improvement}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {aiResults.changes && aiResults.changes.length > 0 && (
                                <div>
                                  <h4 className="font-medium mb-2">Changes Applied:</h4>
                                  <ul className="space-y-1">
                                    {aiResults.changes.map((change, index) => (
                                      <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                                        <GitBranch className="w-4 h-4 text-blue-600" />
                                        {change}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {(aiResults.optimizedCode || aiResults.refactoredCode) && (
                                <div className="flex gap-2 pt-4">
                                  <Button onClick={applyAISuggestion} className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4" />
                                    Apply Changes
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => {
                                      setShowAIPanel(false)
                                      setAiResults({})
                                    }}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Project Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="w-5 h-5 text-primary" />
                          Setup Commands
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {generatedCode.setupCommands.map((cmd, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <code className="bg-muted px-3 py-2 rounded text-sm font-mono w-full">
                                {cmd}
                              </code>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <FolderOpen className="w-5 h-5 text-primary" />
                          Project Structure
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {generatedCode.projectStructure.map((item, index) => (
                            <div key={index} className="text-sm text-muted-foreground font-mono">
                              {item}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                  >
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Info className="w-5 h-5 text-primary" />
                          Explanation
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {generatedCode.explanation}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Version History */}
                {versionHistory.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <History className="w-5 h-5 text-primary" />
                          Version History
                        </CardTitle>
                        <CardDescription>
                          Track changes and restore previous versions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-48">
                          <div className="space-y-2">
                            {versionHistory.map((version) => (
                              <div
                                key={version.id}
                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                                onClick={() => restoreVersion(version.id)}
                              >
                                <div className="flex items-center gap-3">
                                  <GitBranch className="w-4 h-4 text-muted-foreground" />
                                  <div>
                                    <p className="text-sm font-medium">{version.description}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {version.timestamp.toLocaleString()}
                                    </p>
                                  </div>
                                </div>
                                <Button variant="outline" size="sm">
                                  Restore
                                </Button>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center h-96">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      <Code className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">No Code Generated Yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Go to Project Setup and configure your project to generate code
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}