پیکربندی اولیه

برای شروع استفاده از SDK، باید تنظیمات مربوط به merchantId و sandbox را انجام دهید. این تنظیمات به شما امکان می‌دهند که در حالت آزمایشی (sandbox) یا واقعی از SDK استفاده کنید. در برخی موارد خاص، مانند استردادوجه یا مدیریت تراکنش‌ها، ممکن است به accessToken نیز نیاز داشته باشید.
تنظیمات با Merchant ID و Access Token

برای عملیات‌هایی مانند ایجاد درخواست پرداخت و تأیید پرداخت، از merchantId استفاده می‌شود. در حالی که برای متدهایی مانند refund یا transaction، باید از accessToken استفاده کنید.

from zarinpal import ZarinPal
from utils.Config import Config

    config = Config(
        merchant_id= "Your merchant code",
        access_token= "your-access-token",
        sandbox=True,  
    )
    zarinpal = ZarinPal(config)

این روش برای هر درخواست باید تنظیم شود ، اما اگر احتیاج دارید دیتا ثابت باشد ، میتوان در فایل Config یک بار این آیتم هارو ست کرد و در بقیه ی سرویس ها بدون پر کردن دیتای کانفیگ ، مستقیم از فایل کانفیگ استفاده کرد


class Config:
    def __init__(self):
        self.sandbox = sandbox #True or False
        self.merchant_id = merchant_id
        self.access_token = access_token

نکته

    برای دریافت مرچنت آیدی از بخش تنظیمات درگاه اقدام نمایید.
    برای دریافت اکسس توکن خود از بخش نشست های فعال

(opens new window) اقدام نمایید.




درخواست پرداخت (Payment Request)

متد request به شما امکان می‌دهد تا یک درخواست پرداخت جدید ایجاد کنید و کاربر را به درگاه پرداخت هدایت کنید. این متد برای ارسال اطلاعات مربوط به پرداخت و دریافت authority جهت هدایت کاربر به صفحه پرداخت استفاده می‌شود.
پارامترهای درخواست

در جدول زیر توضیحات مربوط به هر پارامتر را مشاهده می‌کنید:
نام پارامتر 	نوع 	الزامی 	توضیحات
amount 	Integer 	بله 	مبلغ پرداختی به ریال. حداقل مقدار پرداخت 10000 ریال است.
description 	String 	بله 	توضیحات مربوط به تراکنش مانند شماره سفارش یا نام محصول.
callback_url 	String 	بله 	آدرس بازگشت پس از تکمیل یا عدم موفقیت پرداخت.
mobile 	String 	خیر 	شماره موبایل کاربر. (اختیاری)
email 	String 	خیر 	ایمیل کاربر. (اختیاری)
referrer_id 	String 	خیر 	کد معرف. (اختیاری)
currency 	String 	خیر 	واحد پولی تراکنش. مقدار پیش‌فرض IRR (ریال) و مقدار دیگر IRT (تومان) است.
cardPan 	String 	خیر 	شماره کارت بانکی که کاربر با آن پرداخت می‌کند. (اختیاری)
wages 	Array 	خیر 	آرایه‌ای شامل اطلاعات تسهیم سود. هر عنصر شامل iban (شبا)، amount (مبلغ) و description (توضیح) است.
دریافت URL پرداخت

پس از ارسال موفقیت‌آمیز درخواست پرداخت، یک authority از زرین‌پال دریافت می‌شود. سپس با استفاده از این authority می‌توانید URL نهایی پرداخت را با متد generate_payment_url دریافت کرده و کاربر را به درگاه پرداخت هدایت کنید.
نمونه کد

در ادامه نمونه کدی که نحوه ارسال درخواست پرداخت و هدایت کاربر به درگاه پرداخت را نشان می‌دهد، آورده شده است:


from zarinpal import ZarinPal
from utils.Config import Config



