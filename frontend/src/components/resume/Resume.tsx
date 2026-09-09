import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function Resume() {
  return (
    <article className="bg-card rounded-lg border shadow-sm p-8 md:p-12 print:shadow-none">
      {/* Header */}
      <header className="border-b-2 border-primary pb-6 mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Abbas Rahimi</h1>
        <p className="text-xl text-primary font-semibold">PT., Ph.D.</p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>
            <strong>Phone:</strong> +971 567029582, +989123849349
          </div>
          <div>
            <strong>Email:</strong> arahimiuk@yahoo.com
          </div>
          <div>
            <strong>Nationality:</strong> Iranian
          </div>
        </div>
      </header>

      {/* Academic Education */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-primary pl-4">
          Academic Education
        </h2>
        <div className="space-y-6">
          {/* PhD */}
          <div className="border-l-2 border-border pl-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground">PhD</h3>
                <p className="text-card-foreground">Sports Medicine</p>
              </div>
              <Badge variant="secondary">1997 - Dec. 2001</Badge>
            </div>
            <p className="text-muted-foreground">
              Centre for Sports Medicine, Division of Orthopedic and Accident Surgery,
              University of Nottingham, UK
            </p>
          </div>

          {/* MSc */}
          <div className="border-l-2 border-border pl-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground">MSc.</h3>
                <p className="text-card-foreground">Physiotherapy</p>
              </div>
              <Badge variant="secondary">1987 - 1989</Badge>
            </div>
            <p className="text-muted-foreground">
              Tehran University of Medical Sciences, Tehran, Iran
            </p>
          </div>

          {/* BSc */}
          <div className="border-l-2 border-border pl-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-foreground">BSc.</h3>
                <p className="text-card-foreground">Physiotherapy</p>
              </div>
              <Badge variant="secondary">1982 - 1986</Badge>
            </div>
            <p className="text-muted-foreground">
              Shiraz University of Medical Sciences, Shiraz, Iran
            </p>
          </div>
        </div>
      </section>

      {/* Academic Positions */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-primary pl-4">
          Academic Positions
        </h2>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-foreground">
              Department of Physiotherapy, School of Rehabilitation
            </h3>
            <p className="text-muted-foreground mt-2">
              Shahid Beheshti University of Medical Sciences, Tehran, Iran
              <br />
              <span className="font-semibold">Apr. 1991 - Jul. 2022</span>
            </p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-card-foreground">
              <li>
                <strong>Lecturer:</strong> 1991-2002
              </li>
              <li>
                <strong>Assistant Professor:</strong> 2002-2007
              </li>
              <li>
                <strong>Associate Professor:</strong> 2007-2014
              </li>
              <li>
                <strong>Full Professor:</strong> 2014-2022 (Early Retirement)
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      {/* Teaching Experience */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-primary pl-4">
          Teaching Experience
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-foreground">Courses Taught</h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Physiotherapy in Orthopedic Disorders</li>
                <li>• Physiotherapy in Neurological Disorders</li>
                <li>• Clinical Radiology for Physical Therapists</li>
                <li>• Advanced Gait Analysis</li>
                <li>• Electromyography</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-foreground">Clinical Teaching</h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Akhtar Orthopedic Hospital</li>
                <li>• Yasarer Spinal Cord Rehabilitation Hospital</li>
                <li>• Supervised 55+ Master's and PhD theses</li>
                <li>• Published ~100 international peer-reviewed articles</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Professional Certificates */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-primary pl-4">
          Professional Certificates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'Dry Needling Courses (Dr. Bahrami, USA, 2020)',
            'FIND Integrated Dry Needling Course - Dr. Mehdi Somaya, 2020',
            'MDT Course - Dr. George Sup, Germany, 2017',
            'Manual Therapy - Dr. Ghasemi Divanbighi, Italy, 2014',
            'Pelvic Manual Therapy - Dr. Norouzbighi, USA, 2017',
            'Stroke Rehabilitation - Dr. Majidalsalami, Tehran, 2020',
            'Parkinson\'s Rehabilitation - Dr. Majidalsalami, Tehran, 2020',
            'Musculoskeletal Ultrasound - Dr. Rougani, Tehran, 2011',
          ].map((cert, idx) => (
            <div key={idx} className="flex items-start gap-3 text-card-foreground">
              <span className="text-primary font-bold">✓</span>
              <p className="text-sm">{cert}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Research Interests */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-primary pl-4">
          Research Interests
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            'Orthopedic Rehabilitation',
            'Sports Injuries',
            'Neurological Rehabilitation',
            'Spinal Cord',
            'Biomechanics',
            'Gait Analysis',
            'Wound Healing',
            'Myofascial Release',
          ].map((interest) => (
            <Badge key={interest} variant="secondary">
              {interest}
            </Badge>
          ))}
        </div>
      </section>

      {/* Publications */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-primary pl-4">
          Publications
        </h2>
        <Card>
          <CardHeader>
            <p className="text-card-foreground">
              <strong>H-Index:</strong> 19
              <br />
              <strong>Total Publications:</strong> 100+ in International Journals
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              Published numerous peer-reviewed articles covering topics in rehabilitation,
              biomechanics, gait analysis, and clinical physiotherapy.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Published Books */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-primary pl-4">
          Published Books
        </h2>
        <div className="space-y-4">
          {[
            {
              title: 'Osteoarthritis (OA)',
              role: 'Author',
              year: '2006',
              publisher: 'Sarmadi Publication, Tehran, Iran',
            },
            {
              title: 'Orthopedic Tests for Physiotherapy Students (Translation)',
              role: 'Translator',
              year: '2010',
              publisher: 'Sarmadi Publication, Tehran, Iran',
            },
            {
              title: 'Clinical Guides For Medical Shoes & Orthosis in Lower Limb Disorders',
              role: 'Author',
              year: '2014',
              publisher: 'Pegah Publication, Tehran, Iran',
            },
            {
              title: 'Clinical Use Of Lower Limb Orthosis In Musculoskeletal Disorders',
              role: 'Author',
              year: '2014',
              publisher: 'Pegah Publication, Tehran, Iran',
            },
            {
              title: 'Clinical Pharmacology For Physiotherapists',
              role: 'Author',
              year: '2016',
              publisher: 'Pegah Publication, Tehran, Iran',
            },
            {
              title: 'Fast Pass Prometric Physio Exam (Two Volumes)',
              role: 'Author',
              year: '2023',
              publisher: 'Setayesh Hasti Publisher, Tehran, Iran',
            },
          ].map((book, idx) => (
            <div key={idx} className="border-l-2 border-border pl-4 pb-4">
              <h4 className="font-semibold text-foreground">{book.title}</h4>
              <p className="text-sm text-muted-foreground">
                <strong>{book.role}</strong> • {book.year}
              </p>
              <p className="text-sm text-muted-foreground/60">{book.publisher}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Languages */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-primary pl-4">
          Languages
        </h2>
        <div className="space-y-3">
          {[
            { lang: 'Persian', level: 'Native' },
            { lang: 'English', level: 'Fluent' },
            { lang: 'Arabic', level: 'Elementary' },
          ].map((lang) => (
            <div key={lang.lang} className="flex justify-between items-center">
              <span className="text-card-foreground font-medium">{lang.lang}</span>
              <Badge variant="outline">{lang.level}</Badge>
            </div>
          ))}
        </div>
      </section>

      {/* Awards and Honors */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-primary pl-4">
          Awards & Honors
        </h2>
        <Card>
          <CardContent className="pt-6">
            <p className="text-card-foreground">
              Selected as the best departmental lecturer at the Shahid Beheshti University of
              Medical Sciences in years: 1992, 1993, 2013, 2022
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Inventions */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-primary pl-4">
          Inventions
        </h2>
        <ul className="space-y-3 text-card-foreground">
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>
              Reciprocal muscle strengthening tool (2011), as co-inventor with Mr. Saeed Azimi
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">•</span>
            <span>
              Pneumatic knee extension brace with 3-point mechanism (2020), as the main
              inventor
            </span>
          </li>
        </ul>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-border pt-6 mt-8 text-center text-sm text-muted-foreground">
        <p>Last Updated: 2025</p>
      </footer>
    </article>
  );
}
