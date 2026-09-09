from rest_framework import serializers

from finance.models import TransactionModel, TransactionStatus, TransactionCurrency


class TransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for Transaction model with camelCase field names for API responses.
    """

    # CamelCase field mappings
    phoneNumber = serializers.CharField(source="user.phone_number", read_only=True)
    amountDisplay = serializers.CharField(source="amount_display", read_only=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    updatedAt = serializers.DateTimeField(source="updated_at", read_only=True)

    # Status and currency as display values
    statusDisplay = serializers.CharField(source="get_status_display", read_only=True)
    currencyDisplay = serializers.CharField(source="get_currency_display", read_only=True)

    class Meta:
        model = TransactionModel
        fields = [
            "id",
            "phoneNumber",
            "amount",
            "currency",
            "currencyDisplay",
            "amountDisplay",
            "description",
            "authority",
            "ref_id",
            "status",
            "statusDisplay",
            "card_pan",
            "fee",
            "mobile",
            "email",
            "callback_url",
            "createdAt",
            "updatedAt",
        ]
        read_only_fields = [
            "id",
            "authority",
            "ref_id",
            "status",
            "card_pan",
            "fee",
            "createdAt",
            "updatedAt",
        ]


class TransactionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new transactions (payment initiation).
    """

    class Meta:
        model = TransactionModel
        fields = [
            "amount",
            "currency",
            "description",
            "mobile",
            "email",
            "callback_url",
        ]

    def validate_amount(self, value):
        """
        Validate payment amount according to Zarinpal requirements.
        """
        if value < 10000:  # Minimum 10,000 Rial
            raise serializers.ValidationError(
                "Payment amount must be at least 10,000 Rial."
            )
        if value > 500000000:  # Maximum 500,000,000 Rial (500 million)
            raise serializers.ValidationError(
                "Payment amount cannot exceed 500,000,000 Rial."
            )
        return value

    def create(self, validated_data):
        """
        Create transaction with current user.
        """
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class PaymentInitiateSerializer(serializers.Serializer):
    """
    Serializer for payment initiation response.
    """
    authority = serializers.CharField()
    payment_url = serializers.URLField()


class PaymentVerifySerializer(serializers.Serializer):
    """
    Serializer for payment verification request.
    """
    authority = serializers.CharField(max_length=36, required=True)


class PaymentVerifyResponseSerializer(serializers.Serializer):
    """
    Serializer for payment verification response.
    """
    success = serializers.BooleanField()
    ref_id = serializers.CharField(required=False)
    card_pan = serializers.CharField(required=False)
    fee = serializers.IntegerField(required=False)
    message = serializers.CharField()