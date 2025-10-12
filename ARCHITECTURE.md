# Cognitive Design Environment (CDE) - Architecture Documentation

## Overview
This document serves as an index to the comprehensive CDE Master Interface Architecture v9, which provides detailed blueprints and technical specifications for the entire application.

## Core Philosophy: The Five Cognitive Layers
1. **Perception**: How users see and understand project state
2. **Creation**: How users bring new visual information into existence
3. **Memory**: How the system stores and recalls information
4. **Modification**: How users alter existing elements
5. **Augmentation**: How AI extends human cognition

## Key Architecture Components

### 1. Core System Architecture
- **1.1 Interface Composition**: Modular, component-based UI with dockable panels
- **1.2 Context & Project Memory**: Persistent state management across sessions
- **1.3 Viewports and Canvas Engine**: Infinite canvas with GPU-accelerated compositing
- **1.4 Undo/Redo Timeline System**: Branching history with visual timeline
- **1.5 AI Intelligence Layer**: Modular orchestration with semantic linking
- **1.6 Asset & Data Layer**: Intelligent asset graph with semantic search
- **1.7 GPU/Compute Orchestration**: Real-time rendering with graceful degradation
- **1.8 Data Security & Ethics**: End-to-end encryption and bias audits

### 2. User Interface Layout

#### 2.1 Global Top Bar
- Logo, Settings, Account, Project Management
- Project Tabs with + for new projects
- Canvas Helpers (Rulers, Guides, Snap)
- View Controls (Fit, Split View)
- Magnifier Presets (① / ②)
- History Controls (Undo/Redo/History)
- Voice I/O (Ear/Speak buttons)
- Ethics Alert indicator

#### 2.2 Left Toolbar
- Primary creative tools
- Positioned right of collapsible Settings Panel
- Tools organized contextually (selection tools grouped, etc.)

#### 2.3 Right-Side Panels System
**Three-Part Architecture:**
1. **Activator Bar**: Vertical icon bar on far-right edge
2. **Panel Drawer**: Main container (320px width) opening left of activator
3. **Special Layers Vertical Bar**: Compact mini-layers strip (64px) between canvas and panel drawer

**Panel Types:**
- Layers Panel (with Modifier Stack visualization)
- Properties/Inspector Panel
- ColorSphere Panel
- AI Tools Panel
- Microscope Panel

**Interaction Pattern:**
- Click activator icon to toggle corresponding panel
- Click same icon again to collapse panel
- Panels always fill full vertical height when open
- Close button at bottom of activator bar

#### 2.4 Bottom Bar
- Tool Hints (dynamic tips for active tool)
- Coordinate Readout (X/Y cursor position)
- Zoom % display
- History Scrub Timeline
- AI Status (GoT step, Bias Level)
- **Inspector Area**: Dynamic tool parameters (Size, Opacity, Hardness sliders)

#### 2.5 Special Layers Vertical Bar (LayerStripPanel)
- Persistent mini-layers overview
- 64px width between canvas and right panel
- Layer thumbnails with visibility/lock indicators
- Drag-and-drop reordering
- Click thumbnail to open detailed popover with controls

#### 2.6 Split View & Workspace Layout
- Horizontal/vertical canvas splitting
- Synchronized rulers, guides, grids
- Linkable zoom/pan
- Different view modes per split

#### 2.7 Left Mini Settings Strip
- Expanded mini settings bar (doubled width)
- Complete set of controls for active tool
- Buttons, toggles, micro-sliders tightly packed
- Collapsible to maximize canvas space

### 3. Global System Panels

#### 3.1 ColorSphere Panel
- 3D rotatable color sphere (LAB/HSV/HSL)
- Light Simulation Mode
- Perceptually uniform CIELAB space
- Data overlays for pixel coordinates, color deltas, AI clusters

#### 3.2 Feather & Edges Panel
- AI-powered edge management
- Context-aware boundary transitions
- GPU-accelerated real-time previews

#### 3.3 AI Tools System
**Tabs:**
- **Quick**: Pre-packaged AI actions
- **ICE** (Instructional Composition Environment):
  - Prompt Layers Panel (multiple references with prompts)
  - Visual Prompting Canvas (markup tools)
  - Prompt Assembly Engine (multi-modal composition)
  - AI Co-pilot (analyze & enhance prompts)
  - Cognitive Load Indicator
- **Outpaint**: Seamless outpainting with composite approach
- **Morph**: Structural morphing with source/target lines
- **Presets**: User-created preset library
- **Edit**: Image editing and inpainting

#### 3.4 Asset Browser System
**Two Access Modes:**
1. Docked Panel in right-side system
2. Full-Screen Modal from top bar

**Features:**
- Hybrid text + semantic search
- Category filters (Characters, Portraits, Landscapes, etc.)
- Asset Tabs for comparing multiple assets
- Specialized Asset Pages:
  - Characters: Expressions, Outfits variants
  - Automotive: Multi-angle views
  - Textures: Material properties, tiling demos
- Drag-and-drop to canvas
- Contextual actions menu

**Asset Graph Architecture:**
- Rich metadata objects (not simple files)
- AI auto-tagging on upload
- Vector embeddings for semantic search
- Lossless formats (PNG/WebP) for transparency
- Contextual previews for complex assets

