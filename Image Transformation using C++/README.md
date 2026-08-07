# Image Transformation using C++

A comprehensive C++ application for advanced image processing and transformation. This project demonstrates professional image manipulation techniques including rotation, enhancement, edge detection, and derivative analysis on grayscale images.

## 📋 Project Overview

This system enables users to:
- Load and manipulate grayscale images from disk
- Apply geometric transformations (rotation in 90-degree increments)
- Enhance image quality using histogram equalization
- Detect edges using Sobel operators
- Calculate image derivatives for analysis
- Save modified images in PPM format
- Manage game state with save/load functionality for complex applications

## 🎯 Core Features

### Image Processing Operations
- **Image Loading**: Parse PPM (Portable Pixmap) format images with full metadata
- **Image Rotation**: Clockwise and counter-clockwise 90-degree rotations
- **Histogram Equalization**: Enhance image contrast and brightness distribution
- **Edge Detection**: Sobel operator-based edge detection algorithms
- **Derivative Calculation**: First-order derivatives for image analysis

### Advanced Algorithms
- **Sobel Operators**: X and Y directional edge detection using 3x3 kernel convolution
- **Histogram Equalization**: Cumulative Distribution Function (CDF) based image enhancement
- **Grayscale Processing**: Full support for 8-bit to 16-bit grayscale images
- **Efficient Vector Operations**: Using std::vector for dynamic 2D image arrays

### Additional Capabilities
- Game state management with persistent save/load system
- File I/O operations for image input/output
- Metadata preservation (comments, dimensions, pixel values)
- Error handling and validation for all operations

## 🛠️ Technologies Used
- **Language**: C++ (STL: vector, algorithm, cmath libraries)
- **Image Format**: PPM (Portable Pixmap)
- **Data Structures**: 2D vectors for matrix operations
- **File I/O**: Standard C++ file streams
- **Mathematical Operations**: Matrix convolution, histogram processing

## 📊 Image Processing Techniques

### Rotation Algorithm
- 90° clockwise: `rotatedData[c][rows-1-r] = originalData[r][c]`
- 90° counter-clockwise: `rotatedData[cols-1-c][r] = originalData[r][c]`
- Dimensions swap: rows ↔ cols

### Histogram Equalization
- Build histogram of pixel frequencies
- Calculate cumulative distribution function (CDF)
- Map pixels using: `newPixel = (CDF[oldPixel] × maxGray) / (rows × cols)`

### Edge Detection (Sobel)
- Sobel X kernel detects vertical edges
- Sobel Y kernel detects horizontal edges
- Combined magnitude: `edge = √(X² + Y²)`

## 🎮 Use Cases
- Digital photography enhancement
- Medical image analysis
- Computer vision preprocessing
- Image quality assessment
- Feature extraction for machine learning

## 📁 Project Structure
```
├── src/
│   ├── Image transformation logic
│   ├── Edge detection algorithms
│   └── File handling operations
├── samples/
│   └── Example grayscale images (PPM format)
├── build/
│   └── Compiled executables
└── README.md
```

## ⚙️ Build & Compilation
```
g++ -o image_transform image_transform.cpp -lm
./image_transform
```

## 📝 Usage Example
1. Load a grayscale PPM image
2. Apply transformations (rotate, enhance, detect edges)
3. View results or save to new file
4. Save/load application state for recovery

## 🎓 Learning Outcomes
This project demonstrates:
- Advanced C++ STL usage (vector, algorithm libraries)
- 2D matrix manipulation and transformations
- Image processing fundamentals
- Kernel-based convolution operations
- File I/O and binary data handling
- Game state persistence patterns
