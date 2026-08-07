# Snake Game using Assembly Language (COAL)

## 🎮 Project Overview

A fully functional **classic Snake game** implemented in **x86 assembly language** (8086/80286), demonstrating low-level programming concepts and real-time game mechanics. The game runs in DOS/BIOS environment with text-mode graphics, interactive keyboard controls, collision detection, score tracking, and dynamic food generation. This project showcases assembly language capabilities in game development, hardware control, and system-level programming.

## 🎯 Project Objectives

- Implement a complete Snake game at assembly language level
- Demonstrate BIOS and DOS interrupt handling
- Implement real-time game loop and event handling
- Practice low-level data structure management (snake segments)
- Optimize code for minimal memory footprint
- Show keyboard input handling and screen manipulation
- Implement collision detection algorithms
- Create engaging gameplay with scoring system

## 🕹️ Game Features

### Core Gameplay
- **Classic Snake Mechanics**: Control snake to eat food and grow longer
- **Arena**: 80x25 text-mode display (DOS standard)
- **Snake**: Represented by `*` characters, initially 3 segments
- **Food**: Represented by `O` character, randomly generated
- **Score**: Real-time score display at bottom of screen
- **Movement**: Smooth snake movement with directional control

### Collision Detection
- **Wall Collision**: Game over if snake hits screen boundaries
- **Self Collision**: Game over if snake hits its own body
- **Food Detection**: Automatic detection when head touches food
- **Boundary Limits**: Active play area is 80x23 (row 24 reserved for score)

### Controls
| Control | Action |
|---------|--------|
| **↑ Up Arrow** | Move snake up |
| **↓ Down Arrow** | Move snake down |
| **← Left Arrow** | Move snake left |
| **→ Right Arrow** | Move snake right |
| **ESC** | Exit game |
| **R** | Restart after game over |
| **Q** | Quit after game over |

### Scoring
- **+1 point** for each food eaten
- **Snake grows by 1 segment** when food is consumed
- Score displayed in real-time at bottom
- Final score shown on game over screen

## 🔧 Technical Architecture

### Assembly Language Specifications
- **Architecture**: x86 (Intel 8086/80286 compatible)
- **Environment**: DOS with BIOS interrupts
- **Mode**: Real mode execution
- **Display**: Text mode (80x25 characters)
- **Assembler Compatible**: NASM, MASM, TASM

### Core Data Structures

```assembly
; Snake segments storage (max 100 segments)
snake_x     times 100 db 0      ; X coordinates of each segment
snake_y     times 100 db 0      ; Y coordinates of each segment

; Game state variables
length      db 3                ; Current snake length
direction   db 1                ; Current direction (0=up, 1=right, 2=down, 3=left)
food_x      db 0                ; Food X position
food_y      db 0                ; Food Y position
score       dw 0                ; Player score (word = 16-bit)
food_eaten  db 0                ; Flag for food consumption
```

### Direction Encoding
| Value | Direction |
|-------|-----------|
| 0 | Up (↑) |
| 1 | Right (→) |
| 2 | Down (↓) |
| 3 | Left (←) |

### Game Loop Architecture

```
┌─────────────────────────────────────┐
│  Main Game Loop (Infinite)          │
├─────────────────────────────────────┤
│ 1. Store tail position              │
│ 2. Move snake head                  │
│ 3. Check wall collision             │
│ 4. Check self collision             │
│ 5. Check food collision             │
│ 6. Draw food on screen              │
│ 7. Draw snake on screen             │
│ 8. Clear old tail (if not growing)  │
│ 9. Update score display             │
│ 10. Apply movement delay            │
│ 11. Check keyboard input            │
│ 12. Loop back                       │
└─────────────────────────────────────┘
```

## 🎯 Key Subroutines

### 1. `move_snake`
- Shifts all snake segments: each segment takes position of segment ahead
- Head segment updates based on current direction
- **Logic**: Move from tail to head to prevent overwriting

```assembly
move_loop:
    mov al, [snake_x + si - 1]      ; Get previous segment X
    mov [snake_x + si], al           ; Move to current position
    dec si                           ; Move to previous segment
    cmp si, 0
    jle move_head                    ; When si reaches head, update head
```

