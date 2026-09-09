import { ClinicGallery } from '@/components/clinic/ClinicGallery';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';

const clinicImages = [
  '/images/general/clinic/photo_2025-12-17_03-25-39.jpg',
  '/images/general/clinic/photo_2025-12-17_03-25-47.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-03.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-07.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-13.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-17.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-22.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-27.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-31.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-39.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-47.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-50.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-51.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-53.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-54.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-55.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-56.jpg',
  '/images/general/clinic/photo_2025-12-17_03-26-59.jpg',
  '/images/general/clinic/photo_2025-12-17_03-27-02.jpg',
  '/images/general/clinic/photo_2025-12-17_03-27-05.jpg',
  '/images/general/clinic/photo_2025-12-17_03-27-07.jpg',
  '/images/general/clinic/photo_2025-12-17_03-27-09.jpg',
  '/images/general/clinic/photo_2025-12-17_03-27-11.jpg',
  '/images/general/clinic/photo_2025-12-17_03-27-13.jpg',
  '/images/general/clinic/photo_2025-12-17_03-27-20.jpg',
];

export default function ClinicPage() {
  return (
    <main className="min-h-screen bg-background" dir="rtl">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            درباره کلینیک ما
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
            کلینیک ما با سال‌ها تجربه در ارائه خدمات درمانی با کیفیت بالا،
            به بیماران خود تعهد می‌دهد که بهترین مراقبت‌های سلامتی را تجربه کنند.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-foreground">
            چرا کلینیک ما را انتخاب کنید؟
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card>
              <CardHeader className="flex flex-col items-center text-center">
                <span className="text-4xl mb-4">🏥</span>
                <h3 className="text-xl font-semibold">تجهیزات مدرن</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  کلینیک ما به پیشرفته‌ترین تجهیزات پزشکی مجهز است
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card>
              <CardHeader className="flex flex-col items-center text-center">
                <span className="text-4xl mb-4">👨‍⚕️</span>
                <h3 className="text-xl font-semibold">پزشکان متخصص</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  تیمی از پزشکان باتجربه و متخصص در حوزه‌های گوناگون
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card>
              <CardHeader className="flex flex-col items-center text-center">
                <span className="text-4xl mb-4">💙</span>
                <h3 className="text-xl font-semibold">تکریم بیمار</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  محیطی آرام، استاندارد و صمیمی برای مراقبت از سلامت شما
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <ClinicGallery images={clinicImages} title="گالری کلینیک" />

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
            آماده برای دریافت نوبت؟
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            اکنون نوبت ویزیت خود را رزرو کنید و از خدمات کلینیک بهره‌مند شوید
          </p>
          <Button asChild size="lg">
            <Link href="/user/doctors">رزرو نوبت</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
