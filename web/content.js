/* Artventure içerik dosyası. Yeni sanatçı, konu, görev ve yazılar buraya eklenir. */
/* =========== İÇERİK =========== */
const L=(t,u)=>`<a class="src" href="${u}" target="_blank" rel="noopener">${t}</a>`;
const C={cel:"var(--cel)",peach:"var(--peach)",pink:"var(--pink)",sage:"var(--sage)",blue:"var(--blue)",shade:"var(--shade)"};
/* Sanatçılar kultur.js dosyasında. */
const TOPICS=[
{id:"dongu",cat:"Yöntemim",c:C.sage,title:"Karakterden doğan dünya",sum:"Senin yaratıcı döngün",
 body:`<p>Sen sahne kurup karakter yerleştirmiyorsun. Karakteri izliyorsun ve dünya onun davranışlarının sonucu olarak beliriyor.</p><ol class="tight"><li>Karakterin niyeti</li><li>Fiziksel engel ya da olay</li><li>Karakterin tepkisi</li><li>Çevrede yeni bir ayrıntı</li><li>Tasarım ya da işlev sorunu</li><li>Estetik çözüm</li><li>Yeni merak</li></ol><p><b>Yaşat → Güzelleştir:</b> Önce merakla küçük, hızlı, silgisiz anlar yakala. Sonra ayrı bir oturumda en ilginç olanı seç ve formu, rengi, gölgeyi geliştir.</p><p class="note">Görselleştirmen güçlü. Üzerinde çalışacağımız şey, o akışı kâğıda aktarırken kaybetmemek.</p>`},
{id:"formsoz",cat:"Form sözlüğü",c:C.peach,title:"Form sözlüğü",sum:"S/C eğrisi, tapering, ritim, hiyerarşi",
 body:`<p><b>C eğrisi:</b> Hacmi sarar. <i>30 sn:</i> Bir yanağı tek bir C ile değil, yarıçapı değişen iki C ile çiz.</p><p><b>S eğrisi:</b> Yön ve akış verir. <i>30 sn:</i> Bir kulağı tek bir S ile çiz.</p><p><b>Tapering:</b> Form incelerek biter; parmak tabanda geniş, uçta ince, boğumda hafif şişkin. <i>30 sn:</i> 5 parmak, hepsi farklı kalınlıkta.</p><p><b>Ritim:</b> Bir form genişlerken komşusu daralır, biri taşarken diğeri içeri çekilir.</p><p><b>Form hiyerarşisi:</b> Büyük, orta, küçük formlar birbirini destekler.</p><p><b>Squash & stretch:</b> Korkunca sıkışır, merak edince uzar. Duygu formu değiştirir.</p><p><b>Kontrast:</b> Yumuşak-sert, ince-kalın, sade-süslü.</p><p class="note">Yumuşak form çizmek sürekli yuvarlak çizmek değildir. Bir tarafı neredeyse düz, diğeri yuvarlak olan form daha organik hissedilir.</p>`},
{id:"renk",cat:"Teknik",c:C.blue,title:"Renk dili",sum:"Kontrollü doygunluk, sıcak-soğuk, formu takip eden gölge",
 body:`<ul class="tight"><li><b>Kontrollü doygunluk:</b> Her renk aynı anda bağırmaz; güçlü renk, sakin komşuları sayesinde öne çıkar.</li><li><b>Sıcak-soğuk:</b> Sıcak şeftali tenin gölgesinde hafif morumsu bir ton.</li><li><b>Formu takip eden gölge:</b> Yanağın nerede şiştiğini, göbeğin nerede döndüğünü anlatır. Net ama doğru yerleştirilmiş bir gölge şekli, bulanık gölgeden daha çok hacim anlatır.</li></ul><div class="sw"><span><i style="background:#7B4A8E"></i>derin mor</span><span><i style="background:#8CA5DD"></i>tozlu mavi</span><span><i style="background:#F0A0A8"></i>mercan pembe</span><span><i style="background:#F3D08B"></i>kremsi sarı</span><span><i style="background:#9CBAB3"></i>adaçayı teal</span></div><p class="note">Bu, kendi seçtiğin Artventure paleti. Utangaç bir sahne için şeftali ve krem, gizemli bir keşif için soluk mavi ve mor dene.</p>`},
{id:"cizgi",cat:"Teknik",c:C.cel,title:"Cel kontur ve gölge",sum:"Tek kalınlıkta çizgi, tek ton gölge",
 body:`<p>Her kare elle yeniden çizildiği için çizgi sade ve eşit kalınlıkta. Hacmi çizgi değil gölge verir.</p><ul class="tight"><li>Her renk için bir ana ton, bir gölge tonu (kage).</li><li>Gölge sınırı sert ve bir şekil gibi tasarlanır.</li><li>Saçta ve gözde tek bir parlama.</li></ul><p>Eski Pokémon'da karakter yalnızca iki tonla boyanmış olabilir, ama silüet, perspektif ve parçaların üst üste binmesi sayesinde hacimli görünür.</p>`},
{id:"arka",cat:"Teknik",c:C.blue,title:"Elle boyanmış arka plan",sum:"Poster boya, fırça izi, düz karakter",
 body:`<p>Karakterler düz renk, arka planlar poster boya ve guajla boyanmış resimler. Bu kontrast karakteri sahneden ayırır.</p><ul class="tight"><li>Yüksek ufuk, geniş gökyüzü, kümülüs bulutlar.</li><li>Uzaklaştıkça mavileşen dağlar.</li><li>Karakterin duracağı yer sade bırakılır.</li></ul>`},
{id:"mekanik",cat:"Tasarım",c:C.shade,title:"Mekanik tasarım: Beyblade",sum:"Katmanlı oyuncak, içindeki ruh",
 body:`<p>Beyblade, Japonya'nın geleneksel <b>beigoma</b> topaçlarından esinlenir. Parçaları katmanlıdır: bit-chip, attack ring, weight disk, blade base. Her bey'in bir <b>bit-beast</b>'i vardır; Dragoon, Dranzer, Driger ve Draciel, Çin mitolojisinin dört yön koruyucusundan esinlenir.</p><p>Sert bir formun içinde zarif akış aramak senin kapı tasarımındaki yaklaşımla aynı: sert gri metal, S/C eğrileriyle zarifleşir.</p>`},
{id:"aura",cat:"Bakış",c:C.peach,title:"Formdan gelen karizma",sum:"Eski ve yeni anime arasındaki fark",
 body:`<ul class="tight"><li><b>Formdan gelen karizma:</b> Silüet, duruş, oran ve beden dili zaten güçlü; efekt olmadan da ilginç.</li><li><b>Sunumdan gelen karizma:</b> Etki ışık, efekt, kurgu ve kameradan gelir.</li></ul><p>En güçlü işler ikisini birleştirir. Modern animede de basit şekillerle güçlü ifade kuran örnekler var: Mob Psycho 100 ve Ranking of Kings.</p><p class="note">Stilizasyon sadeleştirme değildir. Gerçek formu bilinçli olarak değiştirmek, abartmak ve yeni bir dil kurmaktır.</p>`}
];

