import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { StoreProvider } from '@/context/StoreContext';
import GlobalModals from '@/components/GlobalModals';

export const metadata = {
  title: 'Rithy Book Store — Online Bookstore',
  description: 'Explore our curated collection of books with fast delivery and easy online ordering in Cambodia.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
              try {
                var t = localStorage.getItem('bookoe_theme');
                if (t === 'dark' || (!t && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
                var l = localStorage.getItem('bookoe_lang');
                if (l === 'KH') {
                  document.documentElement.lang = 'km';
                  document.documentElement.setAttribute('data-lang', 'KH');
                } else if (l === 'ZH') {
                  document.documentElement.lang = 'zh';
                  document.documentElement.setAttribute('data-lang', 'ZH');
                } else {
                  document.documentElement.lang = 'en';
                  document.documentElement.setAttribute('data-lang', 'EN');
                }
              } catch(e) {}
            })();`,
          }}
        />
      </head>
      <body>
        <StoreProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 80px)' }}>
            {children}
          </main>
          <Footer />
          <GlobalModals />
        </StoreProvider>
      </body>
    </html>
  );
}
