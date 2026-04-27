import re

path = 'c:/Users/Giovanny/Desktop/Jogo-farm/game-frontend/main.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

funcs = re.findall(r"function\s+(\w+)\(", content)
print("Functions found:", funcs)

if 'buyItem' in funcs:
    print("buyItem exists")
else:
    print("buyItem MISSING")

if 'advanceHour' in funcs:
    print("advanceHour exists")
else:
    print("advanceHour MISSING")
