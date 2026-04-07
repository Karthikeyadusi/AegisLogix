# Use the official Python 3.10 slim image (keeps the container size small)
FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# The python-multipart/opencv dependencies
COPY requirements.txt .

# Install dependencies (no-cache reduces the image size)
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application files into the container
COPY . .

# Expose port (Render defaults to 10000, but we specify for local use too)
EXPOSE 8000

# Start Uvicorn with strictly 1 worker. This ensures that the memory footprint 
# stays relatively flat around ~350MB, making it safe for 512MB RAM free tiers.
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "10000", "--workers", "1"]