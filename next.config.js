/** @type {import('next').NextConfig} */
const fs = require('fs');
const path = require('path');

const COVERS = [
  {
    file: 'the-notebook.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/8/86/Posternotebook.jpg',
      'https://covers.openlibrary.org/b/id/8231990-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780446605236-L.jpg',
    ]
  },
  {
    file: 'me-before-you.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/f/fd/Me_Before_You_%28film%29.jpg',
      'https://covers.openlibrary.org/b/id/7949318-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780143124541-L.jpg',
    ]
  },
  {
    file: 'messi.jpg',
    urls: [
      'https://covers.openlibrary.org/b/id/9266155-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9781409146599-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9781409146605-L.jpg',
    ]
  },
  {
    file: 'the-mamba-mentality.jpg',
    urls: [
      'https://covers.openlibrary.org/b/id/8885149-L.jpg',
      'https://covers.openlibrary.org/b/id/9082390-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780374201234-L.jpg',
    ]
  },
  {
    file: 'sherlock-holmes.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/commons/b/b9/Adventures_of_sherlock_holmes.jpg',
      'https://covers.openlibrary.org/b/id/8315104-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9781853260339-L.jpg',
    ]
  },
  {
    file: 'gone-girl.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/0/05/Gone_Girl_Poster.jpg',
      'https://covers.openlibrary.org/b/id/7269865-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780307588371-L.jpg',
    ]
  },
  {
    file: 'sapiens.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/0/06/Sapiens_A_Brief_History_of_Humankind.jpg',
      'https://covers.openlibrary.org/b/id/8750831-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
    ]
  },
  {
    file: 'into-thin-air.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/4/46/Into_Thin_Air.jpg',
      'https://covers.openlibrary.org/b/id/240726-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780385494786-L.jpg',
    ]
  },
  {
    file: 'diary-of-a-young-girl.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/4/47/Het_Achterhuis_%28Diary_of_Anne_Frank%29_-_front_cover%2C_first_edition.jpg',
      'https://covers.openlibrary.org/b/id/10541707-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780553296983-L.jpg',
    ]
  },
  {
    file: 'the-book-thief.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/8/8f/The_Book_Thief_by_Markus_Zusak_book_cover.jpg',
      'https://covers.openlibrary.org/b/id/6513444-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg',
    ]
  },
  {
    file: 'spirited-away.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/ms/3/30/Spirited_Away_poster.JPG',
      'https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png',
      'https://covers.openlibrary.org/b/id/6890333-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9781569317907-L.jpg',
    ]
  },
  {
    file: 'your-name.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/0/0b/Your_Name_poster.png',
      'https://covers.openlibrary.org/b/id/8751540-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780316471862-L.jpg',
    ]
  },
  {
    file: 'steve-jobs.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/e/e0/Steve_Jobs_by_Walter_Isaacson.jpg',
      'https://covers.openlibrary.org/b/id/7168051-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg',
    ]
  },
  {
    file: 'becoming.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/0/09/Becoming_%28Michelle_Obama_book%29.jpg',
      'https://covers.openlibrary.org/b/id/8643261-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg',
    ]
  },
  {
    file: 'diary-of-a-wimpy-kid.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/0/09/Diary_of_a_Wimpy_Kid_book_cover.jpg',
      'https://covers.openlibrary.org/b/id/6487843-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780810993136-L.jpg',
    ]
  },
  {
    file: 'hitchhikers-guide.jpg',
    urls: [
      'https://upload.wikimedia.org/wikipedia/en/7/7a/Hitchhikers_guide_to_the_galaxy.jpg',
      'https://upload.wikimedia.org/wikipedia/en/b/bd/H2G2_UK_front_cover.jpg',
      'https://covers.openlibrary.org/b/id/6703562-L.jpg',
      'https://covers.openlibrary.org/b/isbn/9780345391803-L.jpg',
    ]
  },
  {
    file: 'phka-srapoun.jpg',
    urls: [
      'https://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Phkar-Sror-pon.jpg',
      'http://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Phkar-Sror-pon.jpg',
      'https://digital-library.cloudnet.com.kh/storage/book_images/7GBykPPfWYSMjAjzkH2JhfwWJU0miVsoKVoHhO50.jpg'
    ]
  },
  {
    file: 'kolab-pailin.jpg',
    urls: [
      'https://www.elibraryofcambodia.org/wp-content/uploads/2015/11/rueng-kolab-bailin.jpg',
      'http://www.elibraryofcambodia.org/wp-content/uploads/2015/11/rueng-kolab-bailin.jpg'
    ]
  },
  {
    file: 'tum-teav.jpg',
    urls: [
      'https://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Roeung-Tum-Teav-book-cover.jpg',
      'http://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Roeung-Tum-Teav-book-cover.jpg',
      'https://upload.wikimedia.org/wikipedia/en/6/67/Tumteav.jpg'
    ]
  },
  {
    file: 'mealea-doung-chet.jpg',
    urls: [
      'https://www.elibraryofcambodia.org/wp-content/uploads/2014/03/Mealea-Doung-Chet-book-cover.jpg',
      'http://www.elibraryofcambodia.org/wp-content/uploads/2014/03/Mealea-Doung-Chet-book-cover.jpg'
    ]
  },
  {
    file: 'preah-atit-tmey.jpg',
    urls: [
      'https://nuspress.nus.edu.sg/cdn/shop/products/9789813250772.jpg?v=1569819659',
      'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1583034676i/52062171.jpg',
      'http://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Preah-Atit-Tmey-Reas-Leu-Phern-Dey-Chas-book-cover-final.jpg'
    ]
  },
  {
    file: 'phoumireakchan.jpg',
    urls: [
      'https://www.elibraryofcambodia.org/wp-content/uploads/2015/11/phom-dirichharn-phnak-ti-12.jpg',
      'http://www.elibraryofcambodia.org/wp-content/uploads/2015/06/Phoum-TiRachhan-Thnak-Ti-11.jpg'
    ]
  },
  {
    file: 'kru-srok-srae.jpg',
    urls: [
      'https://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Krou-Bang-Rein-Srok-Srer-book-cover.jpg',
      'http://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Krou-Bang-Rein-Srok-Srer-book-cover.jpg'
    ]
  },
  {
    file: 'sophat.jpg',
    urls: [
      'https://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Sophat-book-cover.jpg',
      'http://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Sophat-book-cover.jpg',
      'https://www.elibraryofcambodia.org/wp-content/uploads/2015/05/Roeung-Sophat.jpg'
    ]
  },
  {
    file: 'reamker.jpg',
    urls: [
      'https://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Ream-ke-Book-Cover.jpg',
      'http://www.elibraryofcambodia.org/wp-content/uploads/2014/04/Ream-ke-Book-Cover.jpg',
      'https://www.elibraryofcambodia.org/wp-content/uploads/2015/12/ream-ke-pheak-1.jpg'
    ]
  },
  {
    file: 'thmenh-chey.jpg',
    urls: [
      'https://www.elibraryofcambodia.org/wp-content/uploads/2015/11/reung-thonchey.jpg',
      'http://www.elibraryofcambodia.org/wp-content/uploads/2015/11/reung-thonchey.jpg'
    ]
  },
];

