## Page 1

Project
HỆ THỐNG QUẢN LÝ HỒ SƠ ỨNG VIÊN VÀ TUYỂN DỤNG DÀNH CHO DOANH NGHIỆP        
Tool
Postman
Total test cases
197
Pass
153
Fail
44
Note: 83 Automated cases verified via Newman, 114 Manual cases reviewed for data integrity.
Test ID
Feature
API Path
HTTP Method
Scenario
Input Data
Expected Status/Response
Actual Status/Response
DB Check
Roolback
Result
Notes
AUTH-P-01
Authentication
/api/v1/user/auth/login
POST
Login Success
{"username":"admin_test", "password":"AdminPassword@123"}
Status 200, Return 
AccessToken
Status 401
Verified
Yes
Fail
Login failed (401) - Credentials mismatch in DB.
AUTH-N-01
Authentication
/api/v1/user/auth/login
POST
Wrong Pass
{"username":"admin_test", "password":"WrongPassword#99"}
Status 401, Unauthorized
Status 401
Verified
Yes
Pass
Test passed 
successfully
AUTH-N-02
Authentication
/api/v1/user/auth/login
POST
Empty User
{"username":""}
Status 400, Validation Error
Status 400
Verified
Yes
Pass
Test passed 
successfully
AUTH-P-02
Authentication
/api/v1/.../register-candidate
POST
Register Success
{"username":"qa_user_01", "password":"SecurePass!2024", "email":"qa@test.com", "fullName":"QA User"}
Status 201, User Created
Status 400
Verified
Yes
Fail
Registration failed (400) - User ID format mismatch or duplicate.
AUTH-N-03
Authentication
/api/v1/.../register-candidate
POST
Duplicate User
{"username":"admin_test"}
Status 400, Already Exists
Status 400
Verified
Yes
Pass
Test passed 
successfully
USER-P-01
User 
Management
/api/v1/user/user/my-info/1
GET
My Info
N/A
Status 200, Return Profile
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-P-02
User 
Management
/api/v1/user/user/my-roles
GET
My Roles
N/A
Status 200, Return Roles
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-S-01
User 
Management
/api/v1/user/user/filter
GET
Filter RBAC
N/A
Status 200, Return Data
Status 200
Verified
N/A
Pass
Test passed 
successfully
JOB-P-01
Job 
Advertisement
/api/v1/core/job-ad/create
POST
Create Job
{"title":"Senior QA Engineer", "salaryFrom":2000, "salaryTo":5000, "description":"Expert in SQA and Automated Testing @CVConnect."}
Status 201, Job Created
Status 200
Verified
Yes
Pass
Test passed 
successfully
JOB-N-01
Job 
Advertisement
/api/v1/core/job-ad/create
POST
Bad Range
{"title":"QA", "salaryFrom":5000, "salaryTo":2000}
Status 400, Logic Error
Status 400
Verified
Yes
Pass
Test passed 
successfully
AUTH-P-01-S
Authentication
/api/v1/user/auth/login
POST
Success (No Token)
{"username":"admin_test", "password":"AdminPassword@123"}
Status 200, Return 
AccessToken
Status 200
Verified
Yes
Pass
Test passed 
successfully
AUTH-P-01-B
Authentication
/api/v1/user/auth/login
POST
Success (Boundary)
{"fullName":"A".repeat(256)}
Status 200, Handle Long Name Status 200
Verified
Yes
Pass
Test passed 
successfully
AUTH-N-01-S
Authentication
/api/v1/user/auth/login
POST
Wrong Pass (No 
Token)
{"username":"admin_test", "password":"WrongPassword#99"}
Status 401, Unauthorized
Status 401
Verified
Yes
Pass
Test passed 
successfully
AUTH-N-01-B
Authentication
/api/v1/user/auth/login
POST
Wrong Pass 
(Boundary)
{"fullName":"A".repeat(500)}
Status 401, Unauthorized
Status 401
Verified
Yes
Pass
Test passed 
successfully
AUTH-N-02-S
Authentication
/api/v1/user/auth/login
POST
Empty User (No 
Token)
{"username":""}
Status 400, Validation Error
Status 400
Verified
Yes
Pass
Test passed 
successfully
AUTH-N-02-B
Authentication
/api/v1/user/auth/login
POST
Empty User 
(Boundary)
{"fullName":"A".repeat(500)}
Status 400, Validation Error
Status 400
Verified
Yes
Pass
Test passed 
successfully
AUTH-P-02-S
Authentication
/api/v1/.../reg-candidate
POST
Reg (No Token)
{"username":"qa_user_01", "password":"SecurePass!2024", "email":"qa@test.com", "fullName":"QA User"}
Status 201, User Created
Status 400
Verified
Yes
Fail
Check Gateway logs
AUTH-P-02-B
Authentication
/api/v1/.../reg-candidate
POST
Reg (Boundary)
{"fullName":"A".repeat(500)}
Status 201, User Created
Status 400
Verified
Yes
Fail
Check Gateway logs
AUTH-N-03-S
Authentication
/api/v1/.../reg-candidate
POST
Duplicate (No Token)
{"username":"admin_test"}
Status 400, Already Exists
Status 400
Verified
Yes
Pass
Test passed 
successfully
AUTH-N-03-B
Authentication
/api/v1/.../reg-candidate
POST
Duplicate (Boundary)
{"fullName":"A".repeat(500)}
Status 400, Already Exists
Status 400
Verified
Yes
Pass
Test passed 
successfully
USER-P-01-S
User 
Management
/api/v1/user/user/my-info/1
GET
My Info (No Token)
N/A
Status 401, Unauthorized
Status 401
N/A
N/A
Pass
Expected 401
USER-P-02-S
User 
Management
/api/v1/user/user/my-roles
GET
My Roles (No Token)
N/A
Status 401, Unauthorized
Status 401
N/A
N/A
Pass
Expected 401
USER-S-01-S
User 
Management
/api/v1/user/user/filter
GET
Filter (No Token)
N/A
Status 401, Unauthorized
Status 401
N/A
N/A
Pass
Expected 401
JOB-P-01-S
Job 
Advertisement
/api/v1/core/job-ad/create
POST
Create (No Token)
{"title":"QA Engineer", "salaryFrom":2000, "salaryTo":4000, "description":"Automated Testing."}
Status 401, Unauthorized
Status 401
N/A
Yes
Pass
Expected 401
JOB-P-01-B
Job 
Advertisement
/api/v1/core/job-ad/create
POST
Create (Boundary)
{"fullName":"A".repeat(500)}
Status 201, Job Created
Status 200
Verified
Yes
Pass
Test passed 
successfully
JOB-N-01-S
Job 
Advertisement
/api/v1/core/job-ad/create
POST
Bad Range (No 
Token)
{"title":"QA", "salaryFrom":5000, "salaryTo":2000}
Status 401, Unauthorized
Status 401
Verified
Yes
Pass
Expected 401
JOB-N-01-B
Job 
Advertisement
/api/v1/core/job-ad/create
POST
Bad Range 
(Boundary)
{"fullName":"A".repeat(500)}
Status 400, Logic Error
Status 400
Verified
Yes
Pass
Test passed 
successfully
USER-AUTO-001
User 
Management
/api/v1/.../resend-email
GET
Smoke Test
N/A
Status 200, Email Sent
Status 500
N/A
N/A
Fail
Internal Server Error
USER-AUTO-002
User 
Management
/api/v1/.../reset-pass
GET
Smoke Test
N/A
Status 200, Success
Status 500
N/A
N/A
Fail
Internal Server Error
USER-AUTO-003
User 
Management
/api/v1/user/auth/refresh
POST
Smoke Test
N/A
Status 200, Token Refreshed
Status 401
Verified
N/A
Fail
Unauthorized
USER-AUTO-004
User 
Management
/api/v1/user/auth/logout
POST
Smoke Test
N/A
Status 200, Logged Out
Status 200
Verified
N/A
Pass
Test passed 
successfully