#### 3.5 Global Mini Settings Strip
- Double-width collapsed state
- Full tool settings in compact form
- Positioned between left toolbar and canvas

#### 3.6 Cursor Zoom Panel
- Real-time magnified cursor view
- Customizable zoom level
- Pixel-perfect editing aid

#### 3.7 Microscope Panel
- Ultra-zoom pixel view (up to 3200%)
- Grid overlay toggle
- Crosshair toggle
- Pixel info display (RGB, HSL, Hex, Alpha)
- Magnification slider

#### 3.8 AI Chat Panel
- Conversational AI assistant
- API access to preset library
- Contextual recommendations
- GoT (Generation Chain-of-Thought) logs

### 4. Layer System Features

#### Modifier Stack Engine (5.5)
Every layer can have attached modifier layers:
- **Transparency Masks**: Alpha channel control
- **Warp Modifiers**: Non-destructive transformations
- **Color Adjustments**: Hue/Sat/Brightness
- **Effect Layers**: Filters and effects

**Visualization:**
- Nested list beneath primary layer in Layers Panel
- Expandable/collapsible modifier stack section
- Individual visibility toggles per modifier
- Also visible in LayerStripPanel popover

#### Layer Properties
- Name, thumbnail, visibility, lock status
- Opacity percentage
- Blend mode
- Hierarchical children support
- Drag-and-drop reordering

### 5. AI Integration

#### Nano Banana Integration
- Model: Google Gemini 2.5 Flash Image Preview
- Edge functions for generation and editing
- Lovable Cloud API integration
- Multi-modal prompting support

#### Edge Functions
- `generate-image`: Creates images from prompts
- `edit-image`: Edits/inpaints existing images

#### Supported AI Models (via Lovable Cloud)
- `google/gemini-2.5-pro`: Top-tier reasoning and multimodal
- `google/gemini-2.5-flash`: Balanced performance
- `google/gemini-2.5-flash-lite`: Fast and economical
- `openai/gpt-5`: Powerful all-rounder
- `openai/gpt-5-mini`: Cost-effective with strong performance
- `openai/gpt-5-nano`: Speed optimized

### 6. Design System

#### Color Tokens (HSL-based)
**Backgrounds:**
- `--cde-bg-primary`: 222 28% 8% (main canvas)
- `--cde-bg-secondary`: 222 24% 12% (panels)
- `--cde-bg-tertiary`: 222 20% 16% (toolbar)

**Text:**
- `--cde-text-primary`: 220 15% 98%
- `--cde-text-secondary`: 220 10% 70%
- `--cde-text-muted`: 220 8% 50%

**Accents:**
- `--cde-accent-purple`: 262 83% 58% (primary)
- `--cde-accent-blue`: 217 91% 60%
- `--cde-accent-cyan`: 187 85% 53%
- `--cde-accent-success`: 142 71% 45%
- `--cde-accent-warning`: 38 92% 50%

**Borders:**
- `--cde-border-subtle`: 222 20% 22%
- `--cde-border-emphasis`: 262 70% 45%

#### Gradients
- `--cde-gradient-primary`: Purple to blue
- `--cde-gradient-subtle`: Dark to darker

#### Shadows
- `--cde-shadow-sm/md/lg`: Progressive depth
- `--cde-shadow-glow`: Purple glow effect

#### Transitions
- `--cde-transition-fast`: 150ms cubic-bezier
- `--cde-transition-smooth`: 300ms cubic-bezier

### 7. Implementation Guidelines

#### Component Structure
- All panels are independent, stateful React components
- Use semantic tokens from design system (never hardcoded colors)
- Responsive and adaptive layouts
- Persistent state via project memory

#### State Management
- Project-level persistent state
- Auto-save on major changes
- Cross-project memory sharing for templates
- Tool parameter persistence

#### Performance
- GPU-accelerated compositing
- Intelligent caching for previews
- Graceful degradation for low-end systems
- Cloud GPU fallback for heavy AI tasks

#### Accessibility
- High-contrast modes
- Keyboard-first design
- Voice navigation (TTS/STT)
- Screen reader support

### 8. Future Roadmap

#### Planned Features
- AR/VR viewport support
- Collaborative editing
- GIF/animation support
- Plugin ecosystem
- Custom model integration
- Eco-tagging for sustainable assets

#### Ethical AI Features
- Bias detection and mitigation
- Diversity checks in generated content
- Content filters
- Transparent GoT logging
- User consent for data sharing

## Implementation Status

### ✅ Completed
- Right panel with vertical activator bar
- Mini layers strip (LayerStripPanel)
- Full layers panel with modifier stack
- Asset browser system (modal + docked)
- AI tools panel with ICE, Outpaint, Morph
- Microscope panel
- Mini settings strip
- Bottom bar with inspector area
- Design system tokens

### 🚧 In Progress
- Full AI preset library functionality
- Advanced tool settings panels
- Complete asset graph backend
- Semantic similarity search

### 📋 Planned
- History scrub timeline visualization
- ColorSphere 3D rendering
- AR/VR viewport support
- Real-time collaboration
- Plugin ecosystem

## Reference
For complete architectural details, see the Master-photo.docx document which contains the full v9 specification with detailed UI schematics, philosophical foundations, and technical implementations.