async function downloadMissingCovers() {
  const destDir = path.join(__dirname, 'public', 'images', 'books');
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const uploadDir = 'C:\\Users\\ASUS ROG\\.gemini\\antigravity-ide\\brain\\a7432110-7694-428c-9cc5-33c9ffc1a731\\.user_uploaded';
  const localCopies = [
    { src: path.join(uploadDir, 'media_1792050861682.png'), dest: path.join(destDir, 'romeo-and-juliet.png') },
    { src: path.join(uploadDir, 'media_1792050878426.png'), dest: path.join(destDir, 'titanic.png') },
  ];
  for (const c of localCopies) {
    if (fs.existsSync(c.src) && !fs.existsSync(c.dest)) {
      fs.copyFileSync(c.src, c.dest);
    }
  }

  for (const item of COVERS) {
    const target = path.join(destDir, item.file);
    if (!fs.existsSync(target) || fs.statSync(target).size < 1200) {
      for (const url of item.urls) {
        try {
          const res = await fetch(url, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Bookoe/1.0'
            }
          });
          if (res.ok) {
            const buf = Buffer.from(await res.arrayBuffer());
            if (buf.length > 1200) {
              fs.writeFileSync(target, buf);
              console.log(`[NextConfig] Downloaded cover: ${item.file} (${buf.length} bytes)`);
              break;
            }
          }
        } catch (e) {
          // try next url
        }
      }
    }
  }
}

const nextConfig = {
  /* config options here */
};

module.exports = async (phase, { defaultConfig }) => {
  try {
    await downloadMissingCovers();
  } catch (err) {
    console.warn('Cover download in nextConfig:', err.message);
  }
  return nextConfig;
};