### 2. `check_wall`
- Validates head position against arena boundaries
- X: 0 to 79 (cols-1)
- Y: 0 to 22 (rows-2, row 24 reserved)
- **Triggers**: Game Over on collision

### 3. `check_self`
- Compares head position against all body segments (except head)
- Iterates from segment 1 to segment (length-1)
- **Triggers**: Game Over if match found

### 4. `check_food`
- Compares snake head position with food position
- On match:
  - Increment snake length
  - Add new segment at tail position
  - Increment score
  - Generate new food
  - Set growth flag

### 5. `generate_food`
- Uses BIOS timer (INT 1Ah) for random seed
- **X**: Random 1 to 79
- **Y**: Random 1 to 22
- Ensures food never spawns on boundaries

```assembly
int 1Ah                     ; Get timer tick in DX
mov ax, dx
xor dx, dx
mov bx, cols-1
div bx                      ; DX = DX mod (cols-1)
mov [food_x], dl
```

### 6. `draw_char`
- BIOS interrupt 10h to set cursor and write character
- **Attributes**: Green on black (0Ah)
- **Input**: DL=X, DH=Y, AL=character

### 7. `draw_snake`
- Iterates through all snake segments
- Draws each as `*` character using `draw_char`
- Preserves registers with push/pop

### 8. `print_score`
- Positions cursor at row 24 (score display area)
- Converts score (word) to decimal digits
- Prints "SCORE: " followed by numeric value

### 9. `wait_delay`
- Uses BIOS timer to create delay (~110ms per iteration)
- Prevents snake from moving too fast
- Reads timer tick, waits for ~2 ticks

## 📊 Memory Layout

```
Segment: Code + Data combined (COM format, org 100h)

Address Layout:
100h - 3FFh:   Main program code (~3KB)
400h - 500h:   Snake position arrays (200 bytes)
500h - 520h:   Game state variables (~32 bytes)
520h onwards:  Available stack space
```

## 🔌 BIOS Interrupts Used

| Interrupt | Service | Purpose |
|-----------|---------|---------|
| **INT 10h** | Video | Set mode, cursor position, write character |
| **INT 16h** | Keyboard | Check/get keyboard input |
| **INT 1Ah** | Timer | Get system timer for random seed/delay |
| **INT 21h** | DOS | Write string (score display) |

## 🎮 Gameplay Flow

### Initialization Phase
1. Set video mode 03h (80x25 text)
2. Hide cursor
3. Clear screen
4. Initialize snake at center (10,10) with 3 segments
5. Snake facing right by default
6. Generate first food

### Main Game Loop
1. Extract current tail position (for cleanup)
2. Move snake in current direction
3. Check collisions (wall, self, food)
4. Render snake and food
5. Update score display
6. Apply delay (game speed control)
7. Poll keyboard for direction changes
8. Prevent reversing into self
9. Continue loop

### Game Over Condition
1. Wall collision: Head reaches boundary
2. Self collision: Head touches body
3. ESC key: Player exit request

### Game Over Display
1. Clear screen
2. Show "Game Over! Score: X" message
3. Prompt player: "Press R to restart or Q to quit"
4. Wait for user input
5. **R**: Jump to restart label (reinitialize)
6. **Q/ESC**: Exit program

## 💡 Technical Implementation Details

### Efficient Array Access
- Snake segments stored in parallel arrays (X and Y)
- Segment N: position at [snake_x + N], [snake_y + N]
- Allows quick position queries and shifts

### Direction Prevention
```assembly
; Prevent snake from reversing into itself
cmp byte [direction], 2     ; If currently moving down (2)
je main_loop                ; Ignore up arrow command
mov byte [direction], 0     ; Set new direction to up
```

### Random Number Generation
- Uses BIOS timer ticks as seed (not cryptographically random, but sufficient for food spawning)
- Prevents deterministic food patterns

### Optimized Drawing
- Only draws food once per loop
- Only draws snake once per loop
- Clears only tail position (not entire snake each frame)
- Minimal screen refreshes for performance

## 🚀 Compilation & Execution

### Required Tools
- **Assembler**: NASM, MASM, or TASM
- **DOS Environment**: DOSBox, QEMU, or actual 286+ computer
- **Linker**: Microsoft Linker (for MASM)

