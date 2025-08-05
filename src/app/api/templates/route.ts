import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Template data for seeding
const templateData = [
  {
    language: 'React',
    framework: 'Next.js',
    category: 'Frontend',
    base_prompt_structure: `# React/Next.js Code Generation Prompt

## Project Context
{{projectContext}}

## Technology Stack
{{technologyStack}}

## Requirements
{{requirements}}

## Implementation Instructions
{{implementationGuidelines}}`,
    common_patterns: JSON.stringify({
      components: ['Functional Components', 'Hooks', 'Context API', 'Custom Hooks'],
      stateManagement: ['useState', 'useReducer', 'Zustand', 'Redux'],
      styling: ['Tailwind CSS', 'Styled Components', 'CSS Modules'],
      routing: ['Next.js App Router', 'Next.js Pages Router'],
      dataFetching: ['SWR', 'React Query', 'Fetch API', 'Axios']
    }),
    best_practices: `Use functional components with hooks
Implement proper error boundaries
Follow component composition patterns
Use TypeScript for type safety
Implement proper state management
Use React.memo for performance optimization
Follow naming conventions: PascalCase for components, camelCase for functions
Use PropTypes or TypeScript for component prop validation
Implement proper accessibility (a11y) practices
Use semantic HTML elements`,
    coding_standards: `Follow ESLint configuration
Use Prettier for code formatting
Implement consistent import ordering
Use meaningful variable and function names
Add JSDoc comments for complex functions
Follow React-specific linting rules
Use TypeScript strict mode
Implement proper file structure and organization`,
    version_compatibility: JSON.stringify({
      '14': ['React 18', 'Node.js 18+'],
      '13': ['React 18', 'Node.js 18+'],
      '12': ['React 18', 'Node.js 16+']
    })
  },
  {
    language: 'Node.js',
    framework: 'Express.js',
    category: 'Backend',
    base_prompt_structure: `# Node.js/Express.js Code Generation Prompt

## Project Context
{{projectContext}}

## Technology Stack
{{technologyStack}}

## Requirements
{{requirements}}

## Implementation Instructions
{{implementationGuidelines}}`,
    common_patterns: JSON.stringify({
      architecture: ['MVC', 'Layered Architecture', 'Clean Architecture'],
      middleware: ['Authentication', 'Validation', 'Logging', 'Error Handling'],
      database: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
      authentication: ['JWT', 'OAuth', 'Session-based'],
      testing: ['Jest', 'Supertest', 'Sinon']
    }),
    best_practices: `Use async/await for asynchronous operations
Implement proper input validation with Joi or Zod
Use dependency injection for better testability
Follow RESTful API design principles
Implement proper HTTP status codes
Use middleware for cross-cutting concerns
Implement proper error handling middleware
Use environment variables for configuration
Follow security best practices
Implement proper logging and monitoring`,
    coding_standards: `Follow ESLint configuration with Node.js rules
Use Prettier for code formatting
Implement consistent error handling patterns
Use meaningful variable and function names
Add comprehensive error messages
Follow Node.js best practices for performance
Use proper module structure and organization
Implement proper async/await error handling
Use TypeScript for type safety`,
    version_compatibility: JSON.stringify({
      '20': ['ES2022', 'TypeScript 5+'],
      '18': ['ES2022', 'TypeScript 5+'],
      '16': ['ES2021', 'TypeScript 4+']
    })
  },
  {
    language: 'Python',
    framework: 'FastAPI',
    category: 'Backend',
    base_prompt_structure: `# Python/FastAPI Code Generation Prompt

## Project Context
{{projectContext}}

## Technology Stack
{{technologyStack}}

## Requirements
{{requirements}}

## Implementation Instructions
{{implementationGuidelines}}`,
    common_patterns: JSON.stringify({
      architecture: ['Clean Architecture', 'Onion Architecture', 'Hexagonal Architecture'],
      patterns: ['Dependency Injection', 'Repository Pattern', 'Unit of Work'],
      database: ['SQLAlchemy', 'Alembic', 'Psycopg2', 'Redis'],
      authentication: ['JWT', 'OAuth2', 'API Keys'],
      testing: ['Pytest', 'Pytest-cov', 'Factory Boy', 'Testcontainers']
    }),
    best_practices: `Follow PEP 8 coding standards
Use type hints for better code clarity
Implement proper exception handling
Use async/await for I/O operations
Follow FastAPI best practices
Use Pydantic for data validation
Implement proper dependency injection
Use environment variables for configuration
Follow security best practices
Implement proper logging and monitoring`,
    coding_standards: `Use Black for code formatting
Use isort for import sorting
Follow PEP 8 naming conventions
Use type hints consistently
Add comprehensive docstrings
Use proper error handling patterns
Follow FastAPI conventions
Use proper module structure
Implement proper async/await patterns
Use mypy for type checking`,
    version_compatibility: JSON.stringify({
      '0.104': ['Python 3.8+', 'Pydantic 2+'],
      '0.103': ['Python 3.7+', 'Pydantic 1+'],
      '0.100': ['Python 3.7+', 'Pydantic 1+']
    })
  },
  {
    language: 'PostgreSQL',
    framework: null,
    category: 'Database',
    base_prompt_structure: `# PostgreSQL Database Design Prompt

## Project Context
{{projectContext}}

## Technology Stack
{{technologyStack}}

## Requirements
{{requirements}}

## Implementation Instructions
{{implementationGuidelines}}`,
    common_patterns: JSON.stringify({
      design: ['Normalization', 'Indexing', 'Partitioning', 'Replication'],
      patterns: ['ACID Transactions', 'Foreign Keys', 'Constraints', 'Triggers'],
      performance: ['Query Optimization', 'Connection Pooling', 'Caching'],
      security: ['Row Level Security', 'Encryption', 'Access Control'],
      tools: ['PgAdmin', 'psql', 'Flyway', 'Alembic']
    }),
    best_practices: `Follow proper database normalization principles
Use appropriate data types for columns
Implement proper indexing strategies
Use foreign key constraints for data integrity
Implement proper transaction management
Use connection pooling for performance
Follow naming conventions for tables and columns
Implement proper backup and recovery strategies
Use parameterized queries to prevent SQL injection
Monitor database performance regularly`,
    coding_standards: `Use consistent naming conventions (snake_case)
Use meaningful table and column names
Implement proper constraints and validations
Use comments for complex business logic
Follow PostgreSQL best practices
Use appropriate data types and sizes
Implement proper indexing strategies
Use EXPLAIN ANALYZE for query optimization
Follow migration management best practices
Use proper schema organization`,
    version_compatibility: JSON.stringify({
      '16': ['Latest features, improved performance'],
      '15': ['JSON improvements, better performance'],
      '14': ['Enhanced security, performance optimizations']
    })
  },
  {
    language: 'MongoDB',
    framework: null,
    category: 'Database',
    base_prompt_structure: `# MongoDB Database Design Prompt

## Project Context
{{projectContext}}

## Technology Stack
{{technologyStack}}

## Requirements
{{requirements}}

## Implementation Instructions
{{implementationGuidelines}}`,
    common_patterns: JSON.stringify({
      design: ['Document Modeling', 'Embedding', 'Referencing', 'Denormalization'],
      patterns: ['Aggregation Pipeline', 'Indexing', 'Sharding', 'Replication'],
      performance: ['Query Optimization', 'Index Strategies', 'Read Preferences'],
      security: ['Authentication', 'Authorization', 'Encryption', 'Auditing'],
      tools: ['MongoDB Compass', 'MongoDB Atlas', 'Mongo Shell']
    }),
    best_practices: `Design appropriate document schema for use case
Use embedding for related data that's accessed together
Use referencing for many-to-many relationships
Implement proper indexing strategies
Use appropriate data types and structures
Follow MongoDB naming conventions
Implement proper validation rules
Use aggregation pipelines for complex queries
Implement proper security measures
Monitor database performance regularly`,
    coding_standards: `Use consistent naming conventions (camelCase)
Design documents based on access patterns
Use appropriate data types and structures
Implement proper validation rules
Use meaningful field names
Follow MongoDB best practices
Use proper indexing strategies
Implement proper error handling
Use appropriate sharding strategies
Follow backup and recovery procedures`,
    version_compatibility: JSON.stringify({
      '7.0': ['Latest features, improved performance'],
      '6.0': ['Time series collections, improved aggregation'],
      '5.0': ['Native time series, window functions']
    })
  }
]

