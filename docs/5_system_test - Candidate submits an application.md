## Page 1

Project name:
HỆ THỐNG QUẢN LÝ HỒ SƠ ỨNG VIÊN VÀ TUYỂN DỤNG DÀNH CHO DOANH NGHIỆP
Function:
Candidate submits an application
Version
1.0
Test environment
Microsoft Edge
Pass
Fail
N/A
Number of test cases
9
11
6
26
Conclusion
ID Test case
Objective
Steps
Input data
Expected result
Actual result
Tester
Date
Result
Note
1. UI & Navigation
TC-CAN-01
Verify Job List display
1. Access the "Jobs" page from the main navigation.                        2. 
Observe the job card list.
N/A
UI matches prototype: Job cards show Title, Company, 
Salary, and Location clearly with no overlapping text.
UI matches prototype: Job cards show Title, Company, Salary, and 
Location clearly with no overlapping text.
Thai
31/03/2026 Pass
TC-CAN-02
Tab order navigation
1. Open the "Apply Now" modal.
2. Place cursor in "Full Name".
3. Press 'Tab' key repeatedly until reaching "Submit".
N/A
Focus moves logically: Full Name -> Email -> Phone -
> Portfolio -> CV Upload -> Cancel -> Submit.
Focus moves logically: Full Name -> Email -> Phone -> Portfolio -> CV 
Upload -> Cancel -> Submit.
Thai
31/03/2026 Pass
TC-CAN-03
Responsive Design (Zoom)
1. Open the Job Details page.
2. Press 'Ctrl +' to 200% and 'Ctrl -' to 50%.
Zoom: 50% - 200%
Layout adjusts responsively; buttons remain clickable 
and text remains readable without breaking the UI.
Layout adjusts responsively; buttons remain clickable and text remains 
readable without breaking the UI.
Thai
31/03/2026 Pass
2. Search & Filter
TC-CAN-04
Search by valid keyword
1. Go to the Job List page.
2. Enter a keyword in the search bar.
3. Click the Search icon or press Enter.
Keyword: "Java Developer"
List updates to display only jobs containing "Java 
Developer" in the title or description.
List updates to display only jobs containing "Java Developer" in the title or 
description.
Thai
31/03/2026 Pass
TC-CAN-05
Search with no results
1. Go to the Job List page.
2. Enter a random/nonsense string.
3. Press Enter.
Keyword: "xyz123abc!!!"
System displays: "No jobs found matching your search. 
Please try another keyword."
System displays: "No jobs found matching your search. Please try another 
keyword."
Thai
31/03/2026 Pass
TC-CAN-06
Filter by Job Level
1. In the sidebar, find the "Level" category.
2. Check the "Intern" checkbox.
3. Observe the list.
Checkbox: "Intern"
List filters instantly to show only positions tagged with 
the "Intern" level.
List filters instantly to show only positions tagged with the "Intern" level.
Thai
31/03/2026 Pass
3. Job Details
TC-CAN-07
View Job Details
1. On the Job List, click on a specific job title or card.
2. Wait for page to load.
N/A
Successfully redirected to the details page showing Full 
JD, Requirements, Benefits, and Company info.
Successfully redirected to the details page showing Full JD, Requirements, 
Benefits, and Company info.
Thai
31/03/2026 Pass
TC-CAN-08
"Apply Now" button state
1. Open a Job Detail page for an active post.
2. Verify visibility and state of the "Apply Now" button.
N/A
"Apply Now" button is prominently displayed, enabled, 
and shows a hover effect.
"Apply Now" button is prominently displayed, enabled, and shows a hover 
effect.
Thai
31/03/2026 Pass
4. Application Form 
(Validation)
Thai
31/03/2026
TC-CAN-09
Submit with all valid data
1. Click "Apply Now".
2. Fill all mandatory fields.
3. Upload a 1MB PDF CV.
4. Click "Submit".
Name: "John Doe"Email: "john@test.com"Phone: "0901234567"File: 
CV.pdf
Modal closes. Toast message appears: "Application 
submitted successfully!".
Modal remain, error message "Job ad is required!".
Thai
31/03/2026 Fail
TC-CAN-10
Empty Full Name (Mandatory)
1. Click "Apply Now".
2. Leave "Full Name" blank.
3. Fill other fields.
4. Click "Submit".
Name: [Empty]
"Submit" is blocked. Error message "Full Name is 
required" appears below the field in red.
Modal remain, error message "Job ad is required!".
Thai
31/03/2026 Fail
TC-CAN-11
Invalid Email format
1. Open Apply Form.
2. Enter an email without '@' or domain.
3. Click "Submit".
Email: "https://www.google.com/search?q=johndoe.com"
Error message: "Please enter a valid email address (e.g. 
name@gmail.com)."
Modal remain, error message "Job ad is required!".
Thai
31/03/2026 Fail
TC-CAN-12
Phone number with letters
1. Open Apply Form.
2. Type letters into the Phone field.
3. Click "Submit".
Phone: "090-ABC-123"
System either prevents typing letters or shows: "Phone 
number must contain digits only."
Modal remain, error message "Job ad is required!".
Thai
31/03/2026 Fail
TC-CAN-13
Short Phone number
1. Open Apply Form.
2. Enter a 5-digit number in Phone field.
3. Click "Submit".
Phone: "12345"
Error message: "Phone number must be between 9 and 
11 digits."
Modal remain, error message "Job ad is required!".
Thai
31/03/2026 Fail
TC-CAN-14
Invalid Portfolio URL
1. Open Apply Form.
2. Enter plain text in Portfolio Link.
3. Click "Submit".
Portfolio: "my github"
Error message: "Please enter a valid URL starting with 
http:// or https://."
Modal remain, error message "Job ad is required!".
Thai
31/03/2026 Fail
5. CV Upload (File 
Handling)
TC-CAN-15
Missing CV upload
1. Fill all text fields in the form.
2. Click "Submit" without selecting a file.
CV: [No file]
Error message: "Please upload your CV to complete the 
application."
Other fields neutrualized
Thai
31/03/2026 Fail
TC-CAN-16
Unsupported file format
1. Click "Upload CV".
2. Select an image file (.png).
3. Check system reaction.
File: "photo.png"
System displays error: "Invalid file type. Only PDF, 
DOC, and DOCX are accepted."
Folder system only present pdf files and folder
Thai
31/03/2026 NA
TC-CAN-17
File size exceeds limit
1. Click "Upload CV".
2. Select a file larger than 5MB.
3. Observe UI.
File size: 12MB
Error message: "File is too large. Maximum allowed 
size is 5MB."
No "File too large" error message
Thai
31/03/2026 Fail
TC-CAN-18
Empty file upload
1. Create a 0KB PDF file.
2. Upload it to the form.
3. Click "Submit".
File: "empty.pdf"
Error message: "The file appears to be empty or 
corrupted. Please try again."
No Invalid file message
Thai
31/03/2026 Fail
6. Logic & Database
TC-CAN-19
Duplicate Application
1. Use an email that already applied for this job.
2. Fill the form and click "Submit".
Email: "old_user@test.com"
System blocks submission: "You have already applied 
for this position."
Cannot testes due to test case 09 fail
Thai
31/03/2026 NA
TC-CAN-20
Data Trimming
1. Enter name with spaces at start/end.
2. Submit successfully.
3. Check the "Candidate" table in Database.
Name: "  Alice Lee  "
The record in the database displays "Alice Lee" 
(leading/trailing spaces are removed).
Cannot testes due to test case 09 fail
Thai
31/03/2026 NA
TC-CAN-21
Database Integrity
1. Submit a valid application.
2. Query the DB for the new record.
N/A
DB record fields (Name, Email, Phone, CV_URL) 
match the user input 100%.
Cannot testes due to test case 09 fail
Thai
31/03/2026 NA
TC-CAN-22
Cancel Application
1. Fill half of the form.
2. Click the "Cancel" button or the 'X' icon.
N/A
Modal closes. No new record is created in the database.
Modal closes. No new record is created in the database.
Thai
31/03/2026 Pass
7. System Response
TC-CAN-23
Success Notification
1. Complete a valid submission.
2. Watch the top-right screen area.
N/A
A green "Success" toast message appears and 
disappears after 3-5 seconds.
Cannot testes due to test case 09 fail
Thai
31/03/2026 NA
TC-CAN-24
Automated Confirmation Email
1. Submit a valid application.
2. Log into the candidate's email inbox.
Email: [Your Email]
Candidate receives an email titled "Application 
Received: [Job Title]".
Cannot testes due to test case 09 fail
Thai
31/03/2026 NA
TC-CAN-25
Tooltip Visibility
1. Hover mouse over the "i" icon near the CV upload section.
N/A
A small tooltip appears saying: "Accepted: 
PDF/DOCX. Max 5MB."
No tooltip appear
Thai
31/03/2026 Fail
TC-CAN-26
Enter key to Submit
1. Focus on the last text field (Portfolio).
2. Press the 'Enter' key on keyboard.
N/A
Form triggers the submission process identical to 
clicking the "Submit" button.
Form did not trigger submission process
Thai
31/03/2026 Fail


