# AI-Based Personalized Study Planner using Reinforcement Learning

An intelligent study scheduling system that uses **Tabular Q-Learning** to optimize student study time allocation across multiple subjects, balancing task urgency, deadline proximity, and time availability.

## 📋 Overview

University students often struggle to allocate study time effectively across multiple concurrent subjects. This project solves that problem by training an RL agent to generate personalized weekly study schedules that:

- **Prioritize urgent tasks** (high difficulty + near deadlines)
- **Balance subject diversity** to avoid over-concentration in one subject
- **Respect time constraints** by fitting sessions into available slots
- **Maximize deadline compliance** through intelligent scheduling

## 🎯 Key Features

| Feature | Achievement |
|---------|-------------|
| **Deadline Coverage** | 100% (all tasks completed before deadline) |
| **Subject Balance** | 0.83/1.0 (high diversity across subjects) |
| **Time Utilization** | 49.6% of available time slots used efficiently |
| **Convergence** | ~105 episodes (stable policy learned) |
| **Algorithm** | Tabular Q-Learning with epsilon-greedy exploration |

## 🔧 Technical Approach

### State Representation
```
State = (subject, difficulty, daysLeft, remaining_hours_bucket, slot_capacity_bucket)
```
- **Discretization**: 30-minute intervals for time-related features
- **Action Space**: Assign task to time slot or skip

### Reward Function
```
+ urgency × 10          (for successful assignments)
+ 20                    (deadline today bonus)
- 10                    (over-concentration penalty)
+ 50                    (full completion bonus)
```

### Hyperparameters (Tuned)
- Learning rate (α): 0.10
- Discount factor (γ): 0.90
- Initial exploration (ε₀): 0.50
- Epsilon decay: 0.97/episode
- Training episodes: 200

## 📊 Results

The trained agent produces schedules like:

| Day | Subject | Task | Duration | Priority |
|-----|---------|------|----------|----------|
| Mon | Database | DB Project | 90 min | Critical (5/5) |
| Tue | AI | Assignment | 90 min | Hard (4/5) |
| Wed | Math | Quiz Prep | 90 min | Moderate (2/5) |

**Reward Curve**: Three-phase convergence (Exploration → Learning → Exploitation)

## 🚀 How It Works

1. **Preprocessing**: Tasks are scored for urgency = difficulty / daysLeft
2. **Training**: Q-Learning agent trained on synthetic student dataset
3. **Scheduling**: Trained policy assigns sessions to available time slots
4. **Adaptation**: Agent learns which combinations of task properties lead to high-quality schedules

## 📁 Project Contents

- `AI_Study_Planner_RL_Final.ipynb` - Complete RL implementation with experiments
- `AI_Study_Planner_Report.pdf` - Detailed methodology, failure analysis, results
- Synthetic dataset of 4 tasks (easily extensible)

## 🔍 Key Learnings & Failure Analysis

### Fixed Issues
1. **Broken Bellman Update**: Initial implementation used static state, preventing policy learning → **Fixed** with proper state transitions
2. **High Epsilon Decay**: Exploration was too slow → **Tuned** to faster decay (0.97/ep)
3. **Scope Creep**: Penalty function was global → **Scoped** per-episode

### Real-World Limitations
- Scalability: Tabular Q requires function approximation (DQN) for larger problems
- Context blindness: No awareness of extracurricular activities or unexpected events
- Cold-start: New students need onboarding prior calibration
- Opacity: Q-table lacks explainability

## 🛡️ Ethical Considerations

This project includes comprehensive analysis of:
- **Autonomy risks**: Student over-reliance on AI-generated schedules
- **Equity concerns**: Assumes fixed time slots (unfair to working students)
- **Privacy**: Proposed mitigations for behavioral data collection
- **Accountability**: Lack of explainability in tabular policies

*See full report for proposed mitigations.*

## 🚦 Future Work

1. Scale to larger problem using Deep Q-Networks
2. Integrate with calendar APIs for context-aware scheduling
3. Add human-in-the-loop feedback for continuous refinement
4. Implement differential privacy for production deployment

## 👥 Team

- **Shabeeb Haider** (23P-0649)
- **Haseeb Nadeem** (23L-2646)
- **Shaheer Asif** (22L-6396)

*Course: Artificial Intelligence | 2026*
