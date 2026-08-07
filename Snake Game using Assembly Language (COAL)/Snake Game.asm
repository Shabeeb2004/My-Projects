org 100h

cols        equ 80              ; Screen columns
rows        equ 25              ; Screen rows
s_size      equ 100             ; Max snake size

start:
    ; Set video mode to 80x25 text mode
    mov ax, 0003h
    int 10h

    ; Hide cursor
    mov ah, 01h
    mov ch, 20h
    int 10h

restart:
    ; Clear screen
    mov ah, 06h
    mov al, 0
    mov bh, 07h             ; Light gray on black
    mov ch, 0
    mov cl, 0
    mov dh, 24
    mov dl, 79
    int 10h

    ; Initialize snake at center (10,10), moving right
    mov byte [snake_x], 10
    mov byte [snake_y], 10
    mov byte [snake_x+1], 9
    mov byte [snake_y+1], 10
    mov byte [snake_x+2], 8
    mov byte [snake_y+2], 10
    mov byte [length], 3
    mov byte [direction], 1
    mov word [score], 0

    ; Generate initial food
    call generate_food

main_loop:
    ; Store tail position before moving
    xor si, si            
    mov al, [length]  
    mov ah, 0         
    mov si, ax         
    dec si
    mov al, [snake_x + si]
    mov [tail_x], al
    mov al, [snake_y + si]
    mov [tail_y], al

    ; Move snake
    call move_snake

    ; Check for wall collision
    call check_wall

    ; Check for self collision
    call check_self

    ; Check if food is eaten
    call check_food

    ; Draw food
    mov dl, [food_x]
    mov dh, [food_y]
    mov al, 'O'
    call draw_char

    ; Draw snake
    call draw_snake

    ; Clear tail if not growing
    cmp byte [food_eaten], 0
    jne skip_clear
    mov dl, [tail_x]
    mov dh, [tail_y]
    mov al, ' '
    call draw_char
skip_clear:
    mov byte [food_eaten], 0

    ; Update score display
    call print_score

    ; Wait for a delay
    call wait_delay

    ; Check for key press
    mov ah, 01h
    int 16h
    jz main_loop            ; No key, continue loop
    mov ah, 00h
    int 16h                 ; Get key

    ; Update direction (prevent reverse)
    cmp ah, 48h             ; Up arrow
    jne not_up
    cmp byte [direction], 2 ; If moving down, ignore
    je main_loop
    mov byte [direction], 0
    jmp main_loop
not_up:
    cmp ah, 4Dh             ; Right arrow
    jne not_right
    cmp byte [direction], 3 ; If moving left, ignore
    je main_loop
    mov byte [direction], 1
    jmp main_loop
not_right:
    cmp ah, 50h             ; Down arrow
    jne not_down
    cmp byte [direction], 0 ; If moving up, ignore
    je main_loop
    mov byte [direction], 2
    jmp main_loop
not_down:
    cmp ah, 4Bh             ; Left arrow
    jne not_left
    cmp byte [direction], 1 ; If moving right, ignore
    je main_loop
    mov byte [direction], 3
    jmp main_loop
not_left:
    cmp al, 27              ; ESC key to exit
    je exit
    jmp main_loop

move_snake:
    push si
    xor si, si              ; Clear si
    mov al, [length]  
    mov ah, 0         
    mov si, ax        
    dec si                  ; Start from tail
move_loop:
    cmp si, 0
    jle move_head
    mov al, [snake_x + si - 1]
    mov [snake_x + si], al
    mov al, [snake_y + si - 1]
    mov [snake_y + si], al
    dec si
    jmp move_loop
move_head:
    mov al, [direction]
    cmp al, 0               ; Up
    jne move_not_up
    dec byte [snake_y]
    jmp move_done
move_not_up:
    cmp al, 1               ; Right
    jne move_not_right
    inc byte [snake_x]
    jmp move_done
move_not_right:
    cmp al, 2               ; Down
    jne move_not_down
    inc byte [snake_y]
    jmp move_done
move_not_down:
    cmp al, 3               ; Left
    jne move_done
    dec byte [snake_x]
move_done:
    pop si
    ret

check_wall:
    mov al, [snake_x]
    cmp al, 0
    jl game_over
    cmp al, cols-1
    jge game_over
    mov al, [snake_y]
    cmp al, 0
    jl game_over
    cmp al, rows-2          ; Leave row 24 for score
    jge game_over
    ret

check_self:
    push si
    mov al, [snake_x]
    mov ah, [snake_y]
    xor cx, cx              ; Clear cx
    mov cl, [length]        ; Load length into cl
    dec cx
    mov si, 1
self_loop:
    cmp si, cx
    jge self_done
    cmp al, [snake_x + si]
    jne self_next
    cmp ah, [snake_y + si]
    je game_over
self_next:
    inc si
    jmp self_loop
self_done:
    pop si
    ret