const PERSPECTIVES=[
{id:"hayal",mode:"kesif",title:"Hayal dünyaları",body:`<p>Pokémon'un dünyası tanıdık bir dünyanın içine saklanmış bir sürprizdir. Beyblade'in büyüsü ise gündelik bir oyuncağın içindedir. Senin uzaylın da sıradan bir odayı bir keşif alanına çeviriyor.</p><p>Senin günlük hayatında büyü nerede saklanıyor?</p>`},
{id:"duygu",mode:"kesif",title:"Duygu formu değiştirir",body:`<p>Uzaylı korkunca tavana yapışır: gövde sıkışır, yanaklar yukarı çıkar, kollar bedene yaklaşır. Merak edince aşağı uzanır: gövde esner, boyun uzar, parmaklar açılır.</p><p>Form çalışırken ona bir neden ver. Başlangıç noktan geometri değil, karakterin o anki duygusu olabilir.</p>`},
{id:"bos",mode:"kesif",title:"Boş kâğıtla arkadaş olmak",body:`<p>"Şimdi güzel bir karakter tasarlayacağım" demek zihne büyük bir görev verir. Senin için ilham bir görüntüyle değil, bir soruyla başlıyor olabilir: <b>"Acaba şimdi ne yapacak?"</b></p><p>Kişisel çizimde hiçbir şeyin kullanılabilir olması gerekmez. Bir saat boyunca sadece güzel eğriler çizebilirsin.</p>`},
{id:"dunya",mode:"analiz",title:"Dünyaya bakış",body:`<p>Pokémon'da canlılar düşman değil, tanışılacak varlıklardır. Beyblade'de rakip çoğu zaman sonunda dosta dönüşür.</p><p>Çizerken nesneyi "kopyalanacak bir şey" değil, "tanınacak bir varlık" olarak görmeyi dene.</p>`},
{id:"calisma",mode:"analiz",title:"Çalışma stilleri",body:`<p>O dönemin animasyonu bir ekip sanatıdır: tasarımcı kuralları yazar, animatör uygular, arka plan ressamı dünyayı boyar, yönetmen ritmi kurar.</p><ul class="tight"><li><b>Analiz modu:</b> Referansa bakarken sanatçının hangi kararı verdiğine odaklan. Neden bu yanak böyle?</li><li><b>Keşif modu:</b> Güzel çizim zorunluluğu yok. Formları esnet, şişir, birleştir. Yargılama.</li></ul><p>İkisini aynı anda yapmaya çalışırsan her çizgini düzeltmeye başlarsın.</p>`},
{id:"zevk",mode:"analiz",title:"Zevkin elinden hızlı",body:`<p>Görsel beğenin, o dili kendiliğinden üretebilme becerinden daha hızlı gelişmiş olabilir. Bu normal ve iyi bir işaret.</p><p>Çözüm ilhamı beklemek değil; sevdiğin estetiği oluşturan kararları kendi zihninin kullanabileceği bir dile çevirmek. Kişisel Sanat Dilim sayfası bunun için.</p>`}
];

