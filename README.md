# WhatsApp Mesaj Gönderme Uygulaması
Bu proje, Node.js ve Puppeteer kullanarak WhatsApp üzerinden mesaj göndermek için bir API oluşturur. Kullanıcılar, belirli bir telefon numarasına mesaj gönderebilir.

## Özellikler
- WhatsApp Web arayüzü üzerinden mesaj gönderme.
- Kullanıcıdan telefon numarası ve mesaj metni alma.
- JSON formatında mesaj gönderme isteği ile API'ye erişim.

## Kurulum

**Depoyu Klonlayın:**
```bash
git clone https://github.com/mertalitosun/proje_adi.git
```
**Gerekli Paketleri Yükleyin:**
```bash
npm install
```

**Sunucuyu Başlatın:**
```bash
node index.js
veya
npm start
```
**Mesaj Gönderme İsteği Yapın: Aşağıdaki örnek JSON formatını kullanarak bir POST isteği gönderin:**
```bash
POST http://localhost:3000/send-message
Content-Type: application/json

{
    "phoneNumber": "905xxxxxxxxx",
    "message": "Merhaba, bu bir test mesajıdır."
}
```