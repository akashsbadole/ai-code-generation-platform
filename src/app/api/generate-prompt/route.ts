import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

interface PromptGenerationRequest {
  projectContext: {
    name: string
    description: string
    type: string
    scale: string
    architecture: string
    deployment: string
  }
  selectedTech: { [key: string]: { name: string; version: string } }
  requirements: {
    functional: string
    nonFunctional: string
    businessLogic: string
    integrations: string
  }
  selectedAI: string[]
}

interface TechnologyGuidelines {
  [key: string]: {
    setup: string
    architecture: string
    bestPractices: string
    testing: string
    security: string
    performance: string
  }
}

const technologyGuidelines: TechnologyGuidelines = {
  'React': {
    setup: `Use Create React App or Vite for project setup
Install required dependencies: react, react-dom, @types/react, @types/react-dom
Configure TypeScript for type safety
Set up ESLint and Prettier for code quality
Use Tailwind CSS or styled-components for styling`,
    architecture: `Follow component-based architecture
Use functional components with hooks
Implement proper state management (useState, useReducer, Context API, Redux/Zustand)
Create custom hooks for reusable logic
Follow folder structure: components/, hooks/, utils/, services/, types/`,
    bestPractices: `Use TypeScript interfaces and types
Implement proper error boundaries
Use React.memo for performance optimization
Follow naming conventions: PascalCase for components, camelCase for functions
Use PropTypes or TypeScript for component prop validation`,
    testing: `Use React Testing Library and Jest
Write unit tests for components and hooks
Implement integration tests for user flows
Use Mock Service Worker for API mocking
Achieve high test coverage with meaningful tests`,
    security: `Sanitize user inputs to prevent XSS attacks
Use HTTPS for all API calls
Implement proper authentication and authorization
Validate all external data
Use Content Security Policy (CSP) headers`,
    performance: `Implement code splitting with React.lazy and Suspense
Use React.memo and useMemo for optimization
Implement virtual scrolling for large lists
Optimize bundle size with tree shaking
Use performance monitoring tools`
  },
  'Node.js': {
    setup: `Initialize project with npm init
Install Express.js or Fastify for web framework
Set up TypeScript configuration
Configure environment variables with dotenv
Set up proper logging with Winston or Bunyan`,
    architecture: `Follow MVC or layered architecture
Separate routes, controllers, services, and models
Use middleware for authentication, validation, and logging
Implement proper error handling middleware
Follow folder structure: routes/, controllers/, services/, models/, middleware/`,
    bestPractices: `Use async/await for asynchronous operations
Implement proper input validation with Joi or Zod
Use dependency injection for better testability
Follow RESTful API design principles
Implement proper HTTP status codes`,
    testing: `Use Jest and Supertest for API testing
Write unit tests for services and utilities
Implement integration tests for API endpoints
Use sinon for mocking dependencies
Set up test databases for integration testing`,
    security: `Implement rate limiting to prevent brute force attacks
Use helmet for security headers
Validate and sanitize all user inputs
Implement proper authentication (JWT, OAuth)
Use CORS properly and avoid wildcard origins`,
    performance: `Implement caching strategies (Redis, in-memory)
Use connection pooling for databases
Implement compression middleware
Use clustering for multi-core utilization
Monitor performance with APM tools`
  },
  'Python': {
    setup: `Use virtual environment for dependency management
Install required framework (FastAPI, Flask, Django)
Set up pyproject.toml or requirements.txt
Configure type hints with mypy
Set up pre-commit hooks for code quality`,
    architecture: `Follow clean architecture principles
Separate concerns into distinct layers
Use dependency injection pattern
Implement proper exception handling
Follow folder structure: app/, models/, services/, api/, utils/`,
    bestPractices: `Follow PEP 8 coding standards
Use type hints for better code clarity
Implement proper logging configuration
Use dataclasses for structured data
Follow DRY (Don't Repeat Yourself) principle`,
    testing: `Use pytest for testing framework
Write unit tests with proper fixtures
Use pytest-cov for coverage reporting
Implement integration tests with test containers
Mock external dependencies with unittest.mock`,
    security: `Use input validation and sanitization
Implement proper authentication and authorization
Use environment variables for sensitive data
Implement CSRF protection for web forms
Use HTTPS and secure cookie settings`,
    performance: `Use async/await with FastAPI for async operations
Implement caching with Redis or Memcached
Use connection pooling for databases
Optimize database queries with proper indexing
Use profiling tools to identify bottlenecks`
  },
  'PostgreSQL': {
    setup: `Install PostgreSQL and create database
Set up connection pooling with PgBouncer
Configure proper backup strategies
Set up monitoring and alerting
Use migration tools like Flyway or Alembic`,
    architecture: `Follow proper database normalization
Use appropriate indexing strategies
Implement partitioning for large tables
Set up proper user roles and permissions
Design for scalability and performance`,
    bestPractices: `Use transactions for data consistency
Implement proper foreign key constraints
Use appropriate data types for columns
Follow naming conventions for tables and columns
Document database schema with comments`,
    testing: `Use test databases for development
Write integration tests for database operations
Use database seeding for test data
Implement proper rollback mechanisms
Test database migrations thoroughly`,
    security: `Implement proper user authentication
Use SSL/TLS for database connections
Encrypt sensitive data at rest
Implement proper access controls
Regularly update and patch database`,
    performance: `Use proper indexing strategies
Implement query optimization
Use connection pooling
Monitor query performance
Implement proper backup strategies`
  },
  'MongoDB': {
    setup: `Install MongoDB and configure replica set
Set up proper authentication and authorization
Configure backup strategies
Set up monitoring and profiling
Use MongoDB Atlas for managed services`,
    architecture: `Design document schema for your use case
Use appropriate indexing strategies
Implement sharding for horizontal scaling
Set up proper data modeling patterns
Design for read/write performance`,
    bestPractices: `Use appropriate data types and structures
Implement proper validation rules
Use embedded documents for related data
Follow naming conventions for collections
Document schema design decisions`,
    testing: `Use MongoDB Memory Server for testing
Write integration tests for database operations
Test with realistic data volumes
Implement proper test data setup
Test aggregation pipelines thoroughly`,
    security: `Implement proper authentication mechanisms
Use role-based access control (RBAC)
Enable encryption for data at rest
Use field-level encryption for sensitive data
Implement proper network security`,
    performance: `Use appropriate indexing strategies
Optimize query patterns
Use read preferences
Use aggregation pipelines efficiently
Monitor performance with MongoDB tools`
  }
}

