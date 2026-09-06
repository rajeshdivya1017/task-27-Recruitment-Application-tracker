import mysql.connector
from datetime import date, timedelta
import random


DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "$Divya@1010",
}


def get_connection(database=None):
    config = DB_CONFIG.copy()

    if database:
        config["database"] = database

    return mysql.connector.connect(**config)


def create_database():
    connection = get_connection()
    cursor = connection.cursor()

    cursor.execute(
        "CREATE DATABASE IF NOT EXISTS recruitment_tracker"
    )

    cursor.close()
    connection.close()


def create_tables():
    connection = get_connection("recruitment_tracker")
    cursor = connection.cursor()

    cursor.execute("DROP TABLE IF EXISTS applicants")
    cursor.execute("DROP TABLE IF EXISTS jobs")

    cursor.execute("""
        CREATE TABLE jobs (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            department ENUM(
                'Engineering',
                'Sales',
                'HR',
                'Marketing',
                'Finance',
                'Operations'
            ) NOT NULL,
            location VARCHAR(100) NOT NULL,
            type ENUM(
                'Full-time',
                'Part-time',
                'Contract',
                'Internship'
            ) NOT NULL,
            status ENUM(
                'Open',
                'Closed',
                'On Hold'
            ) DEFAULT 'Open',
            description TEXT,
            posted_on DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    cursor.execute("""
        CREATE TABLE applicants (
            id INT AUTO_INCREMENT PRIMARY KEY,
            job_id INT NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            experience_yrs DECIMAL(3,1) NOT NULL,
            status ENUM(
                'Applied',
                'Screening',
                'Interview',
                'Offered',
                'Hired',
                'Rejected'
            ) DEFAULT 'Applied',
            resume_url VARCHAR(255),
            applied_on DATE NOT NULL,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (job_id)
                REFERENCES jobs(id)
                ON DELETE CASCADE
        )
    """)

    connection.commit()

    cursor.close()
    connection.close()

    print("Tables created successfully.")


def seed_jobs():
    connection = get_connection("recruitment_tracker")
    cursor = connection.cursor()

    jobs = [
        (
            "Senior Python Developer",
            "Engineering",
            "Chennai",
            "Full-time",
            "Open",
            "Build scalable backend applications using Python and Flask.",
            date(2026, 8, 1),
        ),
        (
            "Frontend React Developer",
            "Engineering",
            "Bangalore",
            "Full-time",
            "Open",
            "Develop modern web applications using React and TypeScript.",
            date(2026, 7, 28),
        ),
        (
            "Backend Java Developer",
            "Engineering",
            "Hyderabad",
            "Full-time",
            "Open",
            "Develop enterprise backend services using Java and Spring Boot.",
            date(2026, 7, 25),
        ),
        (
            "DevOps Engineer",
            "Engineering",
            "Pune",
            "Full-time",
            "On Hold",
            "Manage CI/CD pipelines and cloud infrastructure.",
            date(2026, 7, 20),
        ),
        (
            "Sales Executive",
            "Sales",
            "Mumbai",
            "Full-time",
            "Open",
            "Manage customers and achieve monthly sales targets.",
            date(2026, 7, 18),
        ),
        (
            "Business Development Executive",
            "Sales",
            "Delhi",
            "Full-time",
            "Open",
            "Identify new business opportunities and maintain client relationships.",
            date(2026, 7, 15),
        ),
        (
            "HR Executive",
            "HR",
            "Chennai",
            "Full-time",
            "On Hold",
            "Support recruitment and employee engagement activities.",
            date(2026, 7, 10),
        ),
        (
            "Talent Acquisition Specialist",
            "HR",
            "Bangalore",
            "Contract",
            "Open",
            "Handle recruitment processes and candidate screening.",
            date(2026, 7, 5),
        ),
        (
            "Digital Marketing Specialist",
            "Marketing",
            "Hyderabad",
            "Full-time",
            "Open",
            "Plan and execute digital marketing campaigns.",
            date(2026, 6, 28),
        ),
        (
            "Content Marketing Executive",
            "Marketing",
            "Chennai",
            "Part-time",
            "Closed",
            "Create content strategies and marketing campaigns.",
            date(2026, 6, 20),
        ),
        (
            "Financial Analyst",
            "Finance",
            "Bangalore",
            "Full-time",
            "Open",
            "Analyze financial data and prepare business reports.",
            date(2026, 6, 15),
        ),
        (
            "Accountant",
            "Finance",
            "Mumbai",
            "Full-time",
            "Open",
            "Manage financial records and accounting operations.",
            date(2026, 6, 10),
        ),
        (
            "Operations Manager",
            "Operations",
            "Pune",
            "Full-time",
            "Open",
            "Manage daily operations and improve business efficiency.",
            date(2026, 6, 5),
        ),
        (
            "Operations Executive",
            "Operations",
            "Chennai",
            "Contract",
            "Closed",
            "Coordinate daily operational activities.",
            date(2026, 5, 28),
        ),
        (
            "Data Analyst Intern",
            "Finance",
            "Mumbai",
            "Internship",
            "Open",
            "Assist the analytics team with data preparation and reporting.",
            date(2026, 5, 20),
        ),
    ]

    query = """
        INSERT INTO jobs
        (
            title,
            department,
            location,
            type,
            status,
            description,
            posted_on
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """

    cursor.executemany(query, jobs)
    connection.commit()

    print(f"{len(jobs)} jobs inserted successfully.")

    cursor.close()
    connection.close()


def seed_applicants():
    connection = get_connection("recruitment_tracker")
    cursor = connection.cursor()

    cursor.execute("SELECT id FROM jobs ORDER BY id")
    job_rows = cursor.fetchall()

    job_ids = [row[0] for row in job_rows]

    first_names = [
        "Arun",
        "Priya",
        "Rahul",
        "Divya",
        "Karthik",
        "Sneha",
        "Vikram",
        "Ananya",
        "Rohit",
        "Meena",
        "Sanjay",
        "Pooja",
        "Naveen",
        "Keerthi",
        "Ajay",
        "Swetha",
        "Manoj",
        "Harini",
        "Aravind",
        "Deepa",
        "Vijay",
        "Nithya",
        "Suresh",
        "Kavya",
        "Dinesh",
    ]

    last_names = [
        "Kumar",
        "Sharma",
        "Reddy",
        "Patel",
        "Singh",
        "Iyer",
        "Rao",
        "Nair",
        "Das",
        "Menon",
    ]

    statuses = [
        "Applied",
        "Screening",
        "Interview",
        "Offered",
        "Hired",
        "Rejected",
    ]

    random.seed(27)

    applicants = []

    for index in range(70):
        first_name = first_names[index % len(first_names)]
        last_name = last_names[index % len(last_names)]

        full_name = f"{first_name} {last_name}"

        email = (
            f"{first_name.lower()}."
            f"{last_name.lower()}"
            f"{index + 1}@example.com"
        )

        phone = f"9{random.randint(100000000, 999999999)}"

        experience = round(
            random.uniform(0, 8),
            1
        )

        status = statuses[index % len(statuses)]

        job_id = job_ids[index % len(job_ids)]

        applied_on = (
            date(2026, 4, 1)
            + timedelta(days=random.randint(0, 140))
        )

        resume_url = (
            f"https://example.com/resumes/"
            f"candidate-{index + 1}"
        )

        notes = (
            "Candidate profile reviewed by the recruitment team."
        )

        applicants.append(
            (
                job_id,
                full_name,
                email,
                phone,
                experience,
                status,
                resume_url,
                applied_on,
                notes,
            )
        )

    query = """
        INSERT INTO applicants
        (
            job_id,
            full_name,
            email,
            phone,
            experience_yrs,
            status,
            resume_url,
            applied_on,
            notes
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """

    cursor.executemany(query, applicants)
    connection.commit()

    print(f"{len(applicants)} applicants inserted successfully.")

    cursor.close()
    connection.close()


def main():
    print("Starting Recruitment Tracker seed...")

    create_database()

    create_tables()

    seed_jobs()

    seed_applicants()

    print("Recruitment Tracker seed completed successfully.")


if __name__ == "__main__":
    main()