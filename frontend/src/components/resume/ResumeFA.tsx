import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function ResumeFA() {
  return (
    <article className="bg-card rounded-lg border shadow-sm p-8 md:p-12 print:shadow-none text-right" dir="rtl">
      {/* Header */}
      <header className="border-b-2 border-primary pb-6 mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">عباس رحیمی</h1>
        <p className="text-xl text-primary font-semibold">دکتری تخصصی - کارشناس درمانی</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>
            <strong>تلفن:</strong> +971 567029582 و +989123849349
          </div>
          <div>
            <strong>ایمیل:</strong> arahimiuk@yahoo.com
          </div>
          <div>
            <strong>تابعیت:</strong> ایرانی
          </div>
        </div>
      </header>

      {/* تحصیلات آکادمیک */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-r-4 border-primary pr-4">
          تحصیلات آکادمیک
        </h2>
        <div className="space-y-6">
          {/* دکتری */}
          <div className="border-r-2 border-border pr-4">
            <div className="flex justify-between items-start mb-2 flex-row-reverse">
              <Badge variant="secondary">۱۳۷۶ - آذر ۱۳۸۰</Badge>
              <div>
                <h3 className="text-lg font-semibold text-foreground">دکتری</h3>
                <p className="text-card-foreground">پزشکی ورزشی</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              دانشگاه ناتینگهام، بریتانیا - مرکز پزشکی ورزشی و جراحی حوادث و ارتوپدی
            </p>
          </div>

          {/* کارشناسی ارشد */}
          <div className="border-r-2 border-border pr-4">
            <div className="flex justify-between items-start mb-2 flex-row-reverse">
              <Badge variant="secondary">۱۳۶۷ - ۱۳۶۸</Badge>
              <div>
                <h3 className="text-lg font-semibold text-foreground">کارشناسی ارشد</h3>
                <p className="text-card-foreground">فیزیوتراپی</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              دانشگاه علوم پزشکی تهران، تهران، ایران
            </p>
          </div>

          {/* کارشناسی */}
          <div className="border-r-2 border-border pr-4">
            <div className="flex justify-between items-start mb-2 flex-row-reverse">
              <Badge variant="secondary">۱۳۶۱ - ۱۳۶۵</Badge>
              <div>
                <h3 className="text-lg font-semibold text-foreground">کارشناسی</h3>
                <p className="text-card-foreground">فیزیوتراپی</p>
              </div>
            </div>
            <p className="text-muted-foreground">
              دانشگاه علوم پزشکی شیراز، شیراز، ایران
            </p>
          </div>
        </div>
      </section>

      {/* مشاغل آکادمیک */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-r-4 border-primary pr-4">
          مشاغل آکادمیک
        </h2>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">
              گروه درمانگری فیزیکی، دانشکده توانبخشی
            </h3>
            <p className="text-muted-foreground mt-2">
              دانشگاه علوم پزشکی شهید بهشتی، تهران، ایران
              <br />
              <span className="font-semibold">اردیبهشت 1370 - تیر 1401</span>
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-card-foreground">
              <li>
                <strong>مربی:</strong> 1370-1381
              </li>
              <li>
                <strong>استادیار:</strong> 1381-1386
              </li>
              <li>
                <strong>دانشیار:</strong> 1386-1393
              </li>
              <li>
                <strong>استاد:</strong> 1393 تا تیر 1401 (بازنشستگی زودهنگام)
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* تجربه تدریس */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-r-4 border-primary pr-4">
          تجربه تدریس
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-foreground">دروس تدریس‌شده</h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• درمانگری فیزیکی اختلالات ارتوپدی</li>
                <li>• درمانگری فیزیکی اختلالات عصبی</li>
                <li>• رادیولوژی بالینی برای درمانگران فیزیکی</li>
                <li>• تحلیل راه‌رفتن پیشرفته</li>
                <li>• الکترومایوگرافی</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-foreground">آموزش بالینی</h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• بیمارستان ارتوپدی اختر</li>
                <li>• بیمارستان توانبخشی نخاع یاسر</li>
                <li>• ناظر 55+ پایان‌نامه کارشناسی ارشد و دکتری</li>
                <li>• انتشار ~100 مقالات تحقیقی بین‌المللی</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* گواهینامه‌های حرفه‌ای */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-r-4 border-primary pr-4">
          گواهینامه‌های حرفه‌ای
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'دوره‌های خشک سوزنگذاری (دکتر بهرامیان، آمریکا، 1399)',
            'FIND دوره یکپارچه خشک سوزنگذاری - دکتر میهی سومایا، 1399',
            'دوره MDT - دکتر گئورگ سوپ، آلمان، 1396',
            'درمانگری دستی - دکتر قهرمان دیوانبیگی، ایتالیا، 1393',
            'درمانگری دستی لگن - دکتر نوربخش، آمریکا، 1396',
            'توانبخشی سکته - دکتر مجدالسلامی، تهران، 1399',
            'توانبخشی پارکینسون - دکتر مجدالسلامی، تهران، 1399',
            'سونوگرافی اسکلتی عضلانی - دکتر روغنی، تهران، 1390',
          ].map((cert, idx) => (
            <div key={idx} className="flex items-start gap-3 text-card-foreground flex-row-reverse">
              <span className="text-primary font-bold">✓</span>
              <p className="text-sm">{cert}</p>
            </div>
          ))}
        </div>
      </section>

      {/* علایق تحقیقی */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-r-4 border-primary pr-4">
          علایق تحقیقی
        </h2>
        <div className="flex flex-wrap gap-3 justify-end">
          {[
            'توانبخشی ارتوپدی',
            'آسیب‌های ورزشی',
            'توانبخشی عصبی',
            'نخاع',
            'بیومکانیک',
            'تحلیل راه‌رفتن',
            'التیام زخم',
            'آزادسازی میوفاشیال',
          ].map((interest) => (
            <Badge key={interest} variant="secondary">
              {interest}
            </Badge>
          ))}
        </div>
      </section>

      {/* شاخص H و انتشارات */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-r-4 border-primary pr-4">
          انتشارات
        </h2>
        <Card>
          <CardHeader>
            <p className="text-card-foreground">
              <strong>شاخص H:</strong> 19
              <br />
              <strong>مجموع انتشارات:</strong> 100+ مقاله در مجلات بین‌المللی
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              انتشار مقالات متعددی در مجلات معتبر در زمینه توانبخشی، بیومکانیک، تحلیل راه‌رفتن و درمانگری بالینی
            </p>
          </CardContent>
        </Card>
      </section>

      {/* کتاب‌های منتشرشده */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-r-4 border-primary pr-4">
          کتاب‌های منتشرشده
        </h2>
        <div className="space-y-4">
          {[
            {
              title: 'آرتروز (OA)',
              role: 'نویسنده',
              year: '1385',
              publisher: 'انتشارات سرمدی، تهران',
            },
            {
              title: 'آزمون‌های ارتوپدی برای دانشجویان درمانگری (ترجمه)',
              role: 'مترجم',
              year: '1389',
              publisher: 'انتشارات سرمدی، تهران',
            },
            {
              title: 'راهنمای بالینی کفش‌های پزشکی و آرتوزهای اندام تحتانی',
              role: 'نویسنده',
              year: '1393',
              publisher: 'انتشارات پگاه، تهران',
            },
            {
              title: 'کاربردهای بالینی آرتوزهای اندام تحتانی در اختلالات اسکلتی عضلانی',
              role: 'نویسنده',
              year: '1393',
              publisher: 'انتشارات پگاه، تهران',
            },
            {
              title: 'فارماکولوژی بالینی برای درمانگران فیزیکی',
              role: 'نویسنده',
              year: '1395',
              publisher: 'انتشارات پگاه، تهران',
            },
            {
              title: 'آزمون سریع Prometric درمانگری فیزیکی (دو جلد)',
              role: 'نویسنده',
              year: '1401',
              publisher: 'انتشارات ستایش هستی، تهران',
            },
          ].map((book, idx) => (
            <div key={idx} className="border-r-2 border-border pr-4 pb-4">
              <h4 className="font-semibold text-foreground">{book.title}</h4>
              <p className="text-sm text-muted-foreground">
                <strong>{book.role}</strong> • {book.year}
              </p>
              <p className="text-sm text-muted-foreground/60">{book.publisher}</p>
            </div>
          ))}
        </div>
      </section>

      {/* زبان‌ها */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-r-4 border-primary pr-4">
          زبان‌ها
        </h2>
        <div className="space-y-3">
          {[
            { lang: 'فارسی', level: 'مادری' },
            { lang: 'انگلیسی', level: 'روان' },
            { lang: 'عربی', level: 'پایه' },
          ].map((lang) => (
            <div key={lang.lang} className="flex justify-between items-center flex-row-reverse">
              <span className="text-card-foreground font-medium">{lang.lang}</span>
              <Badge variant="outline">{lang.level}</Badge>
            </div>
          ))}
        </div>
      </section>

      {/* جوایز و افتخارات */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-r-4 border-primary pr-4">
          جوایز و افتخارات
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-card-foreground">
              انتخاب به عنوان بهترین استاد گروهی در دانشگاه علوم پزشکی شهید بهشتی در سال‌های:
              1371، 1372، 1392، 1401
            </p>
          </CardContent>
        </Card>
      </section>

      {/* اختراعات */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-r-4 border-primary pr-4">
          اختراعات
        </h2>
        <ul className="space-y-3 text-card-foreground">
          <li className="flex gap-3 justify-end">
            <span>
              ابزار تقویت عضلات متقابل (1390) - به‌عنوان مخترع مشترک با آقای سعید عظیمی
            </span>
            <span className="text-primary font-bold">•</span>
          </li>
          <li className="flex gap-3 justify-end">
            <span>
              آرتوز کششی زانو با مکانیسم 3 نقطه‌ای (1399) - به‌عنوان مخترع اصلی
            </span>
            <span className="text-primary font-bold">•</span>
          </li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-border pt-6 mt-8 text-center text-sm text-muted-foreground">
        <p>آخرین به‌روزرسانی: 1404</p>
      </footer>
    </article>
  );
}
