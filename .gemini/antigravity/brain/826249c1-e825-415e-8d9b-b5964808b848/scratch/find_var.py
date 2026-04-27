import re

path = 'c:/Users/Giovanny/Desktop/Jogo-farm/game-frontend/main.js'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if 'let currentHour' in line or 'var currentHour' in line:
        print(f"Line {i+1}: {line.strip()}")
