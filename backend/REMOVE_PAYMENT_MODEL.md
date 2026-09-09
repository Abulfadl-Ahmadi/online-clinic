# حذف PaymentModel و ساده‌سازی ساختار پرداخت

## 🎯 هدف

ساده‌سازی ساختار پرداخت با حذف `PaymentModel` و استفاده از `TransactionModel` به تنهایی.

## 📋 تغییرات

### 1. مدل‌ها

#### ✅ TransactionModel (اضافه شده)
- اضافه کردن فیلد `appointment` (ForeignKey به AppointmentModel)
- این فیلد optional است (برای پرداخت‌های غیر-نوبت)

```python
appointment = models.ForeignKey(
    'clinic.AppointmentModel',
    on_delete=models.PROTECT,
    related_name="transactions",
    null=True,
    blank=True,
    help_text="Related appointment (if this is an appointment payment)",
)
```

#### ❌ PaymentModel (حذف شده)
- این مدل فقط یک wrapper روی TransactionModel بود
- تمام اطلاعات مورد نیاز در TransactionModel موجود است

#### ❌ RefundModel (حذف شده)
- وابسته به PaymentModel بود
- در صورت نیاز، می‌توان بعداً با وابستگی به TransactionModel پیاده‌سازی کرد

### 2. Services

#### finance/services/payment_service.py

**قبل:**
```python
def create_payment_for_appointment(
    appointment: AppointmentModel,
    callback_url: str,
) -> Tuple[bool, Optional[PaymentModel], Optional[TransactionModel], Optional[str]]:
    payment = PaymentModel.objects.create(...)
    transaction = TransactionModel.objects.create(...)
    return True, payment, transaction, payment_url
```

**بعد:**
```python
def create_payment_for_appointment(
    appointment: AppointmentModel,
    callback_url: str,
) -> Tuple[bool, Optional[TransactionModel], Optional[str]]:
    transaction = TransactionModel.objects.create(
        appointment=appointment,  # مستقیم به appointment ارجاع
        ...
    )
    return True, transaction, payment_url
```

#### verify_payment_and_confirm_appointment

**قبل:**
```python
# Get transaction
transaction = TransactionModel.objects.get(authority=authority)

# Get payment
payment = PaymentModel.objects.get(...)
payment.status = PaymentStatus.SUCCEEDED
payment.save()

# Get appointment
appointment = payment.appointment
appointment.status = AppointmentStatus.CONFIRMED
appointment.save()
```

**بعد:**
```python
# Get transaction
transaction = TransactionModel.objects.get(authority=authority)
transaction.status = TransactionStatus.PAID
transaction.save()

# Get appointment directly from transaction
appointment = transaction.appointment
appointment.status = AppointmentStatus.CONFIRMED
appointment.save()
```

### 3. Views

#### clinic/api/views/appointment_view.py

**قبل:**
```python
success, payment, transaction, payment_url = PaymentService.create_payment_for_appointment(...)

return Response({
    "payment": {
        "id": str(payment.id),
        "transaction_id": str(transaction.id),
        "amount_irr": str(payment.amount_irr),
        ...
    }
})
```

**بعد:**
```python
success, transaction, payment_url = PaymentService.create_payment_for_appointment(...)

return Response({
    "payment": {
        "id": str(transaction.id),
        "transaction_id": str(transaction.id),
        "amount_irr": str(transaction.amount),
        ...
    }
})
```

### 4. Serializers

#### clinic/api/serializers/appointment_serializer.py

**قبل:**
```python
def get_payment_status(self, obj):
    return obj.payment.status  # OneToOne relationship
```

**بعد:**
```python
def get_payment_status(self, obj):
    transaction = obj.transactions.order_by('-created_at').first()  # ForeignKey
    return transaction.status if transaction else None
```

### 5. Admin

#### finance/admin/transaction_admin.py

- اضافه کردن `appointment` به readonly_fields
- اضافه کردن `appointment_info()` method برای نمایش در list_display
- اضافه کردن لینک به appointment در admin

### 6. Migration

**0003_add_appointment_to_transaction_remove_payment.py:**

