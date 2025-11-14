// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('demo');

// Create a new document in the collection.
db.getCollection('d').insertMany({
[
  {
    "Employee ID": 10001,
    "First Name": "Jane",
    "Last Name": "Doe",
    "Department": "Marketing",
    "Job Title": "Director",
    "Hire Date": "2018-05-15",
    "Annual Salary (USD)": 135750,
    "State/Region": "CA",
    "Gender": "Female",
    "Performance Score (1-5)": 4
  },
  {
    "Employee ID": 10002,
    "First Name": "Michael",
    "Last Name": "Smith",
    "Department": "IT",
    "Job Title": "Technician I",
    "Hire Date": "2023-11-01",
    "Annual Salary (USD)": 58900,
    "State/Region": "NY",
    "Gender": "Male",
    "Performance Score (1-5)": 3
  },
  {
    "Employee ID": 10003,
    "First Name": "Alex",
    "Last Name": "Johnson",
    "Department": "HR",
    "Job Title": "Manager",
    "Hire Date": "2016-02-29",
    "Annual Salary (USD)": 92400,
    "State/Region": "TX",
    "Gender": "Male",
    "Performance Score (1-5)": 5
  },
  {
    "Employee ID": 10004,
    "First Name": "Emily",
    "Last Name": "Brown",
    "Department": "Finance",
    "Job Title": "Analyst II",
    "Hire Date": "2021-08-20",
    "Annual Salary (USD)": 77120,
    "State/Region": "IL",
    "Gender": "Female",
    "Performance Score (1-5)": 3
  },
  {
    "Employee ID": 10005,
    "First Name": "David",
    "Last Name": "Lee",
    "Department": "Sales",
    "Job Title": "Sales Rep",
    "Hire Date": "2024-01-10",
    "Annual Salary (USD)": 65000,
    "State/Region": "WA",
    "Gender": "Other",
    "Performance Score (1-5)": 2
  },
  {
    "Employee ID": 10006,
    "First Name": "Sarah",
    "Last Name": "Chen",
    "Department": "Marketing",
    "Job Title": "Specialist",
    "Hire Date": "2019-07-07",
    "Annual Salary (USD)": 78540,
    "State/Region": "FL",
    "Gender": "Female",
    "Performance Score (1-5)": 4
  },
  {
    "Employee ID": 10007,
    "First Name": "Chris",
    "Last Name": "Wilson",
    "Department": "IT",
    "Job Title": "IT Support L3",
    "Hire Date": "2017-04-25",
    "Annual Salary (USD)": 89990,
    "State/Region": "MA",
    "Gender": "Male",
    "Performance Score (1-5)": 4
  },
  {
    "Employee ID": 10008,
    "First Name": "Jessica",
    "Last Name": "Davis",
    "Department": "Operations",
    "Job Title": "Coordinator",
    "Hire Date": "2022-09-12",
    "Annual Salary (USD)": 51200,
    "State/Region": "CA",
    "Gender": "Female",
    "Performance Score (1-5)": 3
  },
  {
    "Employee ID": 10009,
    "First Name": "Robert",
    "Last Name": "Garcia",
    "Department": "Sales",
    "Job Title": "VP of Sales",
    "Hire Date": "2015-01-01",
    "Annual Salary (USD)": 185000,
    "State/Region": "NV",
    "Gender": "Male",
    "Performance Score (1-5)": 5
  },
  {
    "Employee ID": 10010,
    "First Name": "Laura",
    "Last Name": "Martinez",
    "Department": "HR",
    "Job Title": "Recruiter",
    "Hire Date": "2020-10-30",
    "Annual Salary (USD)": 68310,
    "State/Region": "TX",
    "Gender": "Female",
    "Performance Score (1-5)": 3
  }
  // ... continue 190 more objects for a full 200-record set
]
});
