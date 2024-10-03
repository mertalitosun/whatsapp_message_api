const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

// JSON gövdesini ayrıştırmak için middleware
app.use(express.json());

// WhatsApp mesajı gönderme fonksiyonu
async function sendWhatsAppMessage(phoneNumber, message) {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    });
    const page = await browser.newPage();

    await page.goto('https://web.whatsapp.com/', { waitUntil: 'networkidle2' });

    console.log('QR kodunu tarayın ve ardından devam etmek için Enter tuşuna basın...');
    await page.waitForFunction(() =>  document.querySelector('div[title="Yeni sohbet"]') !== null);
    await page.evaluate(() => {
        const newChatButton = document.querySelector('div[title="Yeni sohbet"]');
        if (newChatButton) {
            newChatButton.click();
        }
    });
    console.log("Yeni sohbet butonuna tıklandı");

    // İletişim bilgilerini almak için WhatsApp arama kutusunu kullan

    const inputSelector = 'div[role="textbox"]';
    await page.waitForSelector(inputSelector) // Öğeyi bekle
    await page.type(inputSelector, phoneNumber); // Telefon numarasını yaz
    console.log("searchbar'a numara yazıldı");

    await new Promise(resolve => setTimeout(resolve, 1500));

    await page.keyboard.press('Enter');
    console.log("enter'a tıklandı")


    // Mesaj kutusunu bekle ve mesajı yaz
    await page.waitForSelector('div[aria-placeholder="Bir mesaj yazın"]');
    await page.type('div[aria-placeholder="Bir mesaj yazın"]', message); // Mesajı yaz
    await page.keyboard.press('Enter'); // Mesajı göndermek için enter tuşuna bas

    console.log(`Mesaj gönderildi: ${message} - ${phoneNumber}`);

    // await browser.close();
}

// Mesaj gönderme isteği için bir endpoint oluşturma
app.post('/send-message', async (req, res) => {
    const { phoneNumber, message } = req.body;
    if (!phoneNumber || !message) {
        return res.status(400).json({ error: 'Telefon numarası ve mesaj gerekli.' });
    }

    try {
        await sendWhatsAppMessage(phoneNumber, message);
        return res.status(200).json({ success: true, message: 'Mesaj gönderildi.',phone:phoneNumber, sentMessage:message });
    } catch (error) {
        console.error('Hata:', error);
        return res.status(500).json({ error: 'Mesaj gönderme sırasında bir hata oluştu.' });
    }
});

app.listen(port, () => {
    console.log(`Sunucu ${port} portunda çalışıyor`);
});