```python
operations = [
    # Add appointment to TransactionModel
    migrations.AddField(
        model_name='transactionmodel',
        name='appointment',
        field=models.ForeignKey(...),
    ),
    
    # Remove RefundModel
    migrations.DeleteModel(name='RefundModel'),
    
    # Remove PaymentModel
    migrations.DeleteModel(name='PaymentModel'),
]
```

## 🔄 Relationships

### قبل:
```
AppointmentModel (1) <--OneToOne--> (1) PaymentModel
                                           |
                                           | (reference by lookup)
                                           |
                                           v
                                    TransactionModel
```

### بعد:
```
AppointmentModel (1) <--ForeignKey--> (*) TransactionModel
```

## ✅ مزایا

1. **ساده‌تری**: یک مدل کمتر برای مدیریت
2. **کمتر Redundant**: اطلاعات تکراری نداریم
3. **انعطاف‌پذیرتر**: می‌توانیم چند transaction برای یک appointment داشته باشیم (برای retry)
4. **Query کمتر**: نیازی به join بین Payment و Transaction نیست

## 🚀 مراحل Deploy

### 1. Backup Database
```bash
python manage.py dumpdata > backup.json
# یا برای PostgreSQL:
pg_dump dbname > backup.sql
```

### 2. Run Migration
```bash
python manage.py makemigrations
python manage.py migrate
```

### 3. Test
- تست رزرو نوبت
- تست پرداخت موفق
- تست پرداخت ناموفق
- بررسی admin panel

### 4. Monitor Logs
```bash
tail -f logs/finance/finance.log
tail -f logs/clinic/clinic.log
```

## ⚠️ نکات مهم

### قبل از Migration:
- اطمینان حاصل کنید که هیچ `PaymentModel` pending ندارید
- تمام payments باید یا SUCCEEDED یا FAILED باشند

### بعد از Migration:
- `appointment.payment` دیگر کار نمی‌کند (OneToOne relationship حذف شد)
- باید از `appointment.transactions` استفاده کنید
- برای گرفتن آخرین transaction: `appointment.transactions.order_by('-created_at').first()`

## 📝 TODO (اگر لازم باشد)

### Refund System (آینده)
اگر بخواهید refund را دوباره پیاده‌سازی کنید:

```python
class RefundModel(models.Model):
    transaction = models.ForeignKey(
        TransactionModel,
        on_delete=models.PROTECT,
        related_name="refunds"
    )
    amount = models.PositiveIntegerField()
    reason = models.TextField()
    status = models.CharField(...)
    created_by = models.ForeignKey(User, ...)
    created_at = models.DateTimeField(auto_now_add=True)
```

### Partial Payments (آینده)
اگر بخواهید پرداخت قسطی داشته باشید، ForeignKey مناسب است:

```python
# Patient می‌تواند چند transaction برای یک appointment داشته باشد
transaction1 = Transaction.objects.create(appointment=app, amount=50000)
transaction2 = Transaction.objects.create(appointment=app, amount=50000)
```

## 🔍 چگونه تست کنیم؟

### Test 1: رزرو نوبت
```bash
curl -X POST http://localhost:8000/api/v1/clinic/appointments/book/ \
  -H "Authorization: Bearer <token>" \
  -d '{
    "doctor_id": "...",
    "appointment_date": "2025-11-20",
    "start_time": "10:00:00",
    "end_time": "10:30:00"
  }'
```

پاسخ باید شامل `transaction_id` باشد (نه `payment_id`).

### Test 2: پرداخت موفق
1. رزرو نوبت
2. رفتن به `payment_url`
3. پرداخت با کارت تست: `5022-2910-0000-5678`
4. بررسی:
   - `transaction.status == PAID`
   - `appointment.status == CONFIRMED`

### Test 3: پرداخت ناموفق
1. رزرو نوبت
2. رفتن به `payment_url`
3. پرداخت با کارت تست: `5022-2900-0000-0000`
4. بررسی:
   - `transaction.status == FAILED`
   - `appointment.status == CANCELLED`

---

**نسخه:** 1.0  
**تاریخ:** ۱۸ آبان ۱۴۰۴  
**وضعیت:** ✅ آماده برای Migration
