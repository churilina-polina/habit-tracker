import pytest

pytestmark = pytest.mark.asyncio


async def test_create_and_list_habit(auth_client):
    response = await auth_client.post(
        "/habits", json={"title": "Пить воду", "category": "health"}
    )
    assert response.status_code == 201
    habit = response.json()
    assert habit["title"] == "Пить воду"
    assert habit["completed_today"] is False

    response = await auth_client.get("/habits")
    assert response.status_code == 200
    assert len(response.json()) == 1


async def test_toggle_completes_and_uncompletes(auth_client):
    create = await auth_client.post("/habits", json={"title": "Читать"})
    habit_id = create.json()["id"]

    toggled_on = await auth_client.post(f"/habits/{habit_id}/toggle")
    assert toggled_on.json()["completed_today"] is True
    assert toggled_on.json()["current_streak"] == 1

    toggled_off = await auth_client.post(f"/habits/{habit_id}/toggle")
    assert toggled_off.json()["completed_today"] is False
    assert toggled_off.json()["current_streak"] == 0


async def test_stats_endpoint(auth_client):
    create = await auth_client.post("/habits", json={"title": "Спорт"})
    habit_id = create.json()["id"]
    await auth_client.post(f"/habits/{habit_id}/toggle")

    response = await auth_client.get(f"/habits/{habit_id}/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["current_streak"] == 1
    assert len(data["history"]) == 28


async def test_user_cannot_access_foreign_habit(client, auth_client):
    create = await auth_client.post("/habits", json={"title": "Секретная привычка"})
    habit_id = create.json()["id"]

    await client.post(
        "/auth/register",
        json={"email": "other@example.com", "name": "Other", "password": "StrongPass123"},
    )
    login = await client.post(
        "/auth/login", json={"email": "other@example.com", "password": "StrongPass123"}
    )
    other_token = login.json()["access_token"]
    client.headers["Authorization"] = f"Bearer {other_token}"

    response = await client.get(f"/habits/{habit_id}/stats")
    assert response.status_code == 404


async def test_unauthenticated_access_denied(client):
    response = await client.get("/habits")
    assert response.status_code == 401
