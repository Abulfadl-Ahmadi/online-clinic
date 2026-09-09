def normalize_phone_number(phone_number):
    """Normalize phone number to +989xxxxxxxxx format."""
    # Normalize to +989xxxxxxxxx format
    if phone_number.startswith("09"):
        phone_number = "+98" + phone_number[1:]
    elif phone_number.startswith("9"):
        phone_number = "+98" + phone_number
    return phone_number
