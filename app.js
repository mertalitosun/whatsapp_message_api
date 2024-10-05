const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;


app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// WhatsApp mesajı gönderme fonksiyonu
async function sendWhatsAppMessage(phoneNumber, message) {
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        userDataDir: '/Users/mertalitosun/Library/Application Support/Google/Chrome/Profile 3'
    });

    // const page = await browser.newPage();
    const pages = await browser.pages();
    const page = pages.length > 0 ? pages[0]  : await browser.newPage(); 

    await page.goto('https://web.whatsapp.com/', { waitUntil: 'networkidle2' });

    await page.waitForFunction(() =>  document.querySelector('div[title="Yeni sohbet"]') !== null);
    await page.evaluate(() => {
        const newChatButton = document.querySelector('div[title="Yeni sohbet"]');
        if (newChatButton) {
            newChatButton.click();
        }
    });
    console.log("Yeni sohbet butonuna tıklandı");

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

app.get("/send-message",(req,res)=>{
    res.render("index");
})

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