const SOURCES=[
{cat:"Kitap",items:[`<b>The Illusion of Life</b> · Frank Thomas & Ollie Johnston. Disney'in animasyon ilkelerinin (squash & stretch, anticipation, staging, appeal) kaynağı.`]},
{cat:"Ansiklopediler",items:[L("Bulbapedia · Pokémon animesi","https://bulbapedia.bulbagarden.net/wiki/Pok%C3%A9mon_the_Series"),L("Beyblade Wiki","https://beyblade.fandom.com/wiki/Beyblade_Wiki")]},
{cat:"Hareket",items:[L("Sakugabooru · Pokémon","https://www.sakugabooru.com/post?tags=pokemon"),L("Sakugabooru · Beyblade","https://www.sakugabooru.com/post?tags=beyblade")]},
{cat:"Cel ve settei",items:[L("ポケモン セル画 背景","https://www.google.com/search?tbm=isch&q=%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3+%E3%82%BB%E3%83%AB%E7%94%BB+%E8%83%8C%E6%99%AF"),L("ポケモン アニメ 設定資料","https://www.google.com/search?tbm=isch&q=%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3+%E3%82%A2%E3%83%8B%E3%83%A1+%E8%A8%AD%E5%AE%9A%E8%B3%87%E6%96%99"),"Anahtar kelimeler: セル画 cel · 設定資料 model sayfası · 背景美術 arka plan · 原画 ana kare"]}
];

const BIBLE_DEFAULT=[
{k:"siluet",t:"Organik silüet",d:"Eğriler, değişken genişlikler, asimetrik kütleler."},
{k:"hacim",t:"Hissedilen hacim",d:"Üst üste binen formlar, ağırlık, sıkışma."},
{k:"gecis",t:"Zarif geçişler",d:"C/S eğrileri, incelerek biten formlar."},
{k:"renk",t:"Sakin renkler",d:"Kontrollü doygunluk, sıcak ana tonlar."},
{k:"golge",t:"Hacim odaklı gölge",d:"Okunaklı gölge şekilleri, seçici yumuşak geçişler."}
];

const MERAK=[
["Mutfak tezgâhı","Kaynayan çaydanlığın düdüğü ona ne anlatıyor?"],
["Banyo","Musluktan damlayan su nereden geliyor? Lavabo deliği nereye gidiyor?"],
["Çamaşır sepeti","Bir çorap tek başına neden burada? Eşi nerede?"],
["Pencere pervazı","Saksıdaki bitki dokununca neden kıpırdamıyor?"],
["Kitaplık","Bu kalın kutuların içinde neden sadece kâğıt var? Hangisi en ağır?"],
["Ayakkabılık","Bu kocaman kabuklar kimin? İçine girersem ne olur?"],
["Gece salon","Kumandaya basınca ışıklı kutuda biri belirdi. Saklanmalı mı, selam mı vermeli?"]
];

