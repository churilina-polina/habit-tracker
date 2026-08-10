import pytest

pytestmark = pytest.mark.asyncio


async def test_register(client):
    response = await client.post(
        "/auth/register",
        json={"email": "a@example.com", "name": "Anna", "password": "StrongPass123"},
    )
    assert response.status_code == 201
    assert response.json()["email"] == "a@example.com"


async def test_register_duplicate_email(client):
    payload = {"email": "a@example.com", "name": "Anna", "password": "StrongPass123"}
    await client.post("/auth/register", json=payload)
    response = await client.post("/auth/register", json=payload)
    assert response.status_code == 400


async def test_login_success(client):
    await client.post(
        "/auth/register",
        json={"email": "a@example.com", "name": "Anna", "password": "StrongPass123"},
    )
    response = await client.post(
        "/auth/login", json={"email": "a@example.com", "password": "StrongPass123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()


async def test_login_wrong_password(client):
    await client.post(
        "/auth/register",
        json={"email": "a@example.com", "name": "Anna", "password": "StrongPass123"},
    )
    response = await client.post(
        "/auth/login", json={"email": "a@example.com", "password": "wrong"}
    )
    assert response.status_code == 401


async def test_me_includes_created_at(auth_client):
    response = await auth_client.get("/auth/me")
    assert response.status_code == 200
    assert "created_at" in response.json()


async def test_update_me_changes_name(auth_client):
    response = await auth_client.patch("/auth/me", json={"name": "Новое Имя"})
    assert response.status_code == 200
    assert response.json()["name"] == "Новое Имя"

    me = await auth_client.get("/auth/me")
    assert me.json()["name"] == "Новое Имя"
