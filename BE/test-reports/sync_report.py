
import sys

path = 'BE/test-reports/report.md'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Update AUTH-P-01 to Pass and Password123!
# Looking for the row with AUTH-P-01
lines = content.split('\n')
new_lines = []
for line in lines:
    if '| AUTH-P-01 |' in line:
        line = '| AUTH-P-01 | Authentication | /api/v1/user/auth/login | POST | Login Success | `{"username":"admin_test","password":"Password123!"}` | Status 200 | Status 200 | Verified | Yes | Pass | Test passed successfully |'
    new_lines.append(line)

with open(path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))