def initiate_payment():
    try:
        config = Config(
            merchant_id="your merchant code",  
            sandbox=True,  
        )
        zarinpal = ZarinPal(config)
        response = zarinpal.payments.create({
            "amount": 20000, 
            "callback_url": "https://zarinpal.com/", 
            "description": "Payment creat", 
            "mobile": "09123456789",  
            "email": "customer@example.com",  
            "cardPan": ["6219861034529007", "5022291073776543"], 
            "referrer_id": "affiliate123", 
        })

        print("Payment created successfully:", response)
        
        if "data" in response and "authority" in response["data"]:
            authority = response["data"]["authority"]
            payment_url = zarinpal.payments.generate_payment_url(authority)
            print("Payment URL:", payment_url)
        else:
            print("Authority not found in response.")


    except Exception as e:
        print("Error during payment creation:", e)

if __name__ == "__main__":
    initiate_payment()



تأیید پرداخت (Payment Verification)

متد verify به شما امکان می‌دهد تا پس از بازگشت کاربر از درگاه پرداخت، وضعیت تراکنش را بررسی و تأیید کنید. با استفاده از این متد، شما می‌توانید صحت پرداخت و جزئیات تراکنش را بررسی کنید و در صورت موفقیت‌آمیز بودن پرداخت، آن را تأیید نمایید.

این متد معمولاً پس از بازگشت کاربر به آدرس callback_url که در درخواست پرداخت مشخص شده بود، استفاده می‌شود.
پارامترهای تأیید پرداخت

در جدول زیر پارامترهای ارسالی به متد verify و توضیحات مربوط به آن‌ها آورده شده است:
نام پارامتر 	نوع 	الزامی 	توضیحات
authority 	String 	بله 	کد authority که پس از درخواست پرداخت از درگاه دریافت می‌شود و در کوئری استرینگ بازگشت به callback_url وجود دارد.
amount 	Integer 	بله 	مبلغ پرداختی که باید با مبلغ اصلی تراکنش مطابقت داشته باشد. این مقدار باید از دیتابیس استخراج شود.
نمونه کد Python

در ادامه، نمونه کدی ارائه شده است که ابتدا کد authority از کوئری استرینگ دریافت می‌شود، سپس مبلغ مربوط به این authority از دیتابیس استخراج شده و برای تأیید به زرین‌پال ارسال می‌شود:

from zarinpal import ZarinPal
from utils.Config import Config



authority = "Your Authority"    
status = "OK"


def get_amount_from_database(authority):
    return 20000

def verify_payment(authority, status):
    if status == "OK":
        amount = get_amount_from_database(authority)

        if amount:
            try:
                config = Config(
                    merchant_id= "Your merchant code", 
                    sandbox=True, 
                )
                zarinpal = ZarinPal(config)    
                response = zarinpal.verifications.verify({
                    "amount": amount,
                    "authority": authority,
                })

                if response["data"]["code"] == 100:
                    print("Payment Verified:")
                    print("Reference ID:", response["data"]["ref_id"])
                    print("Card PAN:", response["data"]["card_pan"])
                    print("Fee:", response["data"]["fee"])
                elif response["data"]["code"] == 101:
                    print("Payment already verified.")
                else:
                    print("Transaction failed with code:", response["data"]["code"])

            except Exception as e:
                print("Payment Verification Failed:", e)
        else:
            print("No Matching Transaction Found For This Authority Code.")
    else:
        print("Transaction was cancelled or failed.")

if __name__ == "__main__":
    verify_payment(authority, status)



 استعلام تراکنش (Transaction Inquiry)

متد inquiry به شما امکان می‌دهد تا وضعیت یک تراکنش را بررسی و استعلام کنید. این متد زمانی استفاده می‌شود که بخواهید پس از ارسال درخواست پرداخت یا تأیید پرداخت، اطلاعات دقیق‌تری درباره وضعیت تراکنش کسب کنید.
پارامترهای ارسالی به متد Inquiry

