"""
In-memory data store for demo/development purposes.
Replace with a real database (PostgreSQL, SQLite, etc.) for production.
"""

from datetime import datetime, timezone
import uuid

# ─── In-memory stores ────────────────────────────────────────────────────────

users_db: dict[str, dict] = {}
inventory_db: dict[str, dict] = {}


# ─── User helpers ─────────────────────────────────────────────────────────────

def create_user(full_name: str, email: str, hashed_password: str) -> dict:
    """Create a new user record."""
    user_id = str(uuid.uuid4())
    user = {
        "id": user_id,
        "full_name": full_name,
        "email": email.lower(),
        "hashed_password": hashed_password,
        "created_at": datetime.now(timezone.utc),
    }
    users_db[user_id] = user
    return user


def get_user_by_email(email: str) -> dict | None:
    """Look up a user by email."""
    email_lower = email.lower()
    for user in users_db.values():
        if user["email"] == email_lower:
            return user
    return None


def get_user_by_id(user_id: str) -> dict | None:
    """Look up a user by ID."""
    return users_db.get(user_id)


# ─── Inventory helpers ────────────────────────────────────────────────────────

def create_inventory_item(user_id: str, **kwargs) -> dict:
    """Create a new inventory item owned by a user."""
    item_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    item = {
        "id": item_id,
        "user_id": user_id,
        "created_at": now,
        "updated_at": now,
        **kwargs,
    }
    inventory_db[item_id] = item
    return item


def get_inventory_items(user_id: str) -> list[dict]:
    """Return all inventory items belonging to a user."""
    return [
        item for item in inventory_db.values() if item["user_id"] == user_id
    ]


def get_inventory_item(item_id: str, user_id: str) -> dict | None:
    """Return a single inventory item if it belongs to the user."""
    item = inventory_db.get(item_id)
    if item and item["user_id"] == user_id:
        return item
    return None


def update_inventory_item(item_id: str, user_id: str, **kwargs) -> dict | None:
    """Update an inventory item. Returns None if not found."""
    item = get_inventory_item(item_id, user_id)
    if not item:
        return None
    for key, value in kwargs.items():
        if value is not None:
            item[key] = value
    item["updated_at"] = datetime.now(timezone.utc)
    return item


def delete_inventory_item(item_id: str, user_id: str) -> bool:
    """Delete an inventory item. Returns True if deleted."""
    item = get_inventory_item(item_id, user_id)
    if not item:
        return False
    del inventory_db[item_id]
    return True
