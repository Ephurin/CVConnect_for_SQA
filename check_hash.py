import bcrypt

hash_val = "$2a$10$4ix9iLrjxItWjuvS1JLT3uIB6sD6YSN5mY6..6uCZPE7fsbxsxYc."
password = "Password123!"

if bcrypt.checkpw(password.encode('utf-8'), hash_val.encode('utf-8')):
    print("Match!")
else:
    print("No Match!")

# Generate a new one just in case
new_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
print(f"New Hash for '{password}': {new_hash}")
