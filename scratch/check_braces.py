
with open('game-frontend/main.js', 'r', encoding='utf-8') as f:
    content = f.read()

stack = []
for i, char in enumerate(content):
    if char == '{':
        stack.append(i)
    elif char == '}':
        if stack:
            stack.pop()
        else:
            print(f"Extra closing brace at char {i}")

if stack:
    print(f"Unclosed braces starting at char indices: {stack}")
else:
    print("Braces are balanced")
