// كود الـ Backend في Vercel (auth.js)
const fetch = require('node-fetch');

export default async function handler(req, res) {
    const { code } = req.query;
    const GUILD_ID = process.env.GUILD_ID;
    const ROLE_ID = process.env.ROLE_ID;
    const BOT_TOKEN = process.env.BOT_TOKEN;

    try {
        // 1. تبديل الكود بـ Access Token من ديسكورد
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.CLIENT_ID,
                client_secret: process.env.CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.REDIRECT_URI,
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const tokenData = await tokenResponse.json();
        
        // 2. جلب بيانات العضو من السيرفر باستخدام البوت
        const memberResponse = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/members/${tokenData.user_id}`, {
            headers: { Authorization: `Bot ${BOT_TOKEN}` },
        });
        
        const memberData = await memberResponse.json();

        // 3. التحقق هل العضو معاه الرتبة؟ (أو هل هو صاحب السيرفر؟)
        const hasRole = memberData.roles && memberData.roles.includes(ROLE_ID);
        const isOwner = memberData.user && memberData.user.id === process.env.OWNER_ID;

        if (hasRole || isOwner) {
            return res.status(200).json({ hasRole: true, token: tokenData.access_token });
        } else {
            return res.status(403).json({ hasRole: false });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
