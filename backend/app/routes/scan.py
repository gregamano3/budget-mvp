"""
Receipt scanning / OCR route.
Accepts an uploaded image and returns structured receipt data.

Currently returns mock data — plug in a real OCR provider
(Google Cloud Vision, GPT-4o Vision, Tesseract, etc.) later.
"""

from fastapi import APIRouter, Depends, UploadFile, File

from app.schemas import ReceiptScanResponse, ReceiptItem
from app.auth import get_current_user

router = APIRouter(prefix="/scan", tags=["Receipt Scanner"])


@router.post("/receipt", response_model=ReceiptScanResponse)
async def scan_receipt(
    image: UploadFile = File(..., description="Receipt image (JPEG/PNG)"),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload a receipt image and receive structured extracted data.

    TODO: Replace mock response with actual OCR integration:
      - Google Cloud Vision API
      - OpenAI GPT-4o Vision
      - Tesseract (on-server)
    """
    # Read the file (would be sent to OCR provider)
    _contents = await image.read()
    file_size_kb = len(_contents) / 1024

    # ── Mock OCR response for development ──
    return ReceiptScanResponse(
        store_name="Staples Office Supply",
        date="2023-10-24",
        items=[
            ReceiptItem(name="Ergonomic Office Chair", quantity=1, sku="98221", price=249.00),
            ReceiptItem(name="Wireless Mouse M510", quantity=2, sku="44102", price=59.98),
            ReceiptItem(name="Premium Copy Paper (500ct)", quantity=5, sku="11094", price=44.95),
        ],
        total=353.93,
        raw_text=f"[Mock OCR] Processed {image.filename} ({file_size_kb:.1f} KB)",
    )
