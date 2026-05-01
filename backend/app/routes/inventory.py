"""
Inventory CRUD routes — all protected by JWT auth.
"""

from fastapi import APIRouter, Depends, HTTPException, status

from app.schemas import (
    InventoryItemCreate,
    InventoryItemUpdate,
    InventoryItemResponse,
)
from app.database import (
    create_inventory_item,
    get_inventory_items,
    get_inventory_item,
    update_inventory_item,
    delete_inventory_item,
)
from app.auth import get_current_user

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("/", response_model=list[InventoryItemResponse])
def list_items(current_user: dict = Depends(get_current_user)):
    """Return all inventory items for the authenticated user."""
    return get_inventory_items(current_user["id"])


@router.post("/", response_model=InventoryItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(body: InventoryItemCreate, current_user: dict = Depends(get_current_user)):
    """Create a new inventory item."""
    item = create_inventory_item(
        user_id=current_user["id"],
        name=body.name,
        category=body.category,
        quantity=body.quantity,
        price=body.price,
        sku=body.sku,
        image_url=body.image_url,
    )
    return item


@router.get("/{item_id}", response_model=InventoryItemResponse)
def get_item(item_id: str, current_user: dict = Depends(get_current_user)):
    """Get a single inventory item by ID."""
    item = get_inventory_item(item_id, current_user["id"])
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return item


@router.patch("/{item_id}", response_model=InventoryItemResponse)
def update_item(
    item_id: str,
    body: InventoryItemUpdate,
    current_user: dict = Depends(get_current_user),
):
    """Update an inventory item (partial update)."""
    updated = update_inventory_item(
        item_id,
        current_user["id"],
        **body.model_dump(exclude_unset=True),
    )
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    return updated


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: str, current_user: dict = Depends(get_current_user)):
    """Delete an inventory item."""
    if not delete_inventory_item(item_id, current_user["id"]):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
