CREATE DATABASE recruitment_tracker;
   USE recruitment_tracker;

   CREATE TABLE jobs (
       id           INT AUTO_INCREMENT PRIMARY KEY,
       title        VARCHAR(150) NOT NULL,
       department   ENUM(
                      'Engineering',
                      'Sales',
                      'HR',
                      'Marketing',
                      'Finance',
                      'Operations'
                    ) NOT NULL,
       location     VARCHAR(100) NOT NULL,
       type         ENUM('Full-time','Part-time',
                         'Contract','Internship')
                    NOT NULL,
       status       ENUM('Open','Closed',
                         'On Hold')
                    DEFAULT 'Open',
       description  TEXT,
       posted_on    DATE NOT NULL,
       created_at   TIMESTAMP DEFAULT
                    CURRENT_TIMESTAMP
   );

   CREATE TABLE applicants (
       id            INT AUTO_INCREMENT PRIMARY KEY,
       job_id        INT NOT NULL,
       full_name     VARCHAR(100) NOT NULL,
       email         VARCHAR(100) NOT NULL,
       phone         VARCHAR(15) NOT NULL,
       experience_yrs DECIMAL(3,1) NOT NULL,
       status        ENUM(
                       'Applied',
                       'Screening',
                       'Interview',
                       'Offered',
                       'Hired',
                       'Rejected'
                     ) DEFAULT 'Applied',
       resume_url    VARCHAR(255),
       applied_on    DATE NOT NULL,
       notes         TEXT,
       created_at    TIMESTAMP DEFAULT
                     CURRENT_TIMESTAMP,
       FOREIGN KEY (job_id)
       REFERENCES jobs(id) ON DELETE CASCADE
   );
   
      USE recruitment_tracker;
      SHOW TABLES;
      
      SELECT COUNT(*) AS total_jobs
		FROM jobs;
        SELECT COUNT(*) AS total_applicants
		FROM applicants;