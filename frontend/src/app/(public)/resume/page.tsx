'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Resume, ResumeFA } from '@/components/resume';

export default function ResumePage() {
  const [language, setLanguage] = useState<'en' | 'fa'>('fa');

  return (
    <main className="min-h-screen bg-background" dir={language === 'fa' ? 'rtl' : 'ltr'}>
      {/* Language Switcher */}
      <div className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">
            {language === 'fa' ? 'رزومه' : 'Resume'}
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setLanguage('fa')}
              variant={language === 'fa' ? 'default' : 'secondary'}
            >
              فارسی
            </Button>
            <Button
              onClick={() => setLanguage('en')}
              variant={language === 'en' ? 'default' : 'secondary'}
            >
              English
            </Button>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {language === 'fa' ? <ResumeFA /> : <Resume />}
      </div>

      {/* Print Button */}
      <div className="max-w-6xl mx-auto px-4 py-8 text-center no-print">
        <Button
          onClick={() => window.print()}
          size="lg"
        >
          {language === 'fa' ? '🖨️ چاپ' : '🖨️ Print'}
        </Button>
      </div>
    </main>
  );
}
