from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import re
from decimal import Decimal


# ============================================================
# APP CONFIGURATION
# ============================================================

app = Flask(__name__)
CORS(app)


DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "$Divya@1010",
    "database": "recruitment_tracker",
}


# ============================================================
# CONSTANTS
# ============================================================

DEPARTMENTS = [
    "Engineering",
    "Sales",
    "HR",
    "Marketing",
    "Finance",
    "Operations",
]

JOB_TYPES = [
    "Full-time",
    "Part-time",
    "Contract",
    "Internship",
]

JOB_STATUSES = [
    "Open",
    "Closed",
    "On Hold",
]

APPLICANT_STATUSES = [
    "Applied",
    "Screening",
    "Interview",
    "Offered",
    "Hired",
    "Rejected",
]


# ============================================================
# DATABASE
# ============================================================

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)


# ============================================================
# HELPERS
# ============================================================

def serialize_value(value):
    """Convert MySQL values into JSON-compatible values."""

    if isinstance(value, Decimal):
        return float(value)

    if hasattr(value, "isoformat"):
        return value.isoformat()

    return value


def row_to_dict(cursor, row):
    """Convert a database row into a dictionary."""

    columns = [column[0] for column in cursor.description]

    return {
        column: serialize_value(value)
        for column, value in zip(columns, row)
    }


def validate_job(data):
    """Validate job creation data."""

    required_fields = [
        "title",
        "department",
        "location",
        "type",
        "posted_on",
    ]

    for field in required_fields:
        if not data.get(field):
            return f"{field} is required"

    if len(data["title"].strip()) < 3:
        return "Title must be at least 3 characters"

    if data["department"] not in DEPARTMENTS:
        return "Invalid department"

    if data["type"] not in JOB_TYPES:
        return "Invalid job type"

    return None


def validate_applicant(data):
    """Validate applicant creation data."""

    required_fields = [
        "job_id",
        "full_name",
        "email",
        "phone",
        "experience_yrs",
        "applied_on",
    ]

    for field in required_fields:
        if data.get(field) is None:
            return f"{field} is required"

    email_pattern = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"

    if not re.match(email_pattern, str(data["email"])):
        return "Invalid email format"

    phone_pattern = r"^[0-9]{10}$"

    if not re.match(phone_pattern, str(data["phone"])):
        return "Phone must contain exactly 10 digits"

    try:
        experience = float(data["experience_yrs"])
    except (TypeError, ValueError):
        return "experience_yrs must be a number"

    if experience < 0:
        return "experience_yrs must be greater than or equal to 0"

    if len(str(data["full_name"]).strip()) < 2:
        return "Full name is required"

    return None


# ============================================================
# BASIC ENDPOINTS
# ============================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "Recruitment Tracker API is running"
    }), 200