در جدول زیر پارامترهای ارسالی به متد inquiry و توضیحات مربوط به آن‌ها آورده شده است:
نام پارامتر 	نوع 	الزامی 	توضیحات
merchant_id 	String 	بله 	کد Merchant شما که توسط زرین‌پال اختصاص داده شده است.
authority 	String 	بله 	کد یکتای درخواست پرداخت که پس از درخواست پرداخت دریافت می‌شود.
مقادیر بازگشتی از متد Inquiry

در جدول زیر پارامترهای بازگشتی از متد inquiry توضیح داده شده است:
نام پارامتر 	نوع 	توضیحات
code 	Integer 	کد وضعیت تراکنش: کد 100 برای تراکنش موفق.
message 	String 	پیام وضعیت تراکنش، مانند موفقیت‌آمیز یا عدم موفقیت تراکنش.
status 	String 	وضعیت نهایی تراکنش که نشان می‌دهد تراکنش موفق بوده یا لغو شده است.
نمونه کد Python

در ادامه نمونه کدی ارائه شده است که با استفاده از کد authority، وضعیت تراکنش از زرین‌پال استعلام می‌شود:

from zarinpal import ZarinPal
from utils.Config import Config

def inquire_transaction():
    try:
        config = Config(
            merchant_id= "Your merchant code",
            
            sandbox=True,  
        )
        zarinpal = ZarinPal(config)

        response = zarinpal.inquiries.inquire({
            #Enter authority:
            "authority": " "   
        })

        print("Inquiry Result:", response)
    except Exception as e:
        print("Error during inquiry:", e)
        if hasattr(e, "response"):
            print("Error Details:", e)
        else:
            print("No additional error details available.")

if __name__ == "__main__":
    inquire_transaction()

 استعلام تراکنش‌های تأیید نشده

متد استعلام تراکنش‌های تأیید نشده به شما این امکان را می‌دهد که لیست تراکنش‌های تأیید نشده را از درگاه پرداخت دریافت کنید. این متد می‌تواند برای بررسی تراکنش‌هایی که هنوز وضعیت آن‌ها مشخص نشده است، استفاده شود.
پارامترهای ورودی

در این متد، پارامترهای زیر به API ارسال می‌شود:
نام 	نوع 	اجباری 	شرح
merchant_id 	String 	بله 	کد ۳۶ کاراکتری اختصاصی پذیرنده
اطلاعات خروجی

در صورت موفقیت، اطلاعات زیر از API دریافت می‌شود:
نام 	نوع 	شرح
code 	Integer 	عددی که نشان‌دهنده موفق بودن یا عدم موفق عملیات می‌باشد.
authorities 	Array 	حاوی اطلاعات اضافه تراکنش اعم از نوع درگاه و زمان پرداخت به صورت JSON Encode شده می‌باشد.
نمونه کد Python

در ادامه نمونه‌ای از پیاده‌سازی متد استعلام تراکنش‌های تأیید نشده در Python آمده است:

from zarinpal import ZarinPal
from utils.Config import Config

def get_unverified_payments():
    try:
        config = Config(
            merchant_id="Your merchant code", 
            sandbox=True,
        )
        zarinpal = ZarinPal(config)

        unverified_payments = zarinpal.unverified.list()
        print("Unverified Payments:", unverified_payments)

    except Exception as e:
        print("Error fetching unverified payments:", e)

if __name__ == "__main__":
    get_unverified_payments()



 ریورس تراکنش

متد ریورس تراکنش به شما امکان می‌دهد تا تراکنش‌های موفقی که از زمان پرداخت آن‌ها حداکثر ۳۰ دقیقه گذشته است را بدون کارمزد به حساب خریدار استرداد کنید.

این متد برای تراکنش‌هایی استفاده می‌شود که موفق بوده‌اند اما لازم است مبلغ آن‌ها به خریدار بازگردانده شود. توجه داشته باشید که امکان ریورس تنها در ۳۰ دقیقه ابتدایی پس از انجام تراکنش وجود دارد.
نکات مهم:

    برای استفاده از این سرویس، باید حتماً آی‌پی سرور شما برای درگاه تنظیم شده باشد. در غیر این صورت با خطای 62- مواجه خواهید شد.

