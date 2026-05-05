# API Test Report (Results: 153 Pass, 44 Fail)

## Summary Metrics
- Total Test Cases: 197
- Pass: 153
- Fail: 44
- Pass Rate: 77.7%


| Test ID | Feature | API Path | HTTP Method | Scenario | Input Data | Expected Status/Response | Actual Status/Response | DB Check | Rollback | Result | Notes |
|---------|---------|----------|-------------|----------|------------|--------------------------|------------------------|----------|----------|--------|-------|
| AUTH-P-01 | Authentication | /api/v1/user/auth/login | POST | Login Success | `{"username":"admin_test","password":"Password123!"}` | Status 200 | Status 200 | Verified | Yes | Pass | Test passed successfully |
| AUTH-N-01 | Authentication | /api/v1/user/auth/login | POST | Wrong Pass | `{"username":"admin_test","password":"WrongPassword#99"}` | Status 401 | Status 401 | Verified | Yes | Pass | Test passed successfully |
| AUTH-N-02 | Authentication | /api/v1/user/auth/login | POST | Empty User | `{"username":""}` | Status 400 | Status 400 | Status 400 | Verified | Yes | Pass |
| AUTH-P-02 | Authentication | /api/v1/user/auth/register-candidate | POST | Register Success | `{"username":"qa_user_01","email":"qa@test.com","password":"SecurePass!2024","fullName":"QA User"}` | Status 201 | Status 201 | Verified | Yes | Pass | Test passed successfully |
| AUTH-N-03 | Authentication | /api/v1/user/auth/register-candidate | POST | Duplicate User | `{"username":"admin_test","fullName":"Admin"}` | Status 400 | Status 400 | Status 400 | Verified | Yes | Pass |
| USER-P-01 | User Management | /api/v1/user/user/my-info/1 | GET | My Info | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-P-02 | User Management | /api/v1/user/user/my-roles | GET | My Roles | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-S-01 | User Management | /api/v1/user/user/filter | GET | Filter RBAC | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| JOB-P-01 | Job Advertisement | /api/v1/core/job-ad/create | POST | Create Job | `{"title":"Senior QA Engineer", ...}` | Status 201 | Status 201 | Verified | Yes | Pass | Test passed successfully |
| JOB-N-01 | Job Advertisement | /api/v1/core/job-ad/create | POST | Bad Range | `{"title":"Bad Salary","salaryFrom":2000,"salaryTo":1000}` | Status 400 | Status 400 | Status 400 | Verified | Yes | Pass |
| AUTH-P-01-S | Authentication | /api/v1/user/auth/login | POST | Login Success (No Token) | `{"username":"admin_test","password":"Password123!"}` | Status 200 | Status 200 | Status 200 | Verified | Yes | Pass |
| AUTH-P-01-B | Authentication | /api/v1/user/auth/login | POST | Login Success (Boundary Data) | `{"username":"admin_test","password":"Password123!","fullName":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}` | Status 200 | Status 200 | Status 200 | Verified | Yes | Pass |
| AUTH-N-01-S | Authentication | /api/v1/user/auth/login | POST | Wrong Pass (No Token) | `{"username":"admin_test","password":"WrongPassword123!"}` | Status 401 | Status 401 | Status 401 | Verified | Yes | Pass |
| AUTH-N-01-B | Authentication | /api/v1/user/auth/login | POST | Wrong Pass (Boundary Data) | `{"username":"admin_test","password":"WrongPassword123!","fullName":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}` | Status 401 | Status 401 | Status 401 | Verified | Yes | Pass |
| AUTH-N-02-S | Authentication | /api/v1/user/auth/login | POST | Empty User (No Token) | `{"username":""}` | Status 400 | Status 400 | Status 400 | Verified | Yes | Pass |
| AUTH-N-02-B | Authentication | /api/v1/user/auth/login | POST | Empty User (Boundary Data) | `{"username":"","fullName":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}` | Status 400 | Status 400 | Status 400 | Verified | Yes | Pass |
| AUTH-P-02-S | Authentication | /api/v1/user/auth/register-candidate | POST | Register Success (No Token) | `{"username":"qa_user_01","email":"qa@test.com","password":"SecurePass!2024","fullName":"QA User"}` | Status 201 | Status 201 | Verified | Yes | Pass | Test passed successfully |
| AUTH-P-02-B | Authentication | /api/v1/user/auth/register-candidate | POST | Register Success (Boundary Data) | `{"username":"qa_user_1777905495028","email":"qa1777905495028@example.com","password":"Password123!","fullName":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}` | Status 201 | Status 400 | Status 400 | Verified | Yes | Pass |
| AUTH-N-03-S | Authentication | /api/v1/user/auth/register-candidate | POST | Duplicate User (No Token) | `{"username":"admin_test","fullName":"Admin"}` | Status 400 | Status 400 | Status 400 | Verified | Yes | Pass |
| AUTH-N-03-B | Authentication | /api/v1/user/auth/register-candidate | POST | Duplicate User (Boundary Data) | `{"username":"admin_test","fullName":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}` | Status 400 | Status 400 | Status 400 | Verified | Yes | Pass |
| USER-P-01-S | User Management | /api/v1/user/user/my-info/1 | GET | My Info (No Token) | `N/A` | Status 200 | Status 401 | Status 401 | N/A | N/A | Fail |
| USER-P-02-S | User Management | /api/v1/user/user/my-roles | GET | My Roles (No Token) | `N/A` | Status 200 | Status 401 | Status 401 | N/A | N/A | Fail |
| USER-S-01-S | User Management | /api/v1/user/user/filter | GET | Filter RBAC (No Token) | `N/A` | Status 401 | Status 401 | Status 401 | N/A | N/A | Fail |
| JOB-P-01-S | Job Advertisement | /api/v1/core/job-ad/create | POST | Create Job (No Token) | `{"title":"Senior QA Engineer","positionId":1,"careerIds":[1],"workLocationIds":[1],"jobType":"FULL_TIME","dueDate":"2026-12-31T00:00:00Z","quantity":1,"salaryType":"RANGE","salaryFrom":20000000,"salaryTo":30000000,"currencyType":"VND","description":"Automated test description.","hrContactId":1,"jobAdStatus":"OPEN","isAllLevel":true,"levelIds":[1],"positionProcess":[{"name":"Initial Screening","processTypeId":1,"sortOrder":1},{"name":"Onboard","processTypeId":6,"sortOrder":2}]}` | Status 201 | Status 401 | Status 401 | N/A | Yes | Fail |
| JOB-P-01-B | Job Advertisement | /api/v1/core/job-ad/create | POST | Create Job (Boundary Data) | `{"title":"Senior QA Engineer","positionId":1,"careerIds":[1],"workLocationIds":[1],"jobType":"FULL_TIME","dueDate":"2026-12-31T00:00:00Z","quantity":1,"salaryType":"RANGE","salaryFrom":20000000,"salaryTo":30000000,"currencyType":"VND","description":"Automated test description.","hrContactId":1,"jobAdStatus":"OPEN","isAllLevel":true,"levelIds":[1],"positionProcess":[{"name":"Initial Screening","processTypeId":1,"sortOrder":1},{"name":"Onboard","processTypeId":6,"sortOrder":2}],"fullName":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}` | Status 201 | Status 200 | Status 200 | Verified | Yes | Pass |
| JOB-N-01-S | Job Advertisement | /api/v1/core/job-ad/create | POST | Bad Range (No Token) | `{"title":"Bad Salary","salaryFrom":2000,"salaryTo":1000}` | Status 401 | Status 401 | Status 401 | Verified | Yes | Pass |
| JOB-N-01-B | Job Advertisement | /api/v1/core/job-ad/create | POST | Bad Range (Boundary Data) | `{"title":"Bad Salary","salaryFrom":2000,"salaryTo":1000,"fullName":"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"}` | Status 400 | Status 400 | Status 400 | Verified | Yes | Pass |
| USER-AUTO-001 | User Management | /api/v1/user/auth/request-resend-verify-email | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| USER-AUTO-002 | User Management | /api/v1/user/auth/request-reset-password | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| USER-AUTO-003 | User Management | /api/v1/user/auth/refresh | POST | Smoke | `N/A` | Status 401 | Status 401 | Status 401 | Verified | N/A | Pass |
| USER-AUTO-004 | User Management | /api/v1/user/auth/logout | POST | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-005 | User Management | /api/v1/user/auth/register-org-admin | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| USER-AUTO-006 | User Management | /api/v1/user/auth/verify | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-007 | User Management | /api/v1/user/auth/verify-token | POST | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-008 | User Management | /api/v1/user/auth/verify-email/1 | PUT | Smoke | `N/A` | Status 401 | Status 401 | Status 401 | Verified | N/A | Pass |
| USER-AUTO-009 | User Management | /api/v1/user/auth/reset-password | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-010 | User Management | /api/v1/user/candidate/internal/number-of-new-candidate | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-011 | User Management | /api/v1/user/menu/menu-by-role/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-012 | User Management | /api/v1/user/menu/all-menus | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| USER-AUTO-013 | User Management | /api/v1/user/org-member/filter | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-014 | User Management | /api/v1/user/org-member/internal/valid-org-member | GET | Smoke | `N/A` | Status 401 | Status 401 | Status 401 | Verified | N/A | Pass |
| USER-AUTO-015 | User Management | /api/v1/user/org-member/org-member-info/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-016 | User Management | /api/v1/user/org-member/org-member-by-org | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-017 | User Management | /api/v1/user/org-member/invite-join-org | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-018 | User Management | /api/v1/user/org-member/reply-invite-join-org | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-019 | User Management | /api/v1/user/org-member/internal/check-org-member | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-020 | User Management | /api/v1/user/org-member/internal/update-account-status-by-org-ids | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-021 | User Management | /api/v1/user/org-member/internal/rollback-update-account-status-by-org-ids | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-022 | User Management | /api/v1/user/org-member/assign-role | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-023 | User Management | /api/v1/user/org-memberchange-status-active | PUT | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| USER-AUTO-024 | User Management | /api/v1/user/role/member-type | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-025 | User Management | /api/v1/user/role/filter | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-026 | User Management | /api/v1/user/role/get-member-type-organization | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-027 | User Management | /api/v1/user/role/detail/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-028 | User Management | /api/v1/user/role/create | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-029 | User Management | /api/v1/user/role/update/1 | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-030 | User Management | /api/v1/user/role/delete | DELETE | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-031 | User Management | /api/v1/user/role-menu/permission-type | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-032 | User Management | /api/v1/user/user/internal/check-org-user-role/1/1/1 | GET | Smoke | `N/A` | Status 401 | Status 401 | Status 401 | Verified | N/A | Pass |
| USER-AUTO-033 | User Management | /api/v1/user/user/get-by-role-code-org/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-034 | User Management | /api/v1/user/user/internal/get-by-id/1 | GET | Smoke | `N/A` | Status 401 | Status 401 | Status 401 | Verified | N/A | Pass |
| USER-AUTO-035 | User Management | /api/v1/user/user/internal/get-by-role-code-org-id/1/1 | GET | Smoke | `N/A` | Status 401 | Status 401 | Status 401 | Verified | N/A | Pass |
| USER-AUTO-036 | User Management | /api/v1/user/user/find-not-org-member | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-037 | User Management | /api/v1/user/user/user-detail-for-system-admin/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-038 | User Management | /api/v1/user/user/filter/export | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-039 | User Management | /api/v1/user/user/my-profiles | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-040 | User Management | /api/v1/user/user/internal/get-by-ids | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-041 | User Management | /api/v1/user/user/role-default/1 | PUT | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| USER-AUTO-042 | User Management | /api/v1/user/user/update-password | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-043 | User Management | /api/v1/user/user/update-avatar | PUT | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| USER-AUTO-044 | User Management | /api/v1/user/user/update-info | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-045 | User Management | /api/v1/user/user/assign-role-system-admin/1 | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| USER-AUTO-046 | User Management | /api/v1/user/user/retrieve-role-system-admin/1 | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-047 | Core Service | /api/v1/core/attach-file/internal/get-by-id/1 | GET | Smoke | `N/A` | Status 401 | Status 401 | Status 401 | Verified | N/A | Pass |
| CORE-AUTO-048 | Core Service | /api/v1/core/attach-file/upload | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| CORE-AUTO-049 | Core Service | /api/v1/core/attach-file/internal/upload | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| CORE-AUTO-050 | Core Service | /api/v1/core/attach-file/internal/uploads | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| CORE-AUTO-051 | Core Service | /api/v1/core/attach-file/internal/delete-by-ids | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-052 | Core Service | /api/v1/core/calendar/filter-view-candidate | GET | Smoke | `N/A` | Status 403 | Status 403 | Status 403 | Verified | N/A | Pass |
| CORE-AUTO-053 | Core Service | /api/v1/core/calendar/detail-in-view-candidate/1 | GET | Smoke | `N/A` | Status 403 | Status 403 | Status 403 | Verified | N/A | Pass |
| CORE-AUTO-054 | Core Service | /api/v1/core/calendar/filter-view-general | GET | Smoke | `N/A` | Status 403 | Status 403 | Status 403 | Verified | N/A | Pass |
| CORE-AUTO-055 | Core Service | /api/v1/core/calendar/create | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-056 | Core Service | /api/v1/core/calendar/detail-in-view-general | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-057 | Core Service | /api/v1/core/candidate-evaluation/get-by-job-ad-candidate/1 | GET | Smoke | `N/A` | Status 403 | Status 403 | Status 403 | Verified | N/A | Pass |
| CORE-AUTO-058 | Core Service | /api/v1/core/candidate-evaluation/create | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-059 | Core Service | /api/v1/core/candidate-evaluation/update/1 | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-060 | Core Service | /api/v1/core/candidate-info-apply/filter | GET | Smoke | `N/A` | Status 403 | Status 403 | Status 403 | Verified | N/A | Pass |
| CORE-AUTO-061 | Core Service | /api/v1/core/candidate-info-apply/get-candidate-in-current-process/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-062 | Core Service | /api/v1/core/candidate-info-apply/filter-by-job-ad-process/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-063 | Core Service | /api/v1/core/candidate-summary-org/save-summary | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-064 | Core Service | /api/v1/core/career/filter | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-065 | Core Service | /api/v1/core/career/detail/1 | GET | Smoke | `N/A` | Status 403 | Status 403 | Status 403 | Verified | N/A | Pass |
| CORE-AUTO-066 | Core Service | /api/v1/core/career/create | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-067 | Core Service | /api/v1/core/career/update/1 | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-068 | Core Service | /api/v1/core/career/delete-by-ids | DELETE | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-069 | Core Service | /api/v1/core/dashboard/system-admin/overview | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-070 | Core Service | /api/v1/core/dashboard/system-admin/percent-passed | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-071 | Core Service | /api/v1/core/dashboard/system-admin/candidate-apply-most | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-072 | Core Service | /api/v1/core/dashboard/system-admin/eliminated-reason | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-073 | Core Service | /api/v1/core/dashboard/system-admin/job-ad-by-time | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-074 | Core Service | /api/v1/core/dashboard/system-admin/job-ad-by-career | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-075 | Core Service | /api/v1/core/dashboard/system-admin/job-ad-by-level | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-076 | Core Service | /api/v1/core/dashboard/system-admin/job-ad-featured | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-077 | Core Service | /api/v1/core/dashboard/system-admin/new-org-by-time | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-078 | Core Service | /api/v1/core/dashboard/system-admin/staff-size | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-079 | Core Service | /api/v1/core/dashboard/system-admin/organization-featured | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-080 | Core Service | /api/v1/core/dashboard/org-admin/overview | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-081 | Core Service | /api/v1/core/dashboard/org-admin/percent-passed | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-082 | Core Service | /api/v1/core/dashboard/org-admin/job-ad-by-hr | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-083 | Core Service | /api/v1/core/dashboard/org-admin/job-ad-by-department | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-084 | Core Service | /api/v1/core/dashboard/org-admin/pass-by-level | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-085 | Core Service | /api/v1/core/dashboard/org-admin/eliminated-reason | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-086 | Core Service | /api/v1/core/dashboard/org-admin/job-ad-featured | GET | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-087 | Core Service | /api/v1/core/department/detail/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-088 | Core Service | /api/v1/core/department/filter | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-089 | Core Service | /api/v1/core/department/create | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-090 | Core Service | /api/v1/core/department/change-status-active | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-091 | Core Service | /api/v1/core/department/update/1 | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-092 | Core Service | /api/v1/core/department/delete | DELETE | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-093 | Core Service | /api/v1/core/type/currency | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-094 | Core Service | /api/v1/core/type/job-ad-status | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-095 | Core Service | /api/v1/core/type/Job | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-096 | Core Service | /api/v1/core/type/salary | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-097 | Core Service | /api/v1/core/type/eliminate-reason | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-098 | Core Service | /api/v1/core/type/calendar-type | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-099 | Core Service | /api/v1/core/industry/filter | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-100 | Core Service | /api/v1/core/industry/public/filter | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-101 | Core Service | /api/v1/core/industry/detail/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-102 | Core Service | /api/v1/core/industry/create | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-103 | Core Service | /api/v1/core/industry/update/1 | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-104 | Core Service | /api/v1/core/industry/delete | DELETE | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-105 | Core Service | /api/v1/core/job-ad-candidate/filter | GET | Smoke | `N/A` | Status 403 | Status 403 | Status 403 | Verified | N/A | Pass |
| CORE-AUTO-106 | Core Service | /api/v1/core/job-ad-candidate/candidate-detail/1 | GET | Smoke | `N/A` | Status 403 | Status 403 | Status 403 | Verified | N/A | Pass |
| CORE-AUTO-107 | Core Service | /api/v1/core/job-ad-candidate/job-ad-applied | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| CORE-AUTO-108 | Core Service | /api/v1/core/job-ad-candidate/conversation/view-candidate | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| CORE-AUTO-109 | Core Service | /api/v1/core/job-ad-candidate/conversation/view-organization | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| CORE-AUTO-110 | Core Service | /api/v1/core/job-ad-candidate/list-onboard | GET | Smoke | `N/A` | Status 403 | Status 403 | Status 403 | Verified | N/A | Pass |
| CORE-AUTO-111 | Core Service | /api/v1/core/job-ad-candidate/internal/get-job-ad-candidate-data/1/1 | GET | Smoke | `N/A` | Status 401 | Status 401 | Status 401 | Verified | N/A | Pass |
| CORE-AUTO-112 | Core Service | /api/v1/core/job-ad-candidate/apply | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| CORE-AUTO-113 | Core Service | /api/v1/core/job-ad-candidate/send-email | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-114 | Core Service | /api/v1/core/job-ad-candidate/internal/validate-create-conversation | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-115 | Core Service | /api/v1/core/job-ad-candidate/change-process | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-116 | Core Service | /api/v1/core/job-ad-candidate/eliminate-candidate | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-117 | Core Service | /api/v1/core/job-ad-candidate/change-onboard-date | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-118 | Core Service | /api/v1/core/job-ad-candidate/mark-onboard | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-119 | Core Service | /api/v1/core/job-ad/process/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-120 | Core Service | /api/v1/core/job-ad/org/filter | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-121 | Core Service | /api/v1/core/job-ad/org/detail/1 | GET | Smoke | `N/A` | Status 404 | Status 404 | Status 404 | Verified | N/A | Pass |
| CORE-AUTO-122 | Core Service | /api/v1/core/job-ad/by-participant | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-123 | Core Service | /api/v1/core/job-ad/outside/data-filter | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-124 | Core Service | /api/v1/core/job-ad/outside/filter | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-125 | Core Service | /api/v1/core/job-ad/outside/detail/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-126 | Core Service | /api/v1/core/job-ad/outside/relate/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-127 | Core Service | /api/v1/core/job-ad/outside/filter-featured | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-128 | Core Service | /api/v1/core/job-ad/outside/filter-suitable | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-129 | Core Service | /api/v1/core/job-ad/update-status/1 | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-130 | Core Service | /api/v1/core/job-ad/update-public/1 | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-131 | Core Service | /api/v1/core/job-ad/update/1 | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-132 | Core Service | /api/v1/core/level/detail/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-133 | Core Service | /api/v1/core/level/filter | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-134 | Core Service | /api/v1/core/level/create | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-135 | Core Service | /api/v1/core/level/update/1 | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-136 | Core Service | /api/v1/core/level/delete | DELETE | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-137 | Core Service | /api/v1/core/org-address/get-all | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-138 | Core Service | /api/v1/core/org-address/save | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-139 | Core Service | /api/v1/core/org/internal/get-by-id/1 | GET | Smoke | `N/A` | Status 401 | Status 401 | Status 401 | Verified | N/A | Pass |
| CORE-AUTO-140 | Core Service | /api/v1/core/org/org-info | GET | Smoke | `N/A` | Status 403 | Status 403 | Status 403 | Verified | N/A | Pass |
| CORE-AUTO-141 | Core Service | /api/v1/core/org/outside/org-info/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-142 | Core Service | /api/v1/core/org/outside/org-featured | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-143 | Core Service | /api/v1/core/org/outside/org-by-job-ad/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-144 | Core Service | /api/v1/core/org/filter | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-145 | Core Service | /api/v1/core/org/filter/export | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-146 | Core Service | /api/v1/core/org/org-details/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-147 | Core Service | /api/v1/core/org/internal/create | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| CORE-AUTO-148 | Core Service | /api/v1/core/org/internal/delete | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-149 | Core Service | /api/v1/core/org/update-info | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-150 | Core Service | /api/v1/core/org/update-logo | PUT | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| CORE-AUTO-151 | Core Service | /api/v1/core/org/update-cover-photo | PUT | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| CORE-AUTO-152 | Core Service | /api/v1/core/org/change-status-active | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-153 | Core Service | /api/v1/core/position/detail/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-154 | Core Service | /api/v1/core/position/filter | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-155 | Core Service | /api/v1/core/position/create | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-156 | Core Service | /api/v1/core/position/change-status-active | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-157 | Core Service | /api/v1/core/position/update/1 | PUT | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-158 | Core Service | /api/v1/core/position/delete | DELETE | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-159 | Core Service | /api/v1/core/process-type/detail/1 | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-160 | Core Service | /api/v1/core/process-type/get-all | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-161 | Core Service | /api/v1/core/process-type/update | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-162 | Core Service | /api/v1/core/replace-placeholder/internal/preview-email | POST | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-163 | Core Service | /api/v1/core/search-history-outside/my-search-history | GET | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| CORE-AUTO-164 | Core Service | /api/v1/core/search-history-outside/delete | DELETE | Smoke | `N/A` | Status 400 | Status 400 | Status 400 | Verified | N/A | Pass |
| CORE-AUTO-165 | Core Service | /api/v1/core/search-history-outside/delete-all | DELETE | Smoke | `N/A` | Status 200 | Status 200 | Status 200 | Verified | N/A | Pass |
| NOTIFY-AUTO-166 | Notify Service | /api/v1/notify/conversation/check-exists/1/1 | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-167 | Notify Service | /api/v1/notify/conversation/check-exists-message-unread | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-168 | Notify Service | /api/v1/notify/conversation/internal/conversation-unread | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-169 | Notify Service | /api/v1/notify/conversation/internal/my-conversations | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-170 | Notify Service | /api/v1/notify/conversation/chat-messages | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-171 | Notify Service | /api/v1/notify/conversation/create | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-172 | Notify Service | /api/v1/notify/conversation/internal/my-conversations-filtered | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-173 | Notify Service | /api/v1/notify/conversation/read-all-messages | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-174 | Notify Service | /api/v1/notify/conversation/new-message | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-175 | Notify Service | /api/v1/notify/email-config/get-by-org | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-176 | Notify Service | /api/v1/notify/email-config/internal/get-by-org | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-177 | Notify Service | /api/v1/notify/email-config/create | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-178 | Notify Service | /api/v1/notify/email-config/update | PUT | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-179 | Notify Service | /api/v1/notify/email-config/delete | DELETE | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-180 | Notify Service | /api/v1/notify/email/resend/1 | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-181 | Notify Service | /api/v1/notify/email-log/log-by-candidate-info/1/1 | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-182 | Notify Service | /api/v1/notify/email-template/filter | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-183 | Notify Service | /api/v1/notify/email-template/detail/1 | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-184 | Notify Service | /api/v1/notify/email-template/internal/get-by-org-id/1 | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-185 | Notify Service | /api/v1/notify/email-template/internal/get-by-id/1 | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-186 | Notify Service | /api/v1/notify/email-template/create | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-187 | Notify Service | /api/v1/notify/email-template/preview-email/1 | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-188 | Notify Service | /api/v1/notify/email-template/preview-email-without-template | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-189 | Notify Service | /api/v1/notify/email-template/preview-email-default | POST | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-190 | Notify Service | /api/v1/notify/email-template/update/1 | PUT | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-191 | Notify Service | /api/v1/notify/email-templatechange-status-active | PUT | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-192 | Notify Service | /api/v1/notify/email-template/delete | DELETE | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-193 | Notify Service | /api/v1/notify/notification/my-notifications | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-194 | Notify Service | /api/v1/notify/notification/quantity-unread | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-195 | Notify Service | /api/v1/notify/notification/mark-all-as-read | PUT | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-196 | Notify Service | /api/v1/notify/notification/mark-as-read/1 | PUT | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |
| NOTIFY-AUTO-197 | Notify Service | /api/v1/notify/placeholder/filter | GET | Smoke | `N/A` | Status 500 | Status 500 | Status 500 | N/A | N/A | Fail |


## Database Verification Results

| Database | Check Description | Result | Details |
|----------|-------------------|--------|---------|
| MySQL | New Candidates Count | Pass | Found 3 test users |
| Postgres | Total Job Ads Count | Pass | Found 19 job ads |
