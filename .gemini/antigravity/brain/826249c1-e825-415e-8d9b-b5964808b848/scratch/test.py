import re

with open('c:/Users/Giovanny/Desktop/Jogo-farm/game-frontend/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

res = []
for line in content.split('\n'):
    if 'Vehicle' in line and 'function' in line:
        res.append(line)
        
print("Found:", res)
