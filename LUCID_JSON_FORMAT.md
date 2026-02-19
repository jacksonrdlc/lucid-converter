# How Lucid Accepts JSON Data

## Overview

Lucidchart accepts diagram data through the REST API import endpoint using the **Standard Import format**. This is packaged as `.lucid` files, which are ZIP archives containing a `document.json` file.

## 📦 .lucid File Structure

A `.lucid` file is a **ZIP archive** containing:

```
my-diagram.lucid
└── document.json (required)
```

## 📝 document.json Format

The `document.json` file contains the diagram structure in Lucid's standard import format:

```json
{
  "version": 1,
  "id": "page1",
  "name": "Page Name",
  "children": [
    // shapes and connectors here
  ]
}
```

### Required Fields

- **`version`** (number) - Schema version, currently `1`
- **`id`** (string) - Unique identifier for the page
- **`name`** (string) - Display name of the page/diagram
- **`children`** (array) - Array of shape and connector objects

## 🔷 Shape Objects

Each shape in the diagram is an object in the `children` array:

```json
{
  "id": "shape1",
  "type": "shape",
  "shapeType": "rectangle",
  "x": 100,
  "y": 100,
  "width": 200,
  "height": 100,
  "text": {
    "content": "My Text"
  },
  "fill": "#5B21B6",
  "fontColor": "#ffffff",
  "strokeColor": "#000000"
}
```

### Shape Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier (required for connectors to reference) |
| `type` | string | Always `"shape"` |
| `shapeType` | string | `"rectangle"`, `"circle"`, `"ellipse"`, etc. |
| `x` | number | X coordinate in pixels |
| `y` | number | Y coordinate in pixels |
| `width` | number | Width in pixels |
| `height` | number | Height in pixels |
| `text` | object | Object with `content` property (the text inside the shape) |
| `fill` | string | Background color (hex format like `"#FF0000"`) |
| `fontColor` | string | Text color (hex format) |
| `strokeColor` | string | Border color (hex format) |

### Supported Shape Types

- `rectangle`
- `circle`
- `ellipse`
- `diamond`
- `triangle`
- `hexagon`
- `pentagon`
- `cylinder`
- `parallelogram`
- `trapezoid`
- And many more...

## 🔗 Connector Objects

Connectors are lines connecting shapes:

```json
{
  "id": "connector1",
  "type": "connector",
  "shape": "straight",
  "startShapeId": "shape1",
  "endShapeId": "shape2",
  "label": "connects to"
}
```

### Connector Properties

| Property | Type | Description |
|----------|------- |-------------|
| `id` | string | Unique identifier |
| `type` | string | Always `"connector"` |
| `shape` | string | `"straight"`, `"curved"`, `"elbow"`, `"wavy"`, etc. |
| `startShapeId` | string | ID of the starting shape |
| `endShapeId` | string | ID of the ending shape |
| `label` | string | Text label on the connector (optional) |

## 🚀 How Our App Works

1. **Generate Diagram Data** - Convert architecture data to shape/connector objects
2. **Create document.json** - Build the Lucid standard format JSON
3. **Create .lucid ZIP** - Package document.json into a ZIP file using JSZip
4. **Upload via API** - Send the .lucid file to Lucidchart's import endpoint
5. **Open in Editor** - Document opens automatically in Lucidchart

## 📋 Example: Complete Diagram

```json
{
  "version": 1,
  "id": "page1",
  "name": "AgentCore Architecture",
  "children": [
    {
      "id": "teams",
      "type": "shape",
      "shapeType": "rectangle",
      "x": 50,
      "y": 100,
      "width": 140,
      "height": 180,
      "text": {
        "content": "Microsoft Teams\nHITL Interface"
      },
      "fill": "#5B21B6",
      "fontColor": "#ffffff"
    },
    {
      "id": "aws",
      "type": "shape",
      "shapeType": "rectangle",
      "x": 250,
      "y": 100,
      "width": 650,
      "height": 580,
      "text": {
        "content": "AWS Cloud\nMSAP"
      },
      "fill": "#F6F9FF",
      "strokeColor": "#3B82F6"
    },
    {
      "id": "conn1",
      "type": "connector",
      "shape": "straight",
      "startShapeId": "teams",
      "endShapeId": "aws",
      "label": "input"
    }
  ]
}
```

## ✅ Our Implementation

**File**: `src/utils/lucidchartAPI.js`

- `importDiagramJSON(data, title, folderId)` - Takes architecture data, generates .lucid ZIP, imports to Lucidchart
- `importDocument(fileData, fileType, title, folderId)` - Generic file import for .lucid, .drawio, .vsdx, etc.

**Dependency**: `jszip` (installed automatically)

## 🔍 Testing

Test the import in your app:
1. Go to http://localhost:5175/
2. Click "Lucid API" button
3. Select "Import" tab
4. Click "📤 Create Diagram Document"
5. The diagram will be created and opened in Lucidchart!

## 📚 Resources

- [Lucidchart REST API Docs](https://developer.lucid.app/docs/rest-api)
- [Standard Import Reference](https://developer.lucid.app/docs/standard-import)
- [JSZip Documentation](https://stuk.github.io/jszip/)

