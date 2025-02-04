# Use the slim variant of Python
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies (e.g., required for compiling packages)
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy dependencies file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY . .

# Expose port
EXPOSE 8000

# Use Gunicorn to serve the app (or use Django’s runserver for development)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "core.asgi:application"]