check_food:
    mov al, [snake_x]
    cmp al, [food_x]
    jne no_food
    mov al, [snake_y]
    cmp al, [food_y]
    jne no_food
    ; Food eaten
    inc byte [length]
    ; Set new tail segment to old tail position
    xor si, si              ; Clear si
    mov al, [length]  
    mov ah, 0        
    mov si, ax        
    dec si
    mov al, [tail_x]
    mov [snake_x + si], al
    mov al, [tail_y]
    mov [snake_y + si], al
    inc word [score]
    mov byte [food_eaten], 1
    call generate_food
no_food:
    ret

generate_food:
    mov ah, 00h
    int 1Ah                 ; Get timer ticks in DX
    mov ax, dx
    xor dx, dx
    mov bx, cols-1
    div bx                  ; DX = remainder 
    mov [food_x], dl
    inc byte [food_x]       ; 1 to cols-1

    mov ah, 00h
    int 1Ah
    mov ax, dx
    xor dx, dx
    mov bx, rows-3          ; 0 to 22
    div bx
    mov [food_y], dl
    inc byte [food_y]       ; 1 to 22

    mov dl, [food_x]
    mov dh, [food_y]
    mov al, 'O'
    call draw_char
    ret

draw_snake:
    push si
    push cx
    xor cx, cx              ; Clear cx
    mov cl, [length]        ; Load length into cl
    xor si, si
draw_loop:
    cmp si, cx
    jge draw_done
    mov dl, [snake_x + si]
    mov dh, [snake_y + si]
    mov al, '*'
    call draw_char
    inc si
    jmp draw_loop
draw_done:
    pop cx
    pop si
    ret

draw_char:
    push ax
    push bx
    push dx
    ; Set cursor position
    mov ah, 02h
    mov bh, 0
    int 10h
    ; Write character with attribute (green on black)
    mov ah, 09h
    mov bh, 0
    mov bl, 0Ah             ; Green on black
    mov cx, 1               ; Write one character
    int 10h
    pop dx
    pop bx
    pop ax
    ret

print_score:
    mov dl, 0
    mov dh, 24
    mov ah, 02h
    mov bh, 0
    int 10h
    mov ah, 09h
    mov dx, msg_score
    int 21h

    mov ax, [score]
    mov bx, 10
    xor cx, cx              ; Digit counter
score_loop:
    xor dx, dx
    div bx
    push dx                 ; Remainder (digit)
    inc cx
    cmp ax, 0               ; Check if ax is zero
    jnz score_loop
print_digits:
    pop ax
    add al, '0'
    mov ah, 0Eh             ; Teletype output
    int 10h
    loop print_digits
    ret

wait_delay:
    push ax
    push cx
    push dx
    mov ah, 00h
    int 1Ah                 ; Get tick count in CX:DX
    mov bx, dx              ; Store low word
wait_loop:
    int 1Ah
    sub dx, bx
    cmp dx, 2               ; Wait for 2 ticks (~110ms)
    jb wait_loop
    pop dx
    pop cx
    pop ax
    ret

game_over:
    ; Clear screen
    mov ah, 06h
    mov al, 0
    mov bh, 07h             ; Light gray on black
    mov ch, 0
    mov cl, 0
    mov dh, 24
    mov dl, 79
    int 10h

    ; Print game over message at row 11
    mov ah, 02h
    mov bh, 0
    mov dh, 11
    mov dl, 30
    int 10h
    mov ah, 09h
    mov dx, msg_over
    int 21h

    ; Print final score
    mov ax, [score]
    mov bx, 10
    xor cx, cx
score_over_loop:
    xor dx, dx
    div bx
    push dx
    inc cx
    cmp ax, 0               ; Check if ax is zero
    jnz score_over_loop
print_over_digits:
    pop ax
    add al, '0'
    mov ah, 0Eh
    int 10h
    loop print_over_digits

    ; Set cursor to row 12, column 30
    mov ah, 02h
    mov bh, 0
    mov dh, 12
    mov dl, 30
    int 10h
    ; Print restart or quit message
    mov ah, 09h
    mov dx, msg_restart
    int 21h

    ; Wait for 'R' to restart or 'Q' to quit
wait_for_input:
    mov ah, 00h
    int 16h
    cmp al, 'R'
    je restart
    cmp al, 'r'
    je restart
    cmp al, 'Q'
    je exit
    cmp al, 'q'
    je exit
    cmp al, 27              ; ESC key to exit
    je exit
    jmp wait_for_input

exit:
    mov ax, 4C00h
    int 21h

snake_x     times 100 db 0      ; Snake X positions
snake_y     times 100 db 0      ; Snake Y positions
length      db 3                ; Initial snake length
direction   db 1                ; 0=up, 1=right, 2=down, 3=left
food_x      db 0                ; Food X position
food_y      db 0                ; Food Y position
tail_x      db 0                ; Tail X position to clear
tail_y      db 0                ; Tail Y position to clear
score       dw 0                ; Player score
msg_over    db 'Game Over! Score: $'
msg_score   db 'SCORE: $'
msg_restart db 'Press R to restart or Q to quit$'
food_eaten  db 0                ; Flag for food eaten