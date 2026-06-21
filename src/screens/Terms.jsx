// src/screens/Terms.jsx
import { useMemo, useState } from 'react';

const TERMS = [
  {
    term: 'Menstrüel Faz (Regl)',
    short: 'Rahim iç zarının (endometriyum) döküldüğü kanama dönemi.',
    detail:
      'Döngünün 1. günü kabul edilir. Hormon seviyeleri (östrojen, progesteron) en düşük noktadadır. ' +
      'Genellikle 3-7 gün sürer; 7 günden uzun veya çok yoğun kanama tıbbi değerlendirme gerektirebilir.',
    category: 'Faz',
  },
  {
    term: 'Foliküler Faz',
    short: 'Yumurtalıklarda foliküllerin geliştiği, östrojenin yükseldiği dönem.',
    detail:
      'Regl döneminin başlangıcından yumurtlamaya kadar sürer. Beyin (hipofiz bezi) FSH hormonu ' +
      'salgılayarak yumurtalıkta birkaç folikülün gelişmesini tetikler; genelde bunlardan biri baskın hale gelir. ' +
      'Bu fazın uzunluğu kişiden kişiye en çok değişen fazdır, bu yüzden döngü uzunluğu farklılıkları ' +
      'çoğunlukla buradan kaynaklanır.',
    category: 'Faz',
  },
  {
    term: 'Ovülasyon (Yumurtlama)',
    short: 'Olgunlaşmış yumurtanın yumurtalıktan salındığı an.',
    detail:
      'Luteinleştirici hormon (LH) ani yükselişi (LH surge) yumurtlamayı tetikler. Yumurta salındıktan sonra ' +
      'yaklaşık 12-24 saat döllenebilir durumda kalır. Yumurtlama günü genelde bir sonraki reglden geriye doğru ' +
      'sayılarak (luteal faz uzunluğu çıkarılarak) tahmin edilir, çünkü luteal faz kişide nispeten sabittir.',
    category: 'Faz',
  },
  {
    term: 'Luteal Faz',
    short: 'Yumurtlamadan bir sonraki regle kadar olan dönem.',
    detail:
      'Yumurtlama sonrası boşalan folikül "korpus luteum"a dönüşüp progesteron salgılamaya başlar. ' +
      'Bu faz çoğu kadında 12-14 gün sürer ve döngüden döngüye fazla değişmez. Gebelik oluşmazsa ' +
      'korpus luteum gerilemeye başlar, progesteron düşer ve yeni regl başlar.',
    category: 'Faz',
  },
  {
    term: 'Doğurgan Pencere',
    short: 'Cinsel ilişki sonucu gebelik ihtimalinin bulunduğu gün aralığı.',
    detail:
      'Sperm rahim ve tüplerde yaklaşık 5 güne kadar canlı kalabilir, yumurta ise salındıktan sonra ' +
      '12-24 saat döllenebilir. Bu nedenle doğurgan pencere, yumurtlamadan 5 gün önce başlayıp ' +
      'yumurtlama gününün ertesi günü sona erer. En yüksek gebelik ihtimali yumurtlamadan 1-2 gün ' +
      'önceki günlerdedir.',
    category: 'Doğurganlık',
  },
  {
    term: 'Döngü Uzunluğu',
    short: 'Bir regl başlangıcından bir sonraki regl başlangıcına kadar geçen gün sayısı.',
    detail:
      '21-35 gün arası tıbbi olarak normal kabul edilir (ortalama 28 gün). Stres, kilo değişimi, ' +
      'yoğun egzersiz, bazı sağlık durumları (ör. PKOS, tiroid sorunları) döngü uzunluğunu etkileyebilir. ' +
      'Sürekli 21 günden kısa veya 35 günden uzun döngüler için bir kadın hastalıkları uzmanına danışmak önerilir.',
    category: 'Genel',
  },
  {
    term: 'Gecikmiş Regl',
    short: 'Beklenen tarihten sonra reglin başlamamış olması.',
    detail:
      'Tek seferlik birkaç günlük gecikmeler genelde endişe verici değildir ve stres, seyahat, uyku düzeni ' +
      'gibi nedenlerle olabilir. Gebelik ihtimali varsa test yapılması önerilir. Tekrarlayan gecikmeler ' +
      'hormonal nedenlerle ilişkili olabilir; uzun süren gecikmelerde bir uzmana danışılmalıdır.',
    category: 'Genel',
  },
  {
    term: 'PMS (Premenstrüel Sendrom)',
    short: 'Regl öncesi luteal fazda görülen fiziksel ve duygusal belirtiler.',
    detail:
      'Şişkinlik, göğüs hassasiyeti, ruh hali değişimleri, yorgunluk, baş ağrısı gibi belirtileri içerir. ' +
      'Progesteron ve östrojen seviyelerindeki düşüşle ilişkilendirilir. Günlük yaşamı ciddi şekilde ' +
      'etkileyen şiddetli belirtiler "PMDD" (Premenstrüel Disforik Bozukluk) olarak adlandırılır ve ' +
      'tıbbi değerlendirme gerektirir.',
    category: 'Semptom',
  },
  {
    term: 'Bazal Vücut Sıcaklığı (BVS)',
    short: 'Sabah uyanır uyanmaz, hiçbir aktivite yapmadan ölçülen vücut sıcaklığı.',
    detail:
      'Yumurtlama sonrası progesteron artışıyla BVS yaklaşık 0,2-0,5°C yükselir ve luteal faz boyunca ' +
      'yüksek kalır. Bu yükseliş yumurtlamanın gerçekleştiğini geriye dönük olarak doğrulamak için ' +
      'kullanılabilir (yumurtlama gününü önceden tahmin etmez, sonradan teyit eder).',
    category: 'Doğurganlık',
  },
  {
    term: 'Servikal Mukus',
    short: 'Rahim ağzından salgılanan ve doğurganlık döngüsüyle değişen akıntı.',
    detail:
      'Yumurtlamaya yaklaşırken östrojen etkisiyle mukus daha bol, kaygan ve yumurta akına benzer hale gelir ' +
      '(spermin hareketini kolaylaştırır). Yumurtlama sonrası progesteron etkisiyle mukus kalınlaşır ve azalır. ' +
      'Bu değişimi takip etmek doğal aile planlaması yöntemlerinden biridir.',
    category: 'Doğurganlık',
  },
  {
    term: 'Akış Yoğunluğu',
    short: 'Regl kanamasının miktarını tanımlayan ölçek (hafif, orta, yoğun).',
    detail:
      'Ortalama kan kaybı bir regl döneminde 30-80 ml civarındadır. Saatte bir pedi/tamponu dolduran ' +
      've birkaç saatten uzun süren çok yoğun kanama (menoraji) tıbbi değerlendirme gerektirebilir.',
    category: 'Semptom',
  },
  {
    term: 'Amenore',
    short: 'Reglin hiç başlamamış olması veya 3 aydan uzun süre kesilmesi.',
    detail:
      'Birincil amenore: 15 yaşına kadar hiç regl görmemiş olma. İkincil amenore: daha önce düzenli regl ' +
      'gören birinde reglin 3 ay veya daha uzun süre kesilmesi (gebelik hariç). Yoğun egzersiz, düşük vücut ' +
      'ağırlığı, stres, hormonal bozukluklar gibi nedenleri olabilir; bir uzmana danışılmalıdır.',
    category: 'Genel',
  },
];

