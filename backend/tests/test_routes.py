"""Tests for the API routes and endpoints."""

from io import BytesIO


def test_health_check(client):
    """Test the liveness probe."""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "version" in data


def test_readiness_check(client):
    """Test the readiness probe."""
    response = client.get("/ready")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ready"
    assert data["model_loaded"] is True


def test_analyze_valid_image(client, sample_image_bytes):
    """Test successful image analysis with a mocked engine."""
    file = BytesIO(sample_image_bytes)
    response = client.post(
        "/api/v1/analyze",
        files={"file": ("test.jpg", file, "image/jpeg")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["total_issues"] == 1
    assert data["details"][0]["class_name"] == "Dent"
    assert data["details"][0]["confidence"] == 0.95
    assert len(data["details"][0]["bbox"]) == 4
    assert "image_data" in data


def test_analyze_unsupported_type(client):
    """Test upload with an unsupported content type."""
    file = BytesIO(b"Hello world")
    response = client.post(
        "/api/v1/analyze",
        files={"file": ("test.txt", file, "text/plain")}
    )
    
    assert response.status_code == 400
    data = response.json()
    assert data["error"]["code"] == "invalid_content_type"


def test_analyze_empty_file(client):
    """Test upload of a 0-byte file."""
    file = BytesIO(b"")
    response = client.post(
        "/api/v1/analyze",
        files={"file": ("empty.jpg", file, "image/jpeg")}
    )
    
    assert response.status_code == 400
    data = response.json()
    assert data["error"]["code"] == "empty_file"


def test_analyze_corrupted_image(client):
    """Test upload of a corrupted/invalid image file."""
    # Not a real JPEG, but passed as one
    file = BytesIO(b"invalid image data")
    response = client.post(
        "/api/v1/analyze",
        files={"file": ("bad.jpg", file, "image/jpeg")}
    )
    
    assert response.status_code == 400
    data = response.json()
    assert data["error"]["code"] == "decode_failed"
