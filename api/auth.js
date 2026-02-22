const fetch = require('node-fetch');

export default async function handler(req, res) {
    const { code } = req.query;
    try {
        const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
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
        const tokenData = await tokenRes.json();

        // البوت يطلب بياناتك من السيرفر باستخدام الـ Intents
        const memberRes = await fetch(`https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${tokenData.user_id}`, {
            headers: { Authorization: `Bot ${process.env.BOT_TOKEN}` },
        });
        const memberData = await memberRes.json();
        
        // التحقق هل رتبة الإدارة (ROLE_ID) موجودة في حسابك؟
        const hasRole = memberData.roles && memberData.roles.includes(process.env.ROLE_ID);
        res.status(200).json({ hasRole: !!hasRole });
    } catch (err) { res.status(500).json({ hasRole: false }); }
}
