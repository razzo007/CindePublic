#!/usr/bin/env python3

import os
import smtplib
from email.mime.text import MIMEText
from email.utils import formatdate
from pathlib import Path


def required_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"Missing required environment variable: {name}")
    return value


def main() -> None:
    smtp_host = required_env("SMTP_HOST")
    smtp_port = int(required_env("SMTP_PORT"))
    smtp_username = required_env("SMTP_USERNAME")
    smtp_password = required_env("SMTP_PASSWORD")
    from_email = required_env("FROM_EMAIL")
    to_email = required_env("TO_EMAIL")
    subject = os.environ.get("EMAIL_SUBJECT", "CINDE Executive Brief Test")
    html_path = os.environ.get("EMAIL_HTML_PATH", "Cinde/email/test-send-rajdeep.html")

    html = Path(html_path).read_text(encoding="utf-8")
    message = MIMEText(html, "html", "utf-8")
    message["Subject"] = subject
    message["From"] = from_email
    message["To"] = to_email
    message["Date"] = formatdate(localtime=True)

    with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as server:
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(smtp_username, smtp_password)
        server.sendmail(from_email, [to_email], message.as_string())

    print(f"Sent HTML email to {to_email}")


if __name__ == "__main__":
    main()
