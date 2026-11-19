# Artventure

Kişisel sanat atölyesi uygulaması (Türkçe). Kullanıcı 3D karakter sanatçısı; 2001 dönemi Pokémon/Beyblade cartoon estetiğinde kendi sanat dilini arıyor. Kullanıcıyla Türkçe konuş.

## Yapı
- `web/` uygulamanın kendisi (statik, derleme yok). GitHub Pages'ten yayınlanır: https://barangamga.github.io/Artventure/
  - `content.js`: tüm içerik (sanatçılar, konular, Merak Defteri, 4 haftalık program, Usta'nın kuralları ve öğrenci profili). Yeni içerik buraya eklenir.
  - `app.js`: görünümler, yerel kayıt (localStorage + IndexedDB), Usta sohbeti (Anthropic API, kullanıcının kendi anahtarı), güncelleme istemi.
  - `styles.css`: Usta'nın tema tokenları (gündüz/gece). Kontur siyah değil mor-kahve; saf beyaz ve saf siyah yok.
  - `sw.js` + `version.json`: güncelleme mekanizması.
- APK: Capacitor kabuğu, Pages adresini yükler. `.github/workflows/android.yml` derler ve "apk" sürümüne koyar. Kabuk yalnızca `capacitor.config.json`, `package.json` veya simge değişince yeniden derlenir.

## Güncelleme yayınlama (her içerik/tasarım değişikliğinde)
1. `web/` içinde değişikliği yap.
2. `web/sw.js` içindeki `VERSION` ve `web/version.json` içindeki `version` değerini AYNI yeni sürüme yükselt; `notes` alanına kullanıcının göreceği kısa Türkçe açıklamayı yaz.
3. Commit ve `main`'e push. Pages iş akışı yayınlar; telefondaki uygulama açıldığında "Yeni güncelleme hazır" sorar, "Güncelle"ye dokununca yüklenir.
Sürümü yükseltmezsen telefon değişikliği görmez.

## Usta
Sanat hocası mentor ajanı: `.claude/agents/usta.md`. Uygulama içeriği, tasarımı ve kullanıcının gelişimiyle ilgili kararlarda Usta'ya danış. Kullanıcı uygulamadan "Artventure verisi" başlıklı bir metin yapıştırırsa, Usta'ya analiz ettir ve önerilerini uygulamaya yansıt (bkz. usta.md'deki iş akışı).

## Kurallar
- Kişisel veriler (günlük, notlar, API anahtarı) asla depoya girmez; depo herkese açık.
- Uydurma bilgi yok; sanatçı biyografilerinde yalnızca emin olunan bilgiler ve kaynak bağlantısı.
- Telifli görseller depoya konmaz; bağlantı verilir.
- Türkçe karakterler (ğ ş ı İ ç ö ü) her yeni fontta test edilir.