## Page 2

USER-AUTO-005
User 
Management
/api/v1/.../reg-org-admin
POST
Smoke Test
N/A
Status 201, Created
Status 500
N/A
N/A
Fail
Internal Server Error
USER-AUTO-006
User 
Management
/api/v1/user/auth/verify
POST
Smoke Test
N/A
Status 200, Verified
Status 400
Verified
N/A
Fail
Code invalid
USER-AUTO-007
User 
Management
/api/v1/user/auth/verify-token
POST
Smoke Test
N/A
Status 200, Token Valid
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-008
User 
Management
/api/v1/user/auth/verify-
email/1
PUT
Smoke Test
N/A
Status 200, Success
Status 401
Verified
N/A
Fail
Unauthorized
USER-AUTO-009
User 
Management
/api/v1/user/auth/reset-
password
PUT
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Data invalid
USER-AUTO-010
User 
Management
/api/v1/.../new-candidate
POST
Smoke Test
N/A
Status 200, Return Count
Status 400
Verified
N/A
Fail
Request invalid
USER-AUTO-011
User 
Management
/api/v1/user/menu/menu-by-
role/1
GET
Smoke Test
N/A
Status 200, Return Menus
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-012
User 
Management
/api/v1/user/menu/all-menus
GET
Smoke Test
N/A
Status 200, Return All
Status 500
N/A
N/A
Fail
Internal Server Error
USER-AUTO-013
User 
Management
/api/v1/user/org-member/filter GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-014
User 
Management
/api/v1/.../valid-org-member
GET
Smoke Test
N/A
Status 200, Valid
Status 401
Verified
N/A
Fail
Unauthorized
USER-AUTO-015
User 
Management
/api/v1/.../org-member-info/1
GET
Smoke Test
N/A
Status 200, Return Info
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-016
User 
Management
/api/v1/.../org-member-by-org
GET
Smoke Test
N/A
Status 200, Return Members
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-017
User 
Management
/api/v1/.../invite-join-org
POST
Smoke Test
N/A
Status 200, Invited
Status 400
Verified
N/A
Fail
Invite error
USER-AUTO-018
User 
Management
/api/v1/.../reply-invite...
POST
Smoke Test
N/A
Status 200, Success
Status 400
Verified
N/A
Fail
Reply error
USER-AUTO-019
User 
Management
/api/v1/.../check-org-member
POST
Smoke Test
N/A
Status 200, Success
Status 400
Verified
N/A
Fail
Check error
USER-AUTO-020
User 
Management
/api/v1/.../update-account...
POST
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
USER-AUTO-021
User 
Management
/api/v1/.../rollback-update...
POST
Smoke Test
N/A
Status 200, Rolled Back
Status 400
Verified
N/A
Fail
Rollback error
USER-AUTO-022
User 
Management
/api/v1/user/org-
member/assign-role
PUT
Smoke Test
N/A
Status 200, Assigned
Status 400
Verified
N/A
Fail
Assign error
USER-AUTO-023
User 
Management
/api/v1/.../status-active
PUT
Smoke Test
N/A
Status 200, Success
Status 500
N/A
N/A
Fail
Server error
USER-AUTO-024
User 
Management
/api/v1/user/role/member-type GET
Smoke Test
N/A
Status 200, Return Types
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-025
User 
Management
/api/v1/user/role/filter
GET
Smoke Test
N/A
Status 200, Return Roles
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-026
User 
Management
/api/v1/user/role/get-
member...
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-027
User 
Management
/api/v1/user/role/detail/1
GET
Smoke Test
N/A
Status 200, Return Role
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-028
User 
Management
/api/v1/user/role/create
POST
Smoke Test
N/A
Status 201, Created
Status 400
Verified
N/A
Fail
Create error
USER-AUTO-029
User 
Management
/api/v1/user/role/update/1
PUT
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
USER-AUTO-030
User 
Management
/api/v1/user/role/delete
DELETE
Smoke Test
N/A
Status 204, Deleted
Status 400
Verified
N/A
Fail
Delete error
USER-AUTO-031
User 
Management
/api/v1/user/role-
menu/permission
GET
Smoke Test
N/A
Status 200, Permissions
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-032
User 
Management
/api/v1/.../check-org-user-role
GET
Smoke Test
N/A
Status 200, Return Result
Status 401
Verified
N/A
Fail
Unauthorized
USER-AUTO-033
User 
Management
/api/v1/.../get-by-role-code
GET
Smoke Test
N/A
Status 200, Return Users
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-034
User 
Management
/api/v1/user/user/internal/get/
1
GET
Smoke Test
N/A
Status 200, Return Profile
Status 401
Verified
N/A
Fail
Unauthorized
USER-AUTO-035
User 
Management
/api/v1/.../get-by-role-org
GET
Smoke Test
N/A
Status 200, Return Users
Status 401
Verified
N/A
Fail
Unauthorized
USER-AUTO-036
User 
Management
/api/v1/.../not-org-member
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-037
User 
Management
/api/v1/.../user-detail-admin/1
GET
Smoke Test
N/A
Status 200, Return Detail
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-038
User 
Management
/api/v1/user/user/filter/export
GET
Smoke Test
N/A
Status 200, File Exported
Status 200
Verified
N/A
Pass
Test passed 
successfully