@app.route("/api/test-db", methods=["GET"])
def test_db():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT 1")

        result = cursor.fetchone()

        return jsonify({
            "message": "Database connection successful",
            "result": result[0],
        }), 200

    except mysql.connector.Error:
        return jsonify({
            "error": "Database connection failed"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# JOBS
# ============================================================

@app.route("/api/jobs", methods=["GET"])
def get_jobs():
    connection = None
    cursor = None

    try:
        department = request.args.get("department")
        status = request.args.get("status")
        job_type = request.args.get("type")
        search = request.args.get("search")

        query = """
            SELECT
                j.id,
                j.title,
                j.department,
                j.location,
                j.type,
                j.status,
                j.description,
                j.posted_on,
                j.created_at,
                COUNT(a.id) AS applicant_count
            FROM jobs j
            LEFT JOIN applicants a
                ON j.id = a.job_id
        """

        conditions = []
        params = []

        if department:
            if department not in DEPARTMENTS:
                return jsonify({
                    "error": "Invalid department"
                }), 400

            conditions.append("j.department = %s")
            params.append(department)

        if status:
            if status not in JOB_STATUSES:
                return jsonify({
                    "error": "Invalid job status"
                }), 400

            conditions.append("j.status = %s")
            params.append(status)

        if job_type:
            if job_type not in JOB_TYPES:
                return jsonify({
                    "error": "Invalid job type"
                }), 400

            conditions.append("j.type = %s")
            params.append(job_type)

        if search:
            conditions.append(
                "(j.title LIKE %s OR j.location LIKE %s)"
            )

            search_value = f"%{search}%"

            params.append(search_value)
            params.append(search_value)

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += """
            GROUP BY
                j.id,
                j.title,
                j.department,
                j.location,
                j.type,
                j.status,
                j.description,
                j.posted_on,
                j.created_at
            ORDER BY j.id DESC
        """

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(query, tuple(params))

        rows = cursor.fetchall()

        jobs = [
            row_to_dict(cursor, row)
            for row in rows
        ]

        return jsonify(jobs), 200

    except mysql.connector.Error:
        return jsonify({
            "error": "Failed to fetch jobs"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


@app.route("/api/jobs/<int:job_id>", methods=["GET"])
def get_job(job_id):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                id,
                title,
                department,
                location,
                type,
                status,
                description,
                posted_on,
                created_at
            FROM jobs
            WHERE id = %s
            """,
            (job_id,)
        )

        row = cursor.fetchone()

        if not row:
            return jsonify({
                "error": "Job not found"
            }), 404

        job = row_to_dict(cursor, row)

        cursor.execute(
            """
            SELECT
                status,
                COUNT(*) AS count
            FROM applicants
            WHERE job_id = %s
            GROUP BY status
            """,
            (job_id,)
        )

        status_rows = cursor.fetchall()

        applicants_by_status = {
            status: 0
            for status in APPLICANT_STATUSES
        }

        for status, count in status_rows:
            applicants_by_status[status] = count

        job["applicant_count"] = sum(
            applicants_by_status.values()
        )

        job["applicants_by_status"] = (
            applicants_by_status
        )

        return jsonify(job), 200

    except mysql.connector.Error:
        return jsonify({
            "error": "Failed to fetch job"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


@app.route("/api/jobs", methods=["POST"])
def create_job():
    connection = None
    cursor = None

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Request body is required"
            }), 400

        validation_error = validate_job(data)

        if validation_error:
            return jsonify({
                "error": validation_error
            }), 400

        status = data.get("status", "Open")

        if status not in JOB_STATUSES:
            return jsonify({
                "error": "Invalid job status"
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
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
            """,
            (
                data["title"].strip(),
                data["department"],
                data["location"].strip(),
                data["type"],
                status,
                data.get("description"),
                data["posted_on"],
            )
        )

        connection.commit()

        job_id = cursor.lastrowid

        return jsonify({
            "message": "Job created successfully",
            "id": job_id,
        }), 201

    except mysql.connector.Error:
        if connection:
            connection.rollback()

        return jsonify({
            "error": "Failed to create job"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


@app.route("/api/jobs/<int:job_id>", methods=["PUT"])
def update_job(job_id):
    connection = None
    cursor = None

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Request body is required"
            }), 400

        status = data.get("status")

        if status not in JOB_STATUSES:
            return jsonify({
                "error": "Invalid job status"
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM jobs
            WHERE id = %s
            """,
            (job_id,)
        )

        if not cursor.fetchone():
            return jsonify({
                "error": "Job not found"
            }), 404

        cursor.execute(
            """
            UPDATE jobs
            SET status = %s
            WHERE id = %s
            """,
            (
                status,
                job_id,
            )
        )

        connection.commit()

        return jsonify({
            "message": "Job status updated successfully"
        }), 200

    except mysql.connector.Error:
        if connection:
            connection.rollback()

        return jsonify({
            "error": "Failed to update job"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


@app.route("/api/jobs/<int:job_id>", methods=["DELETE"])
def delete_job(job_id):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM jobs
            WHERE id = %s
            """,
            (job_id,)
        )

        if not cursor.fetchone():
            return jsonify({
                "error": "Job not found"
            }), 404

        cursor.execute(
            """
            DELETE FROM jobs
            WHERE id = %s
            """,
            (job_id,)
        )

        connection.commit()

        return jsonify({
            "message": (
                "Job and its applicants "
                "deleted successfully"
            )
        }), 200

    except mysql.connector.Error:
        if connection:
            connection.rollback()

        return jsonify({
            "error": "Failed to delete job"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# APPLICANTS
# ============================================================

@app.route("/api/applicants", methods=["GET"])
def get_applicants():
    connection = None
    cursor = None

    try:
        job_id = request.args.get("job_id")
        status = request.args.get("status")
        department = request.args.get("department")
        job_status = request.args.get("job_status")
        job_type = request.args.get("type")
        search = request.args.get("search")

        query = """
            SELECT
                a.id,
                a.job_id,
                j.title AS job_title,
                a.full_name,
                a.email,
                a.phone,
                a.experience_yrs,
                a.status,
                a.resume_url,
                a.applied_on,
                a.notes,
                a.created_at
            FROM applicants a
            INNER JOIN jobs j
                ON a.job_id = j.id
        """

        conditions = []
        params = []

        if job_id:
            try:
                job_id = int(job_id)
            except ValueError:
                return jsonify({
                    "error": "job_id must be a number"
                }), 400

            conditions.append("a.job_id = %s")
            params.append(job_id)

        if status:
            if status not in APPLICANT_STATUSES:
                return jsonify({
                    "error": "Invalid applicant status"
                }), 400

            conditions.append("a.status = %s")
            params.append(status)

        if department:
            if department not in DEPARTMENTS:
                return jsonify({
                    "error": "Invalid department"
                }), 400

            conditions.append("j.department = %s")
            params.append(department)

        if job_status:
            if job_status not in JOB_STATUSES:
                return jsonify({
                    "error": "Invalid job status"
                }), 400

            conditions.append("j.status = %s")
            params.append(job_status)

        if job_type:
            if job_type not in JOB_TYPES:
                return jsonify({
                    "error": "Invalid job type"
                }), 400

            conditions.append("j.type = %s")
            params.append(job_type)

        if search:
            conditions.append(
                "(a.full_name LIKE %s OR a.email LIKE %s)"
            )

            search_value = f"%{search}%"

            params.append(search_value)
            params.append(search_value)

        if conditions:
            query += " WHERE " + " AND ".join(conditions)

        query += """
            ORDER BY a.id DESC
        """

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(query, tuple(params))

        rows = cursor.fetchall()

        applicants = [
            row_to_dict(cursor, row)
            for row in rows
        ]

        return jsonify(applicants), 200

    except mysql.connector.Error:
        return jsonify({
            "error": "Failed to fetch applicants"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


@app.route("/api/applicants/<int:applicant_id>", methods=["GET"])
def get_applicant(applicant_id):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT
                a.id,
                a.job_id,
                j.title AS job_title,
                a.full_name,
                a.email,
                a.phone,
                a.experience_yrs,
                a.status,
                a.resume_url,
                a.applied_on,
                a.notes,
                a.created_at
            FROM applicants a
            INNER JOIN jobs j
                ON a.job_id = j.id
            WHERE a.id = %s
            """,
            (applicant_id,)
        )

        row = cursor.fetchone()

        if not row:
            return jsonify({
                "error": "Applicant not found"
            }), 404

        applicant = row_to_dict(
            cursor,
            row
        )

        return jsonify(applicant), 200

    except mysql.connector.Error:
        return jsonify({
            "error": "Failed to fetch applicant"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


@app.route("/api/applicants", methods=["POST"])
def create_applicant():
    connection = None
    cursor = None

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Request body is required"
            }), 400

        validation_error = validate_applicant(data)

        if validation_error:
            return jsonify({
                "error": validation_error
            }), 400

        status = data.get(
            "status",
            "Applied"
        )

        if status not in APPLICANT_STATUSES:
            return jsonify({
                "error": "Invalid applicant status"
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM jobs
            WHERE id = %s
            """,
            (data["job_id"],)
        )

        if not cursor.fetchone():
            return jsonify({
                "error": "Job not found"
            }), 404

        cursor.execute(
            """
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
            """,
            (
                data["job_id"],
                data["full_name"].strip(),
                data["email"].strip(),
                data["phone"],
                float(data["experience_yrs"]),
                status,
                data.get("resume_url"),
                data["applied_on"],
                data.get("notes"),
            )
        )

        connection.commit()

        applicant_id = cursor.lastrowid

        return jsonify({
            "message": "Applicant created successfully",
            "id": applicant_id,
        }), 201

    except mysql.connector.Error:
        if connection:
            connection.rollback()

        return jsonify({
            "error": "Failed to create applicant"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


@app.route(
    "/api/applicants/<int:applicant_id>/status",
    methods=["PUT"]
)
def update_applicant_status(applicant_id):
    connection = None
    cursor = None

    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "error": "Request body is required"
            }), 400

        status = data.get("status")

        if status not in APPLICANT_STATUSES:
            return jsonify({
                "error": "Invalid applicant status"
            }), 400

        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM applicants
            WHERE id = %s
            """,
            (applicant_id,)
        )

        if not cursor.fetchone():
            return jsonify({
                "error": "Applicant not found"
            }), 404

        cursor.execute(
            """
            UPDATE applicants
            SET status = %s
            WHERE id = %s
            """,
            (
                status,
                applicant_id,
            )
        )

        connection.commit()

        return jsonify({
            "message": (
                "Applicant status "
                "updated successfully"
            )
        }), 200

    except mysql.connector.Error:
        if connection:
            connection.rollback()

        return jsonify({
            "error": "Failed to update applicant status"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


@app.route(
    "/api/applicants/<int:applicant_id>",
    methods=["DELETE"]
)
def delete_applicant(applicant_id):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            """
            SELECT id
            FROM applicants
            WHERE id = %s
            """,
            (applicant_id,)
        )

        if not cursor.fetchone():
            return jsonify({
                "error": "Applicant not found"
            }), 404

        cursor.execute(
            """
            DELETE FROM applicants
            WHERE id = %s
            """,
            (applicant_id,)
        )

        connection.commit()

        return jsonify({
            "message": "Applicant deleted successfully"
        }), 200

    except mysql.connector.Error:
        if connection:
            connection.rollback()

        return jsonify({
            "error": "Failed to delete applicant"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# STATS
# ============================================================

@app.route("/api/stats", methods=["GET"])
def get_stats():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT COUNT(*) FROM jobs"
        )

        total_jobs = cursor.fetchone()[0]

        cursor.execute(
            "SELECT COUNT(*) FROM applicants"
        )

        total_applicants = cursor.fetchone()[0]

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM jobs
            WHERE status = 'Open'
            """
        )

        open_jobs = cursor.fetchone()[0]

        cursor.execute(
            """
            SELECT COUNT(*)
            FROM applicants
            WHERE status = 'Hired'
            """
        )

        hired = cursor.fetchone()[0]

        cursor.execute(
            """
            SELECT
                status,
                COUNT(*) AS count
            FROM applicants
            GROUP BY status
            """
        )

        status_rows = cursor.fetchall()

        by_status = {
            status: 0
            for status in APPLICANT_STATUSES
        }

        for status, count in status_rows:
            by_status[status] = count

        return jsonify({
            "total_jobs": total_jobs,
            "total_applicants": total_applicants,
            "open_jobs": open_jobs,
            "hired": hired,
            "by_status": by_status,
        }), 200

    except mysql.connector.Error:
        return jsonify({
            "error": "Failed to fetch statistics"
        }), 500

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()


# ============================================================
# ERROR HANDLERS
# ============================================================

@app.errorhandler(404)
def handle_404(error):
    return jsonify({
        "error": "Route not found"
    }), 404


@app.errorhandler(405)
def handle_405(error):
    return jsonify({
        "error": "Method not allowed"
    }), 405


@app.errorhandler(500)
def handle_500(error):
    return jsonify({
        "error": "Internal server error"
    }), 500


# ============================================================
# RUN APPLICATION
# ============================================================

if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True,
    )