// Seed templates if they don't exist
async function seedTemplates() {
  try {
    for (const template of templateData) {
      const existingTemplate = await db.template.findFirst({
        where: {
          language: template.language,
          framework: template.framework,
          category: template.category
        }
      })

      if (!existingTemplate) {
        await db.template.create({
          data: template
        })
        console.log(`Created template for ${template.language}${template.framework ? `/${template.framework}` : ''}`)
      }
    }
  } catch (error) {
    console.error('Error seeding templates:', error)
  }
}

// GET /api/templates - Get all templates
export async function GET(request: NextRequest) {
  try {
    // Seed templates first
    await seedTemplates()

    const { searchParams } = new URL(request.url)
    const language = searchParams.get('language')
    const category = searchParams.get('category')

    const where: any = {}
    if (language) where.language = language
    if (category) where.category = category

    const templates = await db.template.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { language: 'asc' },
        { framework: 'asc' }
      ]
    })

    return NextResponse.json({
      success: true,
      templates: templates.map(template => ({
        ...template,
        common_patterns: JSON.parse(template.common_patterns),
        version_compatibility: JSON.parse(template.version_compatibility)
      }))
    })
  } catch (error) {
    console.error('Error fetching templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    )
  }
}

// POST /api/templates - Create new template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      language,
      framework,
      category,
      base_prompt_structure,
      common_patterns,
      best_practices,
      coding_standards,
      version_compatibility
    } = body

    // Validate required fields
    if (!language || !category || !base_prompt_structure) {
      return NextResponse.json(
        { error: 'Missing required fields: language, category, or base_prompt_structure' },
        { status: 400 }
      )
    }

    const template = await db.template.create({
      data: {
        language,
        framework,
        category,
        base_prompt_structure,
        common_patterns: JSON.stringify(common_patterns || {}),
        best_practices,
        coding_standards,
        version_compatibility: JSON.stringify(version_compatibility || {})
      }
    })

    return NextResponse.json({
      success: true,
      template: {
        ...template,
        common_patterns: JSON.parse(template.common_patterns),
        version_compatibility: JSON.parse(template.version_compatibility)
      }
    })
  } catch (error) {
    console.error('Error creating template:', error)
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    )
  }
}