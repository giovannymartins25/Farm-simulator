import re

path = 'c:/Users/Giovanny/Desktop/Jogo-farm/game-frontend/main.js'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# I want to rewrite doToggleVehicle so that it emits 'enterVehicle' and 'exitVehicle'
# Let's extract doToggleVehicle

res = re.search(r"function doToggleVehicle\(\) \{[\s\S]*?\}\n\n", content)
if res:
    print("Found doToggleVehicle:\n", res.group(0))
else:
    print("Not found")