const WEEKS=[
{t:"Form Bahçesi + silüet",days:["Form Bahçesi: 10 organik şekil, silgisiz. Hangisine dokunmak isterdin?","Sugimori'den 3 form seç, üzerine C ve S eğrilerini işaretle.","Referansı kapat, aynı 3 formu hafızandan çiz.","Bir formun 3 varyasyonu: şişkin, ezilmiş, uzamış.","Uzaylını siyah silüet olarak 5 pozda çiz. Hepsi okunuyor mu?","Bir tarafı düz, bir tarafı yuvarlak 10 form.","Haftanın en sevdiğin formunu seç ve neden güzel hissettirdiğini yaz."]},
{t:"Davranış ve duygu",days:["Merak, keşif, dinlenme: uzaylının 3 küçük sahnesi.","Korkunca sıkışan, merak edince uzayan beden: 2 kare.","Kulakların 6 farklı duygudaki hâli.","Saklanıp merakına yenilip kafasını çıkardığı 3 kare.","Kavanoz sahnesinden 3 anı yakala.","Ağır bir şeyi ittiği 3 kare. Ağırlık nerede görünüyor?","Bir hayal kırıklığı anı: kavanoz boş."]},
{t:"Mekân ve prop",days:["Kapı kulpunu ön ve üç çeyrek açıdan birkaç çizgiyle çiz.","Kulpun gri metal bağlantısını ve S/C süslemesini çiz.","İki kanadın birleşen desenini uzaktan bakış olarak çiz.","Dantel örtü, cam şişe ve bardak: kavanoz sahnesinin propları.","Bir kayayı şişkin, erozyona uğramış kütlelerden tasarla.","Uzaylının saklandığı bir köşeyi karakter olmadan boya.","Kamera yere yakın: dev kapının önündeki küçük uzaylı."]},
{t:"Renk + mini sahne",days:["Sugimori suluboyasından 5 renk çifti çıkar.","Bir formu tek renk, sonra ana + gölge + vurgu ile boya.","Aynı sahneyi sıcak ve soğuk iki paletle boya.","Utangaç sahne: şeftali ve krem.","Gizemli keşif: soluk mavi ve mor.","Mini sahnenin thumbnail'ları: 3 kompozisyon.","Mini sahneyi Yaşat → Güzelleştir ile bitir."]}
];

const PROMPTS=["Bir gerçek hayvanı üç yuvarlak şekle indir, tek bir vurgu rengi ver.","Odadaki bir eşyaya bir ruh ver. Uzaylın onunla nasıl tanışır?","Uzaylın bir şeyi ters çevirip altına bakıyor. Ne buluyor?","Hiçbir şey bulamayıp sıkılan uzaylı yerdeki küçük bir çatlağı inceliyor.","Uzaylın duvarda yürüyor. Kulakları nasıl davranır?","Çocukken en sevdiğin sahneyi 10 dakika hafızandan çiz, sonra orijinaliyle karşılaştır.","Bir ağaç kovuğuna kafasını sokuyor. Esnek kafatası nasıl davranır?","Uzaylın ilk kez bir oyuncak görüyor. Her tarafını inceliyor."];
const FEEL=["merak","coşku","huzur","nostalji","akış","sıkışmış","yorgun","kararsız","kırılgan","özgür"];
const NEED=["oyun","dinlenme","yapı","cesaret","ilham","yalnızlık","paylaşım","sabır","zaman"];

const USTA_RULES=`Sen "Usta"sın: sanat hocası ve çizgi film yönetmeni bir mentor. Klasik animasyon ilkeleri, character acting, staging, 1997-2003 cel dönemi Japon animasyonu (Pokémon, Beyblade, Sugimori, erken Toriyama, Miyazaki), karakter/mekân/prop tasarımı, renk teorisi ve 3D karakter sanatında derin bilgin var.
KURALLAR:
1. Türkçe konuş. Sıcak, kısa, somut ol; çoğunlukla 150 kelimenin altında.
2. Önce soru sor: "Karakterin burada ne istiyor?" Davranıştan başla, sahneden değil.
3. Tasarımı asla öğrencinin yerine bitirme. En fazla 2-3 yön göster, seçimi ona bırak.
4. Boş kâğıt tıkanmasında küçült: tek niyet, tek engel, 5 dakikalık görev.
5. Keşif modunda eleştirme, merakı besle. Analiz modunda dürüst ol: önce güçlü olanı, sonra tek bir gelişim noktasını söyle.
6. Geri bildirimi öğrencinin kendi sanat dili ilkeleri üzerinden ver; kendi zevkini dayatma.
7. Önerileri üç katmandan birine bağla: kültür (sanatçı/eser), bilgi (ilke), beceri (egzersiz). Genelde bir öneri, bir egzersiz yeter.
8. Uydurma bilgi verme. Emin olmadığın tarih, künye, alıntıda "emin değilim" de.
9. Döngüyü kullan: niyet → engel → tepki → ayrıntı → tasarım sorunu → estetik çözüm → yeni merak. Hep bir sonraki merakla bitir.
10. 3D geçmişini bir güç olarak kullan: "Bunu bir model gibi döndürsen hacim nerede şişer?"
11. Duygusal tıkanmada önce kabul et, sonra en küçük adımı öner. Terapist gibi davranma.
12. Markdown başlık ve tablo kullanma; düz, sohbet gibi yaz.`;
/* Kişisel profil koda konmaz; kullanıcı Ayarlar > Benim dünyam alanına yazar (yalnızca telefonda saklanır). */
const PROFILE=`ÖĞRENCİ: Türkçe konuşan bir 3D karakter sanatçısı; eski Pokémon/Beyblade estetiğinde kendi sanat dilini arıyor.`;