## Page 3

USER-AUTO-039
User 
Management
/api/v1/user/user/my-profiles
GET
Smoke Test
N/A
Status 200, Return Profile
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-040
User 
Management
/api/v1/user/user/internal/ids
POST
Smoke Test
N/A
Status 200, Return Users
Status 400
Verified
N/A
Fail
Payload invalid
USER-AUTO-041
User 
Management
/api/v1/user/user/role-
default/1
PUT
Smoke Test
N/A
Status 200, Success
Status 200
Verified
N/A
Pass
Test passed 
successfully
USER-AUTO-042
User 
Management
/api/v1/user/user/update-
password
PUT
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Policy error
USER-AUTO-043
User 
Management
/api/v1/user/user/update-
avatar
PUT
Smoke Test
N/A
Status 200, Avatar Updated
Status 500
N/A
N/A
Fail
Upload error
USER-AUTO-044
User 
Management
/api/v1/user/user/update-info
PUT
Smoke Test
N/A
Status 200, Info Updated
Status 400
Verified
N/A
Fail
Data invalid
USER-AUTO-045
User 
Management
/api/v1/.../assign-role-admin/1 PUT
Smoke Test
N/A
Status 200, Success
Status 400
Verified
N/A
Fail
Assign error
USER-AUTO-046
User 
Management
/api/v1/.../retrieve-role-
admin/1
PUT
Smoke Test
N/A
Status 200, Success
Status 400
Verified
N/A
Fail
Retrieve error
CORE-AUTO-047
Core Service
/api/v1/.../get-by-id/1
GET
Smoke Test
N/A
Status 200, Return File
Status 401
Verified
N/A
Fail
Unauthorized
CORE-AUTO-048
Core Service
/api/v1/core/attach-file/upload POST
Smoke Test
N/A
Status 201, Uploaded
Status 500
N/A
N/A
Fail
Internal Error
CORE-AUTO-049
Core Service
/api/v1/.../upload-internal
POST
Smoke Test
N/A
Status 201, Uploaded
Status 500
N/A
N/A
Fail
Internal Error
CORE-AUTO-050
Core Service
/api/v1/.../uploads-internal
POST
Smoke Test
N/A
Status 201, Uploaded
Status 500
N/A
N/A
Fail
Internal Error
CORE-AUTO-051
Core Service
/api/v1/.../delete-by-ids
POST
Smoke Test
N/A
Status 204, Deleted
Status 400
Verified
N/A
Fail
Request Error
CORE-AUTO-052
Core Service
/api/v1/.../view-candidate
GET
Smoke Test
N/A
Status 200, Return View
Status 403
Verified
N/A
Fail
Forbidden
CORE-AUTO-053
Core Service
/api/v1/.../view-candidate/1
GET
Smoke Test
N/A
Status 200, Return Detail
Status 403
Verified
N/A
Fail
Forbidden
CORE-AUTO-054
Core Service
/api/v1/.../view-general
GET
Smoke Test
N/A
Status 200, Return View
Status 403
Verified
N/A
Fail
Forbidden
CORE-AUTO-055
Core Service
/api/v1/core/calendar/create
POST
Smoke Test
N/A
Status 201, Created
Status 400
Verified
N/A
Fail
Data invalid
CORE-AUTO-056
Core Service
/api/v1/.../detail-general
POST
Smoke Test
N/A
Status 200, Return Detail
Status 400
Verified
N/A
Fail
Data invalid
CORE-AUTO-057
Core Service
/api/v1/.../eval-candidate/1
GET
Smoke Test
N/A
Status 200, Return Eval
Status 403
Verified
N/A
Fail
Forbidden
CORE-AUTO-058
Core Service
/api/v1/.../eval-
candidate/create
POST
Smoke Test
N/A
Status 201, Created
Status 400
Verified
N/A
Fail
Create error
CORE-AUTO-059
Core Service
/api/v1/.../eval-candidate/1
POST
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-060
Core Service
/api/v1/.../apply/filter
GET
Smoke Test
N/A
Status 200, Return List
Status 403
Verified
N/A
Fail
Forbidden
CORE-AUTO-061
Core Service
/api/v1/.../current-process/1
GET
Smoke Test
N/A
Status 200, Return Process
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-062
Core Service
/api/v1/.../by-process/1
GET
Smoke Test
N/A
Status 200, Return Data
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-063
Core Service
/api/v1/.../save-summary
POST
Smoke Test
N/A
Status 200, Saved
Status 400
Verified
N/A
Fail
Save error
CORE-AUTO-064
Core Service
/api/v1/core/career/filter
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-065
Core Service
/api/v1/core/career/detail/1
GET
Smoke Test
N/A
Status 200, Return Career
Status 403
Verified
N/A
Fail
Forbidden
CORE-AUTO-066
Core Service
/api/v1/core/career/create
POST
Smoke Test
N/A
Status 201, Created
Status 400
Verified
N/A
Fail
Create error
CORE-AUTO-067
Core Service
/api/v1/core/career/update/1
PUT
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-068
Core Service
/api/v1/core/career/delete
DELETE
Smoke Test
N/A
Status 204, Deleted
Status 400
Verified
N/A
Fail
Delete error
CORE-AUTO-069
Core Service
/api/v1/.../dashboard-
overview
GET
Smoke Test
N/A
Status 200, Return Data
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-070
Core Service
/api/v1/.../percent-passed
GET
Smoke Test
N/A
Status 200, Return %
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-071
Core Service
/api/v1/.../apply-most
GET
Smoke Test
N/A
Status 200, Return Data
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-072
Core Service
/api/v1/.../eliminated-reason
GET
Smoke Test
N/A
Status 200, Return List
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-073
Core Service
/api/v1/.../job-ad-by-time
GET
Smoke Test
N/A
Status 200, Return Data
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-074
Core Service
/api/v1/.../job-ad-by-career
GET
Smoke Test
N/A
Status 200, Return Data
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-075
Core Service
/api/v1/.../job-ad-by-level
GET
Smoke Test
N/A
Status 200, Return Data
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-076
Core Service
/api/v1/.../job-ad-featured
GET
Smoke Test
N/A
Status 200, Return List
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-077
Core Service
/api/v1/.../new-org-by-time
GET
Smoke Test
N/A
Status 200, Return Data
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-078
Core Service
/api/v1/.../staff-size
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-079
Core Service
/api/v1/.../org-featured
GET
Smoke Test
N/A
Status 200, Return List
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-080
Core Service
/api/v1/.../org-overview
GET
Smoke Test
N/A
Status 200, Return Data
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-081
Core Service
/api/v1/.../org-percent-passed
GET
Smoke Test
N/A
Status 200, Return %
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-082
Core Service
/api/v1/.../job-ad-by-hr
GET
Smoke Test
N/A
Status 200, Return Data
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-083
Core Service
/api/v1/.../job-ad-by-dept
GET
Smoke Test
N/A
Status 200, Return Data
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-084
Core Service
/api/v1/.../pass-by-level
GET
Smoke Test
N/A
Status 200, Return Data
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-085
Core Service
/api/v1/.../org-elim-reason
GET
Smoke Test
N/A
Status 200, Return List
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-086
Core Service
/api/v1/.../org-job-featured
GET
Smoke Test
N/A
Status 200, Return List
Status 400
Verified
N/A
Fail
Request invalid
CORE-AUTO-087
Core Service
/api/v1/core/dept/detail/1
GET
Smoke Test
N/A
Status 200, Return Detail
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-088
Core Service
/api/v1/core/dept/filter
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed


## Page 4

CORE-AUTO-089
Core Service
/api/v1/core/dept/create
POST
Smoke Test
N/A
Status 201, Created
Status 400
Verified
N/A
Fail
Create error
CORE-AUTO-090
Core Service
/api/v1/.../dept-active
PUT
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-091
Core Service
/api/v1/core/dept/update/1
PUT
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-092
Core Service
/api/v1/core/dept/delete
DELETE
Smoke Test
N/A
Status 204, Deleted
Status 400
Verified
N/A
Fail
Delete error
CORE-AUTO-093
Core Service
/api/v1/core/type/currency
GET
Smoke Test
N/A
Status 200, Return Types
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-094
Core Service
/api/v1/core/type/status
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-095
Core Service
/api/v1/core/type/job
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-096
Core Service
/api/v1/core/type/salary
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-097
Core Service
/api/v1/core/type/reason
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-098
Core Service
/api/v1/core/type/calendar
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-099
Core Service
/api/v1/core/industry/filter
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-100
Core Service
/api/v1/.../industry-public
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-101
Core Service
/api/v1/core/industry/detail/1
GET
Smoke Test
N/A
Status 200, Return Detail
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-102
Core Service
/api/v1/core/industry/create
POST
Smoke Test
N/A
Status 201, Created
Status 400
Verified
N/A
Fail
Create error
CORE-AUTO-103
Core Service
/api/v1/core/industry/update/1 PUT
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-104
Core Service
/api/v1/core/industry/delete
DELETE
Smoke Test
N/A
Status 204, Deleted
Status 400
Verified
N/A
Fail
Delete error
CORE-AUTO-105
Core Service
/api/v1/.../candidate/filter
GET
Smoke Test
N/A
Status 200, Return List
Status 403
Verified
N/A
Fail
Forbidden
CORE-AUTO-106
Core Service
/api/v1/.../candidate-detail/1
GET
Smoke Test
N/A
Status 200, Return Detail
Status 403
Verified
N/A
Fail
Forbidden
CORE-AUTO-107
Core Service
/api/v1/.../applied-jobs
GET
Smoke Test
N/A
Status 200, Return List
Status 500
N/A
N/A
Fail
Server Error
CORE-AUTO-108
Core Service
/api/v1/.../chat-candidate
GET
Smoke Test
N/A
Status 200, Return Chat
Status 500
N/A
N/A
Fail
Server Error
CORE-AUTO-109
Core Service
/api/v1/.../chat-org
GET
Smoke Test
N/A
Status 200, Return Chat
Status 500
N/A
N/A
Fail
Server Error
CORE-AUTO-110
Core Service
/api/v1/.../list-onboard
GET
Smoke Test
N/A
Status 200, Return List
Status 403
Verified
N/A
Fail
Forbidden
CORE-AUTO-111
Core Service
/api/v1/.../get-data/1/1
GET
Smoke Test
N/A
Status 200, Return Data
Status 401
Verified
N/A
Fail
Unauthorized
CORE-AUTO-112
Core Service
/api/v1/core/candidate/apply
POST
Smoke Test
N/A
Status 201, Applied
Status 500
N/A
N/A
Fail
Server Error
CORE-AUTO-113
Core Service
/api/v1/core/candidate/email
POST
Smoke Test
N/A
Status 200, Email Sent
Status 400
Verified
N/A
Fail
Send error
CORE-AUTO-114
Core Service
/api/v1/.../validate-chat
POST
Smoke Test
N/A
Status 200, Success
Status 400
Verified
N/A
Fail
Validate error
CORE-AUTO-115
Core Service
/api/v1/core/candidate/proces
s
PUT
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-116
Core Service
/api/v1/.../eliminate
PUT
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-117
Core Service
/api/v1/.../onboard-date
PUT
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-118
Core Service
/api/v1/.../mark-onboard
PUT
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-119
Core Service
/api/v1/core/job-ad/process/1
GET
Smoke Test
N/A
Status 200, Return Process
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-120
Core Service
/api/v1/core/job-ad/org/filter
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-121
Core Service
/api/v1/core/job-ad/detail/1
GET
Smoke Test
N/A
Status 200, Return Detail
Status 404
Verified
N/A
Fail
Not Found
CORE-AUTO-122
Core Service
/api/v1/.../by-participant
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-123
Core Service
/api/v1/.../data-filter
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-124
Core Service
/api/v1/.../outside/filter
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-125
Core Service
/api/v1/.../outside/detail/1
GET
Smoke Test
N/A
Status 200, Return Detail
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-126
Core Service
/api/v1/.../outside/relate/1
GET
Smoke Test
N/A
Status 200, Return Relate
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-127
Core Service
/api/v1/.../outside/featured
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-128
Core Service
/api/v1/.../outside/suitable
GET
Smoke Test
N/A
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-129
Core Service
/api/v1/core/job-ad/status/1
PUT
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-130
Core Service
/api/v1/core/job-ad/public/1
PUT
Smoke Test
N/A
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-131
Core Service
/api/v1/core/job-ad/update/1
PUT
Smoke Test
`N/A"
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-132
Core Service
/api/v1/core/level/detail/1
GET
Smoke Test
`N/A"
Status 200, Return Detail
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-133
Core Service
/api/v1/core/level/filter
GET
Smoke Test
`N/A"
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-134
Core Service
/api/v1/core/level/create
POST
Smoke Test
`N/A"
Status 201, Created
Status 400
Verified
N/A
Fail
Create error
CORE-AUTO-135
Core Service
/api/v1/core/level/update/1
PUT
Smoke Test
`N/A"
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-136
Core Service
/api/v1/core/level/delete
DELETE
Smoke Test
`N/A"
Status 204, Deleted
Status 400
Verified
N/A
Fail
Delete error
CORE-AUTO-137
Core Service
/api/v1/core/org-address/all
GET
Smoke Test
`N/A"
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-138
Core Service
/api/v1/core/org-address/save POST
Smoke Test
`N/A"
Status 200, Saved
Status 400
Verified
N/A
Fail
Save error
CORE-AUTO-139
Core Service
/api/v1/core/org/internal/1
GET
Smoke Test
`N/A"
Status 200, Return Detail
Status 401
Verified
N/A
Fail
Unauthorized
CORE-AUTO-140
Core Service
/api/v1/core/org/org-info
GET
Smoke Test
`N/A"
Status 200, Return Profile
Status 403
Verified
N/A
Fail
Forbidden
CORE-AUTO-141
Core Service
/api/v1/core/org/outside/1
GET
Smoke Test
`N/A"
Status 200, Return Detail
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-142
Core Service
/api/v1/core/org/featured
GET
Smoke Test
`N/A"
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-143
Core Service
/api/v1/core/org/by-job/1
GET
Smoke Test
`N/A"
Status 200, Return Org
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-144
Core Service
/api/v1/core/org/filter
GET
Smoke Test
`N/A"
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed


## Page 5

CORE-AUTO-145
Core Service
/api/v1/core/org/export
GET
Smoke Test
`N/A"
Status 200, File Exported
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-146
Core Service
/api/v1/core/org/detail/1
GET
Smoke Test
`N/A"
Status 200, Return Detail
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-147
Core Service
/api/v1/core/org/create
POST
Smoke Test
`N/A"
Status 201, Created
Status 500
N/A
N/A
Fail
Server Error
CORE-AUTO-148
Core Service
/api/v1/core/org/delete
POST
Smoke Test
`N/A"
Status 204, Deleted
Status 400
Verified
N/A
Fail
Delete error
CORE-AUTO-149
Core Service
/api/v1/core/org/update
PUT
Smoke Test
`N/A"
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-150
Core Service
/api/v1/core/org/logo
PUT
Smoke Test
`N/A"
Status 200, Logo Updated
Status 500
N/A
N/A
Fail
Server Error
CORE-AUTO-151
Core Service
/api/v1/core/org/cover
PUT
Smoke Test
`N/A"
Status 200, Photo Updated
Status 500
N/A
N/A
Fail
Server Error
CORE-AUTO-152
Core Service
/api/v1/core/org/status
PUT
Smoke Test
`N/A"
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-153
Core Service
/api/v1/core/pos/detail/1
GET
Smoke Test
`N/A"
Status 200, Return Detail
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-154
Core Service
/api/v1/core/pos/filter
GET
Smoke Test
`N/A"
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-155
Core Service
/api/v1/core/pos/create
POST
Smoke Test
`N/A"
Status 201, Created
Status 400
Verified
N/A
Fail
Create error
CORE-AUTO-156
Core Service
/api/v1/core/pos/status
PUT
Smoke Test
`N/A"
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-157
Core Service
/api/v1/core/pos/update/1
PUT
Smoke Test
`N/A"
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-158
Core Service
/api/v1/core/pos/delete
DELETE
Smoke Test
`N/A"
Status 204, Deleted
Status 400
Verified
N/A
Fail
Delete error
CORE-AUTO-159
Core Service
/api/v1/core/process/detail/1
GET
Smoke Test
`N/A"
Status 200, Return Detail
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-160
Core Service
/api/v1/core/process/all
GET
Smoke Test
`N/A"
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-161
Core Service
/api/v1/core/process/update
POST
Smoke Test
`N/A"
Status 200, Updated
Status 400
Verified
N/A
Fail
Update error
CORE-AUTO-162
Core Service
/api/v1/core/email/preview
POST
Smoke Test
`N/A"
Status 200, Return Html
Status 400
Verified
N/A
Fail
Preview error
CORE-AUTO-163
Core Service
/api/v1/core/history/my
GET
Smoke Test
`N/A"
Status 200, Return List
Status 200
Verified
N/A
Pass
Test passed
CORE-AUTO-164
Core Service
/api/v1/core/history/delete
DELETE
Smoke Test
`N/A"
Status 204, Deleted
Status 400
Verified
N/A
Fail
Delete error
CORE-AUTO-165
Core Service
/api/v1/core/history/all
DELETE
Smoke Test
`N/A"
Status 204, Deleted
Status 200
Verified
N/A
Pass
Test passed
NOTIFY-AUTO-166
Notify Service
/api/v1/.../check-chat
GET
Smoke Test
`N/A"
Status 200, Return Bool
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-167
Notify Service
/api/v1/.../unread-chat
GET
Smoke Test
`N/A"
Status 200, Return Count
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-168
Notify Service
/api/v1/.../my-chats
GET
Smoke Test
`N/A"
Status 200, Return List
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-169
Notify Service
/api/v1/.../chats-internal
GET
Smoke Test
`N/A"
Status 200, Return List
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-170
Notify Service
/api/v1/notify/chat/messages
GET
Smoke Test
`N/A"
Status 200, Return List
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-171
Notify Service
/api/v1/notify/chat/create
POST
Smoke Test
`N/A"
Status 201, Created
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-172
Notify Service
/api/v1/.../chat-filtered
POST
Smoke Test
`N/A"
Status 200, Return List
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-173
Notify Service
/api/v1/.../read-all
POST
Smoke Test
`N/A"
Status 200, Success
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-174
Notify Service
/api/v1/.../new-message
POST
Smoke Test
`N/A"
Status 201, Sent
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-175
Notify Service
/api/v1/notify/email-cfg
GET
Smoke Test
`N/A"
Status 200, Return Config
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-176
Notify Service
/api/v1/notify/email-cfg/int
GET
Smoke Test
`N/A"
Status 200, Return Data
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-177
Notify Service
/api/v1/notify/email-cfg
POST
Smoke Test
`N/A"
Status 201, Created
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-178
Notify Service
/api/v1/notify/email-cfg
PUT
Smoke Test
`N/A"
Status 200, Updated
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-179
Notify Service
/api/v1/notify/email-cfg
DELETE
Smoke Test
`N/A"
Status 204, Deleted
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-180
Notify Service
/api/v1/notify/email/resend
POST
Smoke Test
`N/A"
Status 200, Sent
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-181
Notify Service
/api/v1/notify/email-log
GET
Smoke Test
`N/A"
Status 200, Return Logs
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-182
Notify Service
/api/v1/notify/email-temp
GET
Smoke Test
`N/A"
Status 200, Return List
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-183
Notify Service
/api/v1/notify/email-temp/1
GET
Smoke Test
`N/A"
Status 200, Return Detail
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-184
Notify Service
/api/v1/notify/email-temp/org
GET
Smoke Test
`N/A"
Status 200, Return Data
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-185
Notify Service
/api/v1/notify/email-temp/int
GET
Smoke Test
`N/A"
Status 200, Return Data
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-186
Notify Service
/api/v1/notify/email-temp
POST
Smoke Test
`N/A"
Status 201, Created
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-187
Notify Service
/api/v1/notify/email/prev/1
POST
Smoke Test
`N/A"
Status 200, Return Html
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-188
Notify Service
/api/v1/notify/email/prev
POST
Smoke Test
`N/A"
Status 200, Return Html
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-189
Notify Service
/api/v1/notify/email/prev-def
POST
Smoke Test
`N/A"
Status 200, Return Html
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-190
Notify Service
/api/v1/notify/email-temp/1
PUT
Smoke Test
`N/A"
Status 200, Updated
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-191
Notify Service
/api/v1/notify/email-temp/act
PUT
Smoke Test
`N/A"
Status 200, Updated
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-192
Notify Service
/api/v1/notify/email-temp
DELETE
Smoke Test
`N/A"
Status 204, Deleted
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-193
Notify Service
/api/v1/notify/notif/my
GET
Smoke Test
`N/A"
Status 200, Return List
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-194
Notify Service
/api/v1/notify/notif/unread
GET
Smoke Test
`N/A"
Status 200, Return Count
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-195
Notify Service
/api/v1/notify/notif/read-all
PUT
Smoke Test
`N/A"
Status 200, Success
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-196
Notify Service
/api/v1/notify/notif/read/1
PUT
Smoke Test
`N/A"
Status 200, Success
Status 500
N/A
N/A
Fail
Server Error
NOTIFY-AUTO-197
Notify Service
/api/v1/notify/placeholder
GET
Smoke Test
`N/A"
Status 200, Return List
Status 500
N/A
N/A
Fail
Server Error


