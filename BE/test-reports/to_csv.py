
import csv
import re

path_in = 'BE/test-reports/report.md'
path_out = 'BE/test-reports/test_cases.csv'

with open(path_in, 'r', encoding='utf-8') as f:
    lines = f.readlines()

csv_data = []
for line in lines:
    line = line.strip()
    if line.startswith('|') and 'Test ID' not in line and '---' not in line and 'Database Verification Results' not in line:
        parts = [p.strip() for p in line.split('|')]
        # Filter out empty strings from start and end pipes
        parts = [p for p in parts if p or (parts.index(p) > 0 and parts.index(p) < len(parts)-1)]
        
        # In a pipe-delimited line | A | B | C |, splitting by | gives ['', ' A ', ' B ', ' C ', '']
        # So we take index 1 to 12
        actual_parts = [p.strip() for p in line.split('|')]
        if len(actual_parts) >= 13:
            row = actual_parts[1:13]
            # REMOVE ALL BACKTICKS
            row = [cell.replace('`', '').strip() for cell in row]
            csv_data.append(row)

with open(path_out, 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.writer(f, quoting=csv.QUOTE_ALL)
    writer.writerow(['Test ID', 'Feature', 'API Path', 'Method', 'Scenario', 'Input Data', 'Expected Status', 'Actual Status', 'DB Check', 'Rollback', 'Result', 'Notes'])
    writer.writerows(csv_data)

print(f"Successfully converted {len(csv_data)} rows.")
