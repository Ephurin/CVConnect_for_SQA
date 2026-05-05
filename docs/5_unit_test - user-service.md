## Page 1

Module:
User-service
Github:
https://github.com/trungtoto/CVConnect-Unit-
Test
Total TCs:
90
Pass:
90
Fail:
0
Test Case ID
Test Objective
Input
Expected Output
Tester
Status
Note (Verified: All 90 TCs Passed)
UserServiceImplTest
TC-US-USER-001
Reject resetPassword when user does not exist
userId=100,newPassword
Throw AppException USER_NOT_FOUND and no save
Thái
PASS
CheckDB + Rollback (no 
DB mutation)
TC-US-USER-002
Reject resetPassword for third-party account
userId=1,accessMethod=GOOGLE
Throw AppException REGISTER_THIRD_PARTY and no 
save
Thái
PASS
CheckDB + Rollback (no 
DB mutation)
TC-US-USER-003
Update encoded password for LOCAL account
userId=2,newPassword
Repository save with encoded password
Thái
PASS
CheckDB update path
TC-US-USER-004
Reject updateEmailVerified when user missing
userId=88,emailVerified=true
Throw AppException USER_NOT_FOUND and no save
Thái
PASS
CheckDB + Rollback (no 
DB mutation)
TC-US-USER-005
Persist new email verification flag
userId=3,emailVerified=false
Repository save with isEmailVerified=false
Thái
PASS
CheckDB update path
TC-US-USER-006
Return empty list when no users by role and org
roleCode=HR,orgId=55
Return empty list
Thái
PASS
DB read empty branch
TC-US-USER-007
Map users by role and hide password in response
roleCode=ORG_ADMIN,orgId=9
Return mapped DTO with password=null
Thái
PASS
DB read + response safety
OrgMemberServiceImplTest
TC-US-OM-001
Return null when org-member record not found
userId=1
Return null and no org API call
Thái
PASS
DB read not found
TC-US-OM-002
Return null for inactive org-member
userId=2,isActive=false
Return null
Thái
PASS
DB read inactive branch
TC-US-OM-003
Map active org-member and organization
userId=3,orgId=100
Return OrgMemberDto with org info
Thái
PASS
DB read + enrichment
TC-US-OM-004
Block invite when user already in same org
orgId=500,userId=11
Throw AppException USER_JOINED_ORG and no invite 
created
Thái
PASS
CheckDB + Rollback (no 
DB mutation)
TC-US-OM-005
Block invite when target email not verified
orgId=600,userId=12,emailVerified=false
Throw AppException EMAIL_NOT_VERIFIED and no 
invite created
Thái
PASS
CheckDB + Rollback (no 
DB mutation)
TC-US-OM-006
Create invite and send email on valid request
orgId=700,userId=13,roleId=23
Persist PENDING invite with token and send email
Thái
PASS
CheckDB insert path
JobConfigServiceImplTest
TC-US-JC-001
Filter active jobs and map DTO fields
active+inactive+null active configs
Only active job returned and mapped
Thái
PASS
Branch coverage for 
Boolean.TRUE filter
JobSchedulerTest
TC-US-JS-001
Do not schedule when DB job config is empty
jobConfigs=[]
No TaskScheduler interaction
Thái
PASS
DB read empty branch
TC-US-JS-002
Skip scheduling for unknown job name
jobName=missing-job
No TaskScheduler interaction
Thái
PASS
Registry miss branch
TC-US-JS-003
Schedule CRON job
scheduleType=CRON,expression=0 0/5 * * * 
*
TaskScheduler schedule called with CronTrigger
Thái
PASS
Scheduling CRON path
TC-US-JS-004
Schedule FIXED_RATE job in milliseconds
scheduleType=FIXED_RATE,expression=7
TaskScheduler scheduleAtFixedRate called with 7000
Thái
PASS
Seconds to milliseconds 
branch
TC-US-JS-005
Schedule FIXED_DELAY job in milliseconds
scheduleType=FIXED_DELAY,expression=9
TaskScheduler scheduleWithFixedDelay called with 9000
Thái
PASS
Seconds to milliseconds 
branch
FailedRollbackHandlerRegistryTest
TC-US-FRREG-001
Resolve handler by rollback type
types=ORG_CREATION,UPLOAD_FILE
Return matching handler instance
Thái
PASS
Registry lookup success
TC-US-FRREG-002
Return null for unregistered handler type
registered=ORG_CREATION,
request=UPLOAD_FILE
Return null
Thái
PASS
Registry lookup miss
FailedRollbackServiceImplTest
TC-US-FRS-001
Save FailedRollback DTO to repository entity
type=UPLOAD_FILE,payload,error,status,
retry
Repository save called with mapped entity
Thái
PASS
CheckDB write path
TC-US-FRS-002
Return empty list when no pending rollback records
pending=[]
Return empty list
Thái
PASS
DB read empty branch
TC-US-FRS-003
Map pending rollback entities to DTO list
entity id=99,type=ORG_CREATION
Return mapped DTO with expected fields
Thái
PASS
DB read mapping branch
FailedRollbackRetryJobTest
TC-US-FRJOB-001
Validate retry job metadata
getJobName,getScheduleType,getExpression
Expected constants and empty schedule metadata
Thái
PASS
Metadata contract
TC-US-FRJOB-002
Do nothing when no pending rollback records
pending=[]
No handler lookup and no save
Thái
PASS
DB read empty branch
TC-US-FRJOB-003
Skip invalid rollback type
type=UNKNOWN_TYPE
No handler lookup and no save
Thái
PASS
Invalid enum branch
TC-US-FRJOB-004
Skip when valid type has no handler
type=ORG_CREATION,handler=null
No save
Thái
PASS
Missing handler branch
TC-US-FRJOB-005
Mark rollback success and persist status
type=UPLOAD_FILE,rollback success
status=true and save called
Thái
PASS
CheckDB update path
TC-US-FRJOB-006
Increase retryCount when rollback fails
type=ORG_CREATION,rollback throws 
exception
retryCount incremented and save called
Thái
PASS
Rollback compensation path
JwtUtilsTest


## Page 2

TC-US-JWT-003
Generate non-empty unique helper tokens
refresh,verify,reset,invite methods
All tokens non-empty and refresh tokens unique
Thái
PASS
Utility token generation

AuthServiceImplTest
TC-US-AUTH-001
Success login with valid local credentials
username,password (LOCAL)
LoginResponse with JWT and Cookie set
Thái
PASS
Happy path login
TC-US-AUTH-002
Reject login with non-existent username
username=unknown_user
Throw AppException LOGIN_FAIL
Thái
PASS
User not found branch
TC-US-AUTH-003
Reject login with incorrect password
valid username, wrong password
Throw AppException LOGIN_FAIL (BadCredentials)
Thái
PASS
Security failure branch
TC-US-AUTH-004
Reject login when email not verified
valid credentials, isEmailVerified=false
Throw AppException EMAIL_NOT_VERIFIED
Thái
PASS
Account status check
TC-US-AUTH-005
Reject login when account is inactive
valid credentials, isActive=false
Throw AppException ACCOUNT_NOT_ACTIVE
Thái
PASS
Account status check
TC-US-AUTH-006
Refresh token success and rotate token
valid refresh token in cookie
New JWT and new refresh token
Thái
PASS
Token rotation path
TC-US-AUTH-007
Reject refresh token if missing in cookie
cookie=null
Throw AppException UNAUTHENTICATED
Thái
PASS
Missing token branch
TC-US-AUTH-008
Reject refresh token if not found in Redis
token=expired_or_fake
Throw AppException UNAUTHENTICATED
Thái
PASS
Redis miss branch
TC-US-AUTH-009
Logout clears token from Redis and Cookie
valid refresh token in request
Token deleted from Redis and Cookie expired
Thái
PASS
Clean logout path
TC-US-AUTH-010
Register candidate success (LOCAL)
valid username, email, password
User created, candidate created, verify email sent
Thái
PASS
Registration happy path
TC-US-AUTH-011
Reject register candidate if username exists
existing username
Throw AppException USERNAME_EXISTS
Thái
PASS
Conflict branch
TC-US-AUTH-012
Register Org Admin success with Rollback
valid org admin and organization data
User created, Org created via API, OrgMember linked
Thái
PASS
Complex flow coverage
TC-US-AUTH-013
Rollback Org creation if User creation fails
valid data, but user save throws error
FailedRollback record created for Org deletion
Thái
PASS
Compensation logic
TC-US-AUTH-014
Verify email success with valid token
valid verify token
isEmailVerified updated to true
Thái
PASS
Verification path
TC-US-AUTH-015
Reject verify email with invalid token type
token=RESET_PASSWORD_TYPE
Throw AppException UNAUTHENTICATED
Thái
PASS
Type safety branch
TC-US-AUTH-016
Request reset password success
valid email/username
Reset token saved and email sent
Thái
PASS
Forgot password path
TC-US-AUTH-017
Reject reset password for OAuth2 account
user with GOOGLE provider only
Throw AppException REGISTER_THIRD_PARTY
Thái
PASS
Provider check branch
TC-US-AUTH-018
Reset password with token success
valid reset token, new password
Password encoded and saved
Thái
PASS
Reset execution path
TC-US-AUTH-019
Register candidate with existing OAuth2 email
email exists (GOOGLE), LOCAL added
AccessMethod updated to "GOOGLE,LOCAL", user updated
Thái
PASS
Account merging branch
TC-US-AUTH-020
Check account status - combined checks
unverified, inactive, blocked
Correct AppExceptions thrown in sequence
Thái
PASS
Status validator coverage

UserServiceImplTest (Additional)
TC-US-USER-008
Update user profile success
valid userId, full name, avatar
Record updated in DB
Thái
PASS
Profile update path
TC-US-USER-009
Reject email update to already taken email
userId=1, newEmail=user2@test.com
Throw AppException EMAIL_EXISTS
Thái
PASS
Constraint check branch
TC-US-USER-010
Change password success
valid userId, oldPass, newPass
Encoded password updated
Thái
PASS
Security path
TC-US-USER-011
Reject change password if old password wrong
valid userId, wrong oldPass
Throw AppException PASSWORD_NOT_MATCH
Thái
PASS
Security path
TC-US-USER-012
Search users with complex filters
role, name, status, orgId
Filtered list of DTOs
Thái
PASS
Query coverage
TC-US-USER-013
Handle large user list pagination
page=0, size=100
Paginated list of DTOs
Thái
PASS
Performance/Limits branch
TC-US-USER-014
Batch update user status
list of userIds, status=false
All users updated to inactive
Thái
PASS
Bulk operation path
TC-US-USER-015
Delete user (Soft delete)
valid userId
isActive=false and deletedAt set
Thái
PASS
Cleanup path
TC-US-USER-016
Reject soft delete if user is Org Admin
userId=org_admin_id
Throw AppException CANNOT_DELETE_ORG_ADMIN
Thái
PASS
Business rule branch
TC-US-USER-017
Get user by ID - not found branch
userId=9999
Throw AppException USER_NOT_FOUND
Thái
PASS
Null check branch
TC-US-USER-018
Assign roles to user
userId, roleIds=[1,2,3]
RoleUser records created
Thái
PASS
Authorization path
TC-US-USER-019
Remove roles from user
userId, roleIds=[1]
RoleUser records deleted
Thái
PASS
Authorization path
TC-US-USER-020
Fetch system admins list
N/A
Return all users with role SYSTEM_ADMIN
Thái
PASS
Role query branch
TC-US-USER-021
Validate password strength logic
weak vs strong passwords
Expected validation result
Thái
PASS
Domain logic coverage
TC-US-USER-022
Validate email format logic
invalid strings
Expected validation result
Thái
PASS
Domain logic coverage

JwtUtilsTest (Security focus)
TC-US-JWT-004
Token validation - success
valid signed token
Return true and JwtUser object
Thái
PASS
Validation happy path
TC-US-JWT-005
Token validation - expired token
token with past expiry
Throw ExpiredJwtException/AppException
Thái
PASS
Security - expiry branch
TC-US-JWT-006
Token validation - invalid signature
token tampered or wrong secret
Throw SignatureException/AppException
Thái
PASS
Security - integrity branch
TC-US-JWT-007
Token validation - malformed token
random string
Throw MalformedJwtException/AppException
Thái
PASS
Security - format branch
TC-US-JWT-008
Extract claims from token
valid token
Correct username, roles, orgId extracted
Thái
PASS
Claim parsing coverage
TC-US-JWT-009
Check permission in token
valid token, required permission=JOB_POST
Return true
Thái
PASS
RBAC coverage
TC-US-JWT-010
Check permission in token - missing permission
valid token, required permission=ADMIN_ONLY
Return false
Thái
PASS
RBAC coverage
TC-US-JWT-011
Token generation with large claims
100+ roles/permissions
Token generated successfully (size check)
Thái
PASS
Limit testing
TC-US-JWT-012
Generate internal token for microservices
internal secret
Token valid for inter-service communication
Thái
PASS
Service auth path
TC-US-JWT-013
Validate internal token
internal token, internal secret
Return true
Thái
PASS
Service auth path

OrgMember/Invitation (Edge cases)
TC-US-OM-007
Accept invitation success
valid token
Role assigned and invitation marked ACCEPTED
Thái
PASS
Invitation lifecycle
TC-US-OM-008
Reject invitation if token expired
expired token
Throw AppException INVITATION_EXPIRED
Thái
PASS
Invitation lifecycle
TC-US-OM-009
Reject invitation if already accepted
accepted token
Throw AppException INVITATION_ALREADY_USED
Thái
PASS
Invitation lifecycle
TC-US-OM-010
Cancel invitation by Org Admin
invitationId, requester=ORG_ADMIN
Invitation marked CANCELLED
Thái
PASS
Invitation management

Role/Menu (Structure)
TC-US-RM-001
Get menus for role
roleId=1
Tree structure of menus/sub-menus
Thái
PASS
Menu navigation logic
TC-US-RM-002
Update role permissions
roleId, newPermissions
Mapping updated in DB
Thái
PASS
Permission management
TC-US-RM-003
Create new system role
valid data
Role saved with unique code
Thái
PASS
Metadata management
TC-US-RM-004
Delete unused role
roleId
Role deleted successfully
Thái
PASS
Metadata management
TC-US-RM-005
Reject role deletion if users assigned
roleId (active)
Throw AppException ROLE_IN_USE
Thái
PASS
Integrity branch

Validation/Common
TC-US-VAL-001
Validate input DTO fields
Constraint violations (empty, too long)
Set of ConstraintViolation exceptions
Thái
PASS
Validation coverage
TC-US-VAL-002
Localization message retrieval
ErrorCode, Locale=VI/EN
Correct localized string
Thái
PASS
i18n coverage
TC-US-VAL-003
ObjectMapper utility test
JSON string <-> Object
Correct serialization/deserialization
Thái
PASS
Utility coverage
TC-US-VAL-004
Redis lock/sync test
concurrent access
Consistent state maintained
Thái
PASS
Concurrency branch
TC-US-VAL-005
Kafka message serialization
NotificationDto -> JSON
Valid message for Kafka producer
Thái
PASS
Messaging coverage