پارامترهای ورودی

در این متد، پارامترهای زیر به API ارسال می‌شود:
نام 	نوع 	اجباری 	شرح
merchant_id 	String 	بله 	کد ۳۶ کاراکتری اختصاصی پذیرنده
authority 	String 	بله 	آتوریتی تراکنش مورد نظر برای ریورس کردن
نمونه کد Python

در ادامه نمونه‌ای از پیاده‌سازی متد ریورس تراکنش در Python آمده است:

from zarinpal import ZarinPal
from utils.Config import Config

def reverse_transaction():
    try:
        config = Config(
            merchant_id= "Your Merchent Id",
            sandbox=True, 
        )
        zarinpal = ZarinPal(config)

        response = zarinpal.reversals.reverse({
            #Enter authority:
            "authority": " ",  
        })

        print("Transaction Reversed Successfully:", response)
    except Exception as e:
        print("Error during transaction reversal:", e)

if __name__ == "__main__":
    reverse_transaction()



 استرداد وجه

متد استرداد وجه به شما این امکان را می‌دهد که در صورت تغییر یا لغو سفارش مشتریان، واریزی‌های اشتباه یا هرگونه الزامی جهت بازگرداندن وجه به خریدار، تمام مبلغ واریز شده یا حتی بخشی از آن را به صورت آنی یا در سیکل‌های پایا، به حساب آن‌ها واریز نمایید.
پارامترهای ورودی

در این متد، پارامترهای زیر به API ارسال می‌شود:
نام 	نوع 	اجباری 	شرح
session_id 	String 	بله 	شماره تراکنش
amount 	Integer 	بله 	مبلغ ریال (حداقل مبلغ قابل استرداد ۲۰۰۰۰ ریال)
description 	String 	بله 	توضیح علت استرداد وجه
method 	String 	بله 	متد استرداد وجه (CARD یا PAYA)
reason 	String 	بله 	دلیل استرداد (CUSTOMER_REQUEST و غیره)
اطلاعات خروجی

در صورت موفقیت، اطلاعات زیر از API دریافت می‌شود:
نام 	نوع 	شرح
id 	String 	شماره تراکنش
terminal_id 	String 	شماره ترمینال درگاه
amount 	Integer 	مبلغ پرداخت شده به ریال
timeline 	Object 	تاریخچه تراکنش
refund_amount 	Integer 	مبلغ استرداد
refund_time 	String 	تاریخ ثبت استرداد
refund_status 	String 	وضعیت استرداد
نمونه کد Python

در ادامه نمونه‌ای از پیاده‌سازی متد استرداد وجه در Python آمده است:

from zarinpal import ZarinPal
from utils.Config import Config

def process_refund():
    try:
        config = Config(
            access_token= "Your Token",
        )
        zarinpal = ZarinPal(config)

        refund_response = zarinpal.refunds.create({
            "session_id": "Your Session_Id",
            "amount": 0, #Amount
            "description": "Refund for order #1234",
            "method": "PAYA",
            "reason": "CUSTOMER_REQUEST",
        })
        print("Refund Created:", refund_response)

  

    except Exception as e:
        print("Error processing refund:", str(e))


if __name__ == "__main__":
    process_refund()




 لیست تراکنش‌ها

متد لیست تراکنش‌ها به شما این امکان را می‌دهد که تمامی تراکنش‌های مربوط به یک ترمینال خاص را دریافت کنید. این متد می‌تواند برای مشاهده وضعیت تراکنش‌ها و فیلتر کردن آن‌ها استفاده شود.
پارامترهای ورودی
نام 	نوع 	اجباری 	شرح
terminal_id 	String 	بله 	شناسه ترمینال درگاه مورد نظر
filter 	String 	خیر 	فیلتر بر اساس وضعیت تراکنش‌ها (اختیاری): PAID، VERIFIED، TRASH، ACTIVE، REFUNDED
offset 	Integer 	خیر 	شروع ردیف‌های بازگشتی (اختیاری)
limit 	Integer 	خیر 	تعداد ردیف‌های بازگشتی (اختیاری)
اطلاعات خروجی