### Compilation with NASM
```bash
nasm -f bin -o snake.com snake.asm
```

### Running
```bash
# In DOS or DOSBox
C:\> snake.com
```

### DOSBox Setup Example
```bash
# Create .conf file
[cpu]
cputype=auto

[cpu]
cputype=286

[imgmount]
imgmount d snake.img -t iso

# Run
snake.com
```

## 🎓 Assembly Concepts Demonstrated

- **Registers**: AX, BX, CX, DX, SI, DI, BP, SP (general & special purpose)
- **Memory Addressing**: Direct, register indirect, indexed
- **Branching**: Conditional jumps (JE, JNE, JG, JL, JB)
- **Loops**: Loop construct and manual loop control
- **BIOS Calls**: Video, keyboard, timer interrupts
- **Data Structures**: Parallel arrays, flags, state machines
- **Stack Usage**: Push/pop for register preservation
- **Modular Code**: Subroutines with clear entry/exit
- **Real-time Processing**: Event loop with timing

## 🔍 Collision Detection Algorithm

### Wall Collision (Simple Bounds Check)
```assembly
mov al, [snake_x]        ; Load head X
cmp al, 0                ; Check minimum
jl game_over
cmp al, cols-1           ; Check maximum
jge game_over
```

### Self Collision (Linear Search)
```assembly
; Compare head position with each body segment
mov si, 1                ; Start from segment 1 (skip head at 0)
self_loop:
    cmp si, cx           ; cx = length-1
    jge self_done
    cmp al, [snake_x + si]      ; Match X?
    jne self_next
    cmp ah, [snake_y + si]      ; Match Y?
    je game_over                ; Collision!
    inc si
    jmp self_loop
```

## 📈 Performance Characteristics

- **Frame Rate**: ~9 FPS (based on 2-tick delay ~110ms)
- **Memory Usage**: ~500 bytes (code + data)
- **CPU Usage**: Minimal (polling-based, not interrupt-driven)
- **Rendering**: Real-time text updates, no buffer
- **Latency**: ~1-2 frames keyboard response

## 🔐 Design Decisions

1. **COM Format**: Direct execution without linker (org 100h)
2. **Parallel Arrays**: Faster access than linked list structures
3. **DOS Interrupts**: BIOS provides cross-platform compatibility
4. **Timer-based Delay**: Hardware-independent timing
5. **Text Mode**: Universal DOS support, no graphics card driver needed
6. **Maximum Length 100**: Balances playability with memory constraints

## 🎯 Learning Outcomes

This project teaches:
- Real-mode x86 assembly programming
- BIOS and DOS interrupt handling
- Game loop and state machine design
- Real-time event processing
- Array data structures in low-level code
- Collision detection algorithms
- Hardware timing and delays
- Efficient memory management

## 🔧 Possible Enhancements

- [ ] Variable game speed levels (difficulty settings)
- [ ] Obstacles on the playing field
- [ ] High score persistent storage
- [ ] Multiple game modes (survival, time-based)
- [ ] Sound effects using PC speaker (INT 33h)
- [ ] Graphical mode support (VGA 320x200)
- [ ] Network multiplayer (over serial port)
- [ ] Improved random food generation
- [ ] Game statistics (average length, etc.)

## 📝 Project Files

- **snake.asm**: Complete game implementation (422 lines)
- **README.md**: Documentation and technical guide

## 🏛️ Historical Context

This Snake game exemplifies classic microcomputer game development:
- **Platform**: x86-based IBM PC and compatibles
- **Era**: 1980s-1990s DOS era
- **Significance**: Demonstrates that sophisticated games can run in minimal memory
- **Educational Value**: Teaches fundamental computer architecture concepts

## 📖 References

- Intel 8086 Assembly Language Reference
- Ralf Brown's Interrupt List (comprehensive BIOS/DOS interrupt documentation)
- Paul Carter's "PC Assembly Language Tutorial"
- DOS Technical Reference Manual
- NASM Official Documentation

---

**Implementation Status**: ✅ Complete and tested  
**Language**: x86 Assembly (8086/80286)  
**Environment**: DOS / DOSBox compatible  
**Difficulty Level**: Advanced assembly programming