const CATEGORIES = ['Tümü', 'Faz', 'Doğurganlık', 'Semptom', 'Genel'];

export default function Terms() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tümü');
  const [openTerm, setOpenTerm] = useState(null);

  const filtered = useMemo(() => {
    return TERMS.filter((t) => {
      const matchesCategory = category === 'Tümü' || t.category === category;
      const matchesQuery =
        !query.trim() ||
        t.term.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr')) ||
        t.short.toLocaleLowerCase('tr').includes(query.toLocaleLowerCase('tr'));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="px-5 pt-8 animate-riseIn">
      <header className="mb-6">
        <p className="text-sm text-muted font-medium">Terimler</p>
        <h1 className="font-display text-2xl font-semibold mt-0.5">Tıbbi Sözlük</h1>
        <p className="text-sm text-muted mt-1.5 leading-relaxed">
          Uygulamada geçen terimlerin kısa, anlaşılır açıklamaları.
        </p>
      </header>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Terim ara..."
        className="w-full bg-surface rounded-2xl px-4 py-3 text-sm mb-4 border border-line focus:outline-none focus:ring-2 focus:ring-primary/40"
      />

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-5 px-5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border ${
              category === c ? 'bg-primary text-white border-primary' : 'bg-surface text-muted border-line'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {filtered.map((t) => {
          const isOpen = openTerm === t.term;
          return (
            <div key={t.term} className="bg-surface rounded-2xl shadow-card overflow-hidden">
              <button
                onClick={() => setOpenTerm(isOpen ? null : t.term)}
                className="w-full text-left px-4 py-3.5 flex items-start justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-semibold">{t.term}</p>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{t.short}</p>
                </div>
                <span className={`text-muted text-lg shrink-0 transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 -mt-1">
                  <p className="text-xs text-ink leading-relaxed bg-surface2 rounded-xl p-3">{t.detail}</p>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted text-center py-8">Sonuç bulunamadı.</p>
        )}
      </div>

      <p className="text-[11px] text-muted text-center mt-6 leading-relaxed px-2">
        Bu açıklamalar genel bilgilendirme amaçlıdır, tıbbi tavsiye yerine geçmez. Kendi durumunla
        ilgili sorularda bir sağlık uzmanına danış.
      </p>
    </div>
  );
}