function generateTechnologySpecificGuidelines(techStack: { [key: string]: { name: string; version: string } }, templates: any[]): string {
  let guidelines = ""

  Object.entries(techStack).forEach(([category, tech]) => {
    // Find template for this technology
    const template = templates.find(t => 
      t.language.toLowerCase() === tech.name.toLowerCase() || 
      (t.framework && t.framework.toLowerCase() === tech.name.toLowerCase())
    )

    if (template) {
      guidelines += `\n#### ${category} (${tech.name} v${tech.version})\n`
      guidelines += `**Best Practices:**\n${template.best_practices}\n\n`
      guidelines += `**Coding Standards:**\n${template.coding_standards}\n\n`
      
      const commonPatterns = template.common_patterns
      if (commonPatterns && Object.keys(commonPatterns).length > 0) {
        guidelines += `**Common Patterns:**\n`
        Object.entries(commonPatterns).forEach(([key, patterns]) => {
          guidelines += `- **${key.charAt(0).toUpperCase() + key.slice(1)}**: ${Array.isArray(patterns) ? patterns.join(', ') : patterns}\n`
        })
        guidelines += '\n'
      }

      const versionCompatibility = template.version_compatibility
      if (versionCompatibility && versionCompatibility[tech.version]) {
        guidelines += `**Version ${tech.version} Notes:** ${versionCompatibility[tech.version]}\n\n`
      }
    } else {
      // Fallback to hardcoded guidelines
      const techGuidelines = technologyGuidelines[tech.name]
      if (techGuidelines) {
        guidelines += `\n#### ${category} (${tech.name} v${tech.version})\n`
        guidelines += `**Setup Instructions:**\n${techGuidelines.setup}\n\n`
        guidelines += `**Architecture Guidelines:**\n${techGuidelines.architecture}\n\n`
        guidelines += `**Best Practices:**\n${techGuidelines.bestPractices}\n\n`
        guidelines += `**Testing Strategy:**\n${techGuidelines.testing}\n\n`
        guidelines += `**Security Considerations:**\n${techGuidelines.security}\n\n`
        guidelines += `**Performance Optimization:**\n${techGuidelines.performance}\n\n`
      } else {
        guidelines += `\n#### ${category} (${tech.name} v${tech.version})\n`
        guidelines += `- Follow ${tech.name} v${tech.version} best practices and conventions\n`
        guidelines += `- Use version ${tech.version} specific features and APIs\n`
        guidelines += `- Implement proper error handling and logging\n`
        guidelines += `- Follow security best practices for ${tech.name}\n`
        guidelines += `- Ensure code is well-documented and maintainable\n\n`
      }
    }
  })

  return guidelines
}

function analyzeRequirements(requirements: PromptGenerationRequest['requirements']): {
  keyFeatures: string[]
  performanceNeeds: string[]
  securityNeeds: string[]
  integrationPoints: string[]
} {
  const keyFeatures: string[] = []
  const performanceNeeds: string[] = []
  const securityNeeds: string[] = []
  const integrationPoints: string[] = []

  // Analyze functional requirements
  if (requirements.functional.toLowerCase().includes('auth') || requirements.functional.toLowerCase().includes('login')) {
    keyFeatures.push('User Authentication System')
    securityNeeds.push('Implement secure authentication (JWT, OAuth)')
  }

  if (requirements.functional.toLowerCase().includes('api')) {
    keyFeatures.push('RESTful API Endpoints')
    performanceNeeds.push('Optimize API response times')
  }

  if (requirements.functional.toLowerCase().includes('database') || requirements.functional.toLowerCase().includes('data')) {
    keyFeatures.push('Data Management System')
    performanceNeeds.push('Optimize database queries')
  }

  if (requirements.functional.toLowerCase().includes('upload') || requirements.functional.toLowerCase().includes('file')) {
    keyFeatures.push('File Upload/Management')
    securityNeeds.push('Validate file uploads and implement size limits')
  }

  // Analyze non-functional requirements
  if (requirements.nonFunctional.toLowerCase().includes('performance') || requirements.nonFunctional.toLowerCase().includes('speed')) {
    performanceNeeds.push('Implement caching strategies')
    performanceNeeds.push('Use lazy loading and code splitting')
  }

  if (requirements.nonFunctional.toLowerCase().includes('security') || requirements.nonFunctional.toLowerCase().includes('secure')) {
    securityNeeds.push('Implement input validation and sanitization')
    securityNeeds.push('Use HTTPS and security headers')
  }

  if (requirements.nonFunctional.toLowerCase().includes('scalable') || requirements.nonFunctional.toLowerCase().includes('scale')) {
    performanceNeeds.push('Design for horizontal scaling')
    performanceNeeds.push('Use load balancing strategies')
  }

  // Analyze integration requirements
  if (requirements.integrations.toLowerCase().includes('api') || requirements.integrations.toLowerCase().includes('external')) {
    integrationPoints.push('External API Integration')
    performanceNeeds.push('Implement API rate limiting and caching')
  }

  if (requirements.integrations.toLowerCase().includes('database') || requirements.integrations.toLowerCase().includes('db')) {
    integrationPoints.push('Database Integration')
    performanceNeeds.push('Optimize database connection pooling')
  }

  if (requirements.integrations.toLowerCase().includes('payment') || requirements.integrations.toLowerCase().includes('stripe')) {
    integrationPoints.push('Payment Gateway Integration')
    securityNeeds.push('Implement PCI DSS compliance')
  }

  return { keyFeatures, performanceNeeds, securityNeeds, integrationPoints }
}

function generateArchitectureGuidelines(projectContext: PromptGenerationRequest['projectContext']): string {
  let architecture = ""

  switch (projectContext.architecture.toLowerCase()) {
    case 'mvc':
      architecture = `**MVC Architecture Guidelines:**
- Separate concerns into Model, View, and Controller layers
- Models handle data logic and database interactions
- Views handle presentation and user interface
- Controllers handle business logic and coordinate between models and views
- Implement proper routing and URL structure
- Use dependency injection for loose coupling`
      break
    case 'microservices':
      architecture = `**Microservices Architecture Guidelines:**
- Design services around business capabilities
- Each service should be independently deployable
- Implement proper service discovery and registry
- Use API Gateway for external communication
- Implement inter-service communication (REST, gRPC, messaging)
- Design for failure and implement circuit breakers
- Use containerization (Docker) for deployment`
      break
    case 'monolithic':
      architecture = `**Monolithic Architecture Guidelines:**
- Maintain clear module boundaries within the application
- Use layered architecture (presentation, business, data)
- Implement proper dependency management
- Design for future modularity and potential microservice migration
- Use internal APIs for communication between modules
- Implement proper error handling and logging`
      break
    case 'serverless':
      architecture = `**Serverless Architecture Guidelines:**
- Design functions around specific business operations
- Keep functions small and focused on single responsibilities
- Implement proper state management (external services, databases)
- Use event-driven architecture patterns
- Design for cold start optimization
- Implement proper monitoring and logging
- Use managed services for databases and storage`
      break
    default:
      architecture = `**General Architecture Guidelines:**
- Follow clean architecture principles
- Separate concerns into distinct layers
- Implement proper dependency injection
- Design for scalability and maintainability
- Use appropriate design patterns for the use case
- Implement proper error handling and logging`
  }

  // Add scale-specific considerations
  if (projectContext.scale === 'enterprise') {
    architecture += `\n\n**Enterprise-Scale Considerations:**
- Implement comprehensive logging and monitoring
- Use distributed tracing for performance analysis
- Implement proper security policies and compliance
- Design for high availability and disaster recovery
- Use enterprise-grade security measures
- Implement proper governance and documentation standards`
  } else if (projectContext.scale === 'medium') {
    architecture += `\n\n**Medium-Scale Considerations:**
- Implement proper monitoring and alerting
- Design for growth and scalability
- Use appropriate caching strategies
- Implement proper backup and recovery procedures
- Follow security best practices`
  } else {
    architecture += `\n\n**Small-Scale Considerations:**
- Keep the architecture simple and maintainable
- Focus on core functionality first
- Use managed services to reduce operational overhead
- Implement basic security measures
- Design for easy deployment and maintenance`
  }

  return architecture
}

export async function POST(request: NextRequest) {
  try {
    const body: PromptGenerationRequest = await request.json()

    const { projectContext, selectedTech, requirements, selectedAI } = body

    // Validate required fields
    if (!projectContext.name || !projectContext.type || Object.keys(selectedTech).length === 0 || selectedAI.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields: project name, type, technology stack, or AI providers' },
        { status: 400 }
      )
    }

    // Fetch templates from database
    let templates = []
    try {
      const templateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/templates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (templateResponse.ok) {
        const templateData = await templateResponse.json()
        templates = templateData.templates || []
      }
    } catch (templateError) {
      console.error('Error fetching templates:', templateError)
      // Continue without templates if fetch fails
    }

    // Analyze requirements to extract key insights
    const analysis = analyzeRequirements(requirements)

    // Generate architecture guidelines
    const architectureGuidelines = generateArchitectureGuidelines(projectContext)

    // Generate technology-specific guidelines using templates
    const technologyGuidelines = generateTechnologySpecificGuidelines(selectedTech, templates)

    // Generate the comprehensive prompt
    const generatedPrompt = `# Code Generation Prompt: ${projectContext.name}

## Project Overview
**Project Name:** ${projectContext.name}
**Description:** ${projectContext.description || 'No description provided'}
**Type:** ${projectContext.type}
**Scale:** ${projectContext.scale}
**Architecture:** ${projectContext.architecture}
**Deployment Environment:** ${projectContext.deployment}

## Technology Stack
${Object.entries(selectedTech).map(([category, tech]) => 
  `- **${category}:** ${tech.name} v${tech.version}`
).join('\n')}

## Requirements Analysis

### Key Features Identified
${analysis.keyFeatures.length > 0 ? analysis.keyFeatures.map(feature => `- ${feature}`).join('\n') : '- No specific features identified from requirements'}

### Performance Requirements
${analysis.performanceNeeds.length > 0 ? analysis.performanceNeeds.map(need => `- ${need}`).join('\n') : '- No specific performance requirements identified'}

### Security Requirements
${analysis.securityNeeds.length > 0 ? analysis.securityNeeds.map(need => `- ${need}`).join('\n') : '- No specific security requirements identified'}

### Integration Points
${analysis.integrationPoints.length > 0 ? analysis.integrationPoints.map(point => `- ${point}`).join('\n') : '- No specific integration requirements identified'}

## Detailed Requirements

### Functional Requirements
${requirements.functional || 'No functional requirements specified'}

### Non-Functional Requirements
${requirements.nonFunctional || 'No non-functional requirements specified'}

### Business Logic
${requirements.businessLogic || 'No business logic specified'}

### Integration Requirements
${requirements.integrations || 'No integration requirements specified'}

## Architecture Guidelines
${architectureGuidelines}

## Technology-Specific Implementation Guidelines
${technologyGuidelines}

## Code Quality Standards

### General Guidelines
- Write clean, readable, and maintainable code
- Follow established coding standards for each technology
- Use meaningful variable and function names
- Implement proper error handling and logging
- Add comprehensive comments and documentation
- Follow DRY (Don't Repeat Yourself) principle
- Implement proper separation of concerns

### Project Structure Recommendations
Create a logical folder structure that supports the ${projectContext.architecture} pattern:

\`\`\`
${projectContext.name.toLowerCase()}/
├── src/
│   ├── components/          # UI components (for frontend)
│   ├── pages/              # Page components (for frontend)
│   ├── services/           # Business logic services
│   ├── controllers/        # API controllers (for backend)
│   ├── models/             # Data models and schemas
│   ├── utils/              # Utility functions
│   ├── types/              # TypeScript type definitions
│   ├── config/             # Configuration files
│   ├── middleware/         # Middleware functions
│   └── tests/              # Test files
├── public/                 # Static assets
├── docs/                   # Documentation
├── scripts/                # Build and deployment scripts
└── config/                 # Configuration files
\`\`\`

### Development Workflow
1. **Setup Phase:**
   - Initialize project with appropriate tools
   - Set up version control (Git)
   - Configure development environment
   - Install necessary dependencies

2. **Development Phase:**
   - Implement core functionality following the architecture
   - Write comprehensive tests
   - Implement proper error handling
   - Add logging and monitoring

3. **Testing Phase:**
   - Unit testing for individual components
   - Integration testing for component interactions
   - End-to-end testing for user workflows
   - Performance testing for scalability

4. **Deployment Phase:**
   - Set up CI/CD pipeline
   - Configure deployment environment
   - Implement monitoring and alerting
   - Set up backup and recovery procedures

## Security Best Practices
- Implement proper input validation and sanitization
- Use parameterized queries to prevent SQL injection
- Implement proper authentication and authorization
- Use HTTPS and security headers
- Validate and sanitize all user inputs
- Implement proper error handling (avoid information leakage)
- Use secure coding practices for each technology
- Implement proper session management
- Use encryption for sensitive data

## Performance Optimization
- Implement appropriate caching strategies
- Optimize database queries and use proper indexing
- Use lazy loading and code splitting
- Implement proper connection pooling
- Use compression for assets and API responses
- Implement proper monitoring and performance analysis
- Use CDN for static assets
- Optimize images and other media files

## Testing Strategy
### Unit Testing
- Test individual components and functions
- Use appropriate testing frameworks for each technology
- Mock external dependencies
- Achieve high code coverage

### Integration Testing
- Test component interactions
- Test API endpoints and database operations
- Use test databases and mock services
- Test error scenarios and edge cases

### End-to-End Testing
- Test complete user workflows
- Use browser automation tools for frontend
- Test API contracts and data flow
- Test deployment and infrastructure

## Documentation Requirements
- Create comprehensive README with setup instructions
- Document API endpoints with examples
- Add inline code comments for complex logic
- Create architecture diagrams and flowcharts
- Document deployment procedures
- Add troubleshooting guides

## Next Steps and Deliverables
1. **Immediate Actions:**
   - Set up development environment
   - Initialize project structure
   - Configure version control
   - Install dependencies

2. **Core Implementation:**
   - Implement main features based on requirements
   - Set up database schema and models
   - Create API endpoints and business logic
   - Implement user interface components

3. **Quality Assurance:**
   - Write comprehensive tests
   - Implement security measures
   - Optimize performance
   - Add monitoring and logging

4. **Deployment:**
   - Set up CI/CD pipeline
   - Configure deployment environment
   - Implement monitoring and alerting
   - Create backup and recovery procedures

---
*This prompt is optimized for: ${selectedAI.map(aiId => {
  const providers = {
    'claude': 'Claude AI',
    'chatgpt': 'ChatGPT',
    'gemini': 'Google Gemini',
    'zai': 'Z.ai',
    'ollama': 'Ollama',
    'copilot': 'GitHub Copilot'
  }
  return providers[aiId as keyof typeof providers] || aiId
}).join(', ')}*

*Generated on: ${new Date().toISOString()}*`

    // Save to database (optional - you might want to save projects and prompts)
    try {
      // Create project record
      const project = await db.project.create({
        data: {
          name: projectContext.name,
          description: projectContext.description,
          technology_stack: JSON.stringify(selectedTech),
          project_type: projectContext.type,
          scale: projectContext.scale,
          architecture_pattern: projectContext.architecture,
          deployment_environment: projectContext.deployment,
          requirements: JSON.stringify(requirements)
        }
      })

      // Save generated prompt
      await db.generatedPrompt.create({
        data: {
          project_id: project.id,
          language: Object.keys(selectedTech).join(','),
          generated_prompt_text: generatedPrompt,
          context_data: JSON.stringify({
            selectedAI,
            analysis,
            architectureGuidelines
          })
        }
      })
    } catch (dbError) {
      console.error('Database save error:', dbError)
      // Continue even if database save fails
    }

    return NextResponse.json({
      success: true,
      prompt: generatedPrompt,
      analysis
    })

  } catch (error) {
    console.error('Prompt generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    )
  }
}