# 5_System Test

**Project name:** HỆ THỐNG QUẢN LÝ HỒ SƠ ỨNG VIÊN VÀ TUYỂN DỤNG DÀNH CHO DOANH NGHIỆP  

---

## Test Cases

| ID | Test case | Objective | Technique | Steps | Input data | Expected result | Actual result | Tester | Date | Result | Note |
|----|----------|----------|-----------|-------|------------|----------------|--------------|--------|------|--------|------|

---

## 1. UI & Navigation

| ID | Test case | Objective | Technique | Steps | Input data | Expected result |
|----|----------|----------|-----------|-------|------------|----------------|
| TC-CAN-01 | Verify Job List display | GUI | 1. Access "Jobs" page<br>2. Observe job list | N/A | UI matches prototype: Title, Company, Salary, Location rõ ràng |
| TC-CAN-02 | Tab order navigation | GUI | 1. Open "Apply Now"<br>2. Focus Full Name<br>3. Press Tab | N/A | Focus: Full Name → Email → Phone → Portfolio → CV Upload → Cancel → Submit |
| TC-CAN-03 | Responsive Design | GUI | Zoom 50% - 200% | Zoom: 50%-200% | Layout không vỡ, readable |

---

## 2. Search & Filter

| ID | Test case | Objective | Technique | Steps | Input data | Expected result |
|----|----------|----------|-----------|-------|------------|----------------|
| TC-CAN-04 | Search valid keyword | Functional | Search job | "Java Developer" | List hiển thị đúng job |
| TC-CAN-05 | Search no result | Negative | Search random | "xyz123abc!!!" | Hiển thị "No jobs found" |
| TC-CAN-06 | Filter Job Level | Functional | Tick "Intern" | Checkbox: Intern | List chỉ còn Intern |

---

## 3. Job Details

| ID | Test case | Objective | Technique | Steps | Input data | Expected result |
|----|----------|----------|-----------|-------|------------|----------------|
| TC-CAN-07 | View Job Details | Functional | Click job | N/A | Hiển thị JD đầy đủ |
| TC-CAN-08 | Apply Now button | GUI | Check button | N/A | Button visible + enabled |

---

## 4. Application Form (Validation)

| ID | Test case | Objective | Technique | Steps | Input data | Expected result |
|----|----------|----------|-----------|-------|------------|----------------|
| TC-CAN-09 | Submit valid | ECP | Fill + upload CV | Valid data | Success message |
| TC-CAN-10 | Empty Name | Null | Submit thiếu name | Empty | "Full Name is required" |
| TC-CAN-11 | Invalid Email | ECP | Email sai | "johndoe.com" | Error email |
| TC-CAN-12 | Phone có chữ | Negative | Nhập chữ | "090-ABC-123" | Chặn hoặc báo lỗi |
| TC-CAN-13 | Phone ngắn | BVA | 5 digits | "12345" | Error 9-11 digits |
| TC-CAN-14 | Invalid URL | ECP | Portfolio sai | "my github" | Error URL |

---

## 5. CV Upload (File Handling)

| ID | Test case | Objective | Technique | Steps | Input data | Expected result |
|----|----------|----------|-----------|-------|------------|----------------|
| TC-CAN-15 | Missing CV | Null | Submit không file | None | Error upload CV |
| TC-CAN-16 | Sai format | Negative | Upload png | photo.png | Error file type |
| TC-CAN-17 | File quá lớn | BVA | Upload 12MB | 12MB | Error max 5MB |
| TC-CAN-18 | File rỗng | BVA | Upload 0KB | empty.pdf | Error corrupted |

---

## 6. Logic & Database

| ID | Test case | Objective | Technique | Steps | Input data | Expected result |
|----|----------|----------|-----------|-------|------------|----------------|
| TC-CAN-19 | Duplicate apply | Logic | Apply lại | existing email | Block |
| TC-CAN-20 | Data trimming | DB | Name có space | "  Alice Lee  " | Trim thành "Alice Lee" |
| TC-CAN-21 | DB integrity | DB | Check DB | N/A | Data đúng 100% |
| TC-CAN-22 | Cancel form | Functional | Click cancel | N/A | Không tạo record |

---

## 7. System Response

| ID | Test case | Objective | Technique | Steps | Input data | Expected result |
|----|----------|----------|-----------|-------|------------|----------------|
| TC-CAN-23 | Success toast | GUI | Submit valid | N/A | Toast success |
| TC-CAN-24 | Email confirm | Functional | Check mail | Email | Nhận mail |
| TC-CAN-25 | Tooltip | GUI | Hover icon | N/A | Hiển thị tooltip |
| TC-CAN-26 | Enter submit | GUI | Press Enter | N/A | Submit form |