در صورت موفقیت، اطلاعات زیر از API دریافت می‌شود:
نام 	نوع 	شرح
id 	String 	شناسه تراکنش
status 	String 	وضعیت تراکنش (مثلاً PAID، FAILED)
amount 	Integer 	مبلغ تراکنش به ریال
description 	String 	توضیحات مربوط به تراکنش
created_at 	String 	تاریخ و ساعت ایجاد تراکنش
نمونه کد Python

در ادامه نمونه‌ای از پیاده‌سازی متد لیست تراکنش‌ها در Python آمده است:

from zarinpal import ZarinPal
from utils.Config import Config

def get_transactions():
    try:
        config = Config(
            access_token= "Your Token",
        )
        zarinpal = ZarinPal(config)

        transactions = zarinpal.transactions.list({
            "terminal_id": "Your terminal ID",
            "filter": "PAID",  
            "limit": 10,  
            "offset": 0,
            
        })

        print("Transactions List:", transactions)
        
    except Exception as e:
        print("Error fetching transactions:", e)

if __name__ == "__main__":
    get_transactions()



 محاسبه کارمزد تراکنش (FeeCalculation)

متد fee_calculation به شما امکان می‌دهد تا قبل از ایجاد درخواست پرداخت، میزان کارمزد یک تراکنش را محاسبه و دریافت کنید. این متد زمانی مفید است که بخواهید کارمزد تراکنش را پیش از شروع فرآیند پرداخت به کاربر نمایش دهید یا در محاسبات خود لحاظ کنید.
پارامترهای ارسالی به متد FeeCalculation
نام پارامتر 	نوع 	الزامی 	توضیحات
merchant_id 	str 	بله 	کد Merchant شما که توسط زرین‌پال اختصاص داده شده است.
amount 	int 	بله 	مبلغ تراکنش به ریال که باید بیشتر از 1000 ریال باشد.
currency 	str 	خیر 	نوع ارز تراکنش (پیش‌فرض: IRR). مقادیر مجاز: IRR, IRT
مقادیر بازگشتی از متد FeeCalculation
نام پارامتر 	نوع 	توضیحات
code 	int 	کد وضعیت درخواست: کد 100 برای درخواست موفق.
message 	str 	پیام وضعیت درخواست، مانند موفقیت‌آمیز بودن محاسبه کارمزد.
amount 	int 	مبلغ اصلی تراکنش به ریال.
fee 	int 	میزان کارمزد محاسبه شده به ریال.
fee_type 	str 	نوع پرداخت کننده کارمزد: Merchant (پذیرنده) یا Payer (پرداخت کننده).
suggested_amount 	str 	مبلغ پیشنهادی برای تسویه حساب
نمونه کد (Python)

from zarinpal import ZarinPal
from utils.Config import Config

def calculate_fee():
    try:
        config = Config(
            merchant_id = ""
        )
        zarinpal = ZarinPal(config)

        fee = zarinpal.fee.calculate({
            "amount": 90000,
            "currency": "IRR"
        })

        print("Fee Calculation Result:", fee)

    except Exception as e:
        print("Error calculating fee:", e)

if __name__ == "__main__":
    calculate_fee()

نکات مهم

    مبلغ تراکنش باید حداقل ۱۰۰۰ ریال باشد.
    کارمزد محاسبه شده بر اساس تنظیمات ترمینال شما و نوع تراکنش متفاوت خواهد بود.
    نوع پرداخت کننده کارمزد (fee_type) می‌تواند Merchant (پذیرنده می‌پردازد) یا Payer (مشتری می‌پردازد) باشد.
    این متد صرفاً برای محاسبه کارمزد است و هیچ تراکنشی ایجاد نمی‌کند.



