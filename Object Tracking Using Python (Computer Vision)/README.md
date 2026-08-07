# Object Tracking Using Python (Computer Vision)

## 📋 Project Overview

This project implements a **robust feature-based object tracking system** using Harris Corner Detection and Lucas-Kanade Optical Flow algorithms. The system is specifically designed to track diverse objects including rolling balls, moving people, and flying birds across multiple video sequences with varying lighting conditions and complex backgrounds.

## 🎯 Key Features

### Core Tracking Techniques
- **Harris Corner Detection**: Identifies robust corner features in video frames to serve as tracking points
- **Lucas-Kanade Optical Flow**: Tracks the motion of detected corner features across consecutive frames
- **Bidirectional Flow Checking**: Validates tracking accuracy by computing optical flow in both forward and backward directions
- **Multi-scale Pyramid Tracking**: Uses image pyramids for robust tracking across large motions

### Advanced Capabilities
- **Color-Guided Tracking**: Hybrid approach combining color detection with feature tracking for objects with distinctive colors
- **Re-detection Mechanism**: Automatically re-detects features when tracking is lost
- **Motion Trail Visualization**: Displays historical trajectory of tracked objects
- **Bounding Box Management**: Intelligent box growth constraints to prevent drift onto nearby objects

## 📊 Tracked Scenarios

| Video | Object | Key Challenge | Solution |
|-------|--------|---------------|----------|
| Video 1 | Rolling Ball (Near Wall) | Distinguishing ball from wall texture | Precise ROI selection with texture-aware detection |
| Video 2 | Ball Rolling (Courtyard) | Object entering frame at edges | Flexible ROI with frame boundary re-detection |
| Video 3 | Person in White Clothing | Non-rigid object with uniform color | Color-guided tracking with capped bbox growth |
| Video 4 | Flying Eagle/Hawk | Open sky with minimal features | Correct ROI to focus on primary bird; Harris corners for sky |

## 🔧 Technical Architecture

### Algorithm Pipeline
1. **Frame Initialization**: Extract grayscale images and define Region of Interest (ROI)
2. **Feature Detection**: Apply Harris corner detection with spatial suppression
3. **Optical Flow Tracking**: Compute bidirectional optical flow and validate tracks
4. **Loss Recovery**: Re-detect features when point count drops below threshold
5. **Visualization**: Draw bounding boxes, motion trails, and statistics

### Key Algorithms

**Harris Corner Detection**
- Block-size based corner response computation
- Adaptive thresholding based on max response
- Spatial suppression to avoid clustered detections
- Sorts corners by response strength

**Lucas-Kanade Optical Flow**
- Pyramid-based multi-scale tracking
- Forward-backward error checking for validation
- Minimum feature point requirement (4+ points)
- Automatic fallback to re-detection on loss

**Color-Guided Tracking**
- HSV color space segmentation
- Morphological operations (opening/closing)
- Contour analysis with aspect ratio filtering
- Exclusion region masking for complex scenes

## 📈 Performance Metrics

- **Tracking Success Rate**: Percentage of frames with active tracking
- **Re-detection Events**: Count of successful feature re-detections
- **Frame Loss Events**: Frames where tracking was temporarily lost
- **Motion Centroids**: Center of mass trajectory across frames
- **Feature Points**: Per-frame count of tracked corner points

## 🛠️ Technologies Used

- **OpenCV**: Harris corner detection, Lucas-Kanade optical flow, morphological operations
- **NumPy**: Numerical computations and array manipulations
- **Matplotlib**: Visualization and trajectory analysis
- **Python 3.8+**: Core implementation
- **Jupyter Notebook**: Interactive development environment

## 💡 Innovations

- **Bidirectional Flow Validation**: Forward-backward consistency checking ensures robust tracking
- **Adaptive Multi-level Re-detection**: Intelligent recovery from tracking loss
- **Hybrid Feature + Color Methods**: Combines robustness of both approaches
- **Comprehensive Visualization**: Motion trails, centroid markers, and status indicators
- **Scene-Specific Optimization**: Customizable parameters per video scenario

## 🔍 Robustness Features

- Boundary clamping for bounding boxes
- Aspect ratio validation for contour filtering
- Morphological filtering for clean segmentation
- Point spacing constraints to prevent clustering
- Forward-backward error thresholding
- Confidence-based feature validation

## 🎓 Applications

- Autonomous surveillance and activity monitoring
- Sports analytics and player/ball tracking
- Wildlife monitoring and behavior analysis
- Drone/vehicle trajectory tracking
- Motion analysis and biomechanics research
- Video annotation and dataset creation

## 📚 References

- Harris, C. & Stephens, M. (1988). *A Combined Corner and Edge Detector*
- Lucas, B. & Kanade, T. (1981). *An Iterative Image Registration Technique*
- OpenCV Documentation on Optical Flow and Feature Detection

---

**Full Documentation**: See `ObjectTracking_Report.pdf` for detailed analysis, performance benchmarks, and visual tracking results.
