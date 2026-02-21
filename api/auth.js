export default async function handler(req, res) {
    const { code } = req.query;

    // لو مفيش كود جاي من ديسكورد، نرجعه لصفحة الإدارة
    if (!code) {
        return res.redirect('/adminpanel.html');
    }

    try {
        // 1. طلب الـ Access Token من ديسكورد باستخدام البيانات المخفية في Vercel
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: `https://${req.headers.host}/api/auth`,
                scope: 'identify guilds.members.read',
            }),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
            console.error('Discord Token Error:', tokenData);
            return res.status(500).send("فشل الحصول على تصريح من ديسكورد.");
        }

        // 2. جلب بيانات المستخدم (اسمه والـ ID بتاعه)
        const userRes = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const userData = await userRes.json();

        // 3. التحقق من رتبة المستخدم داخل سيرفرك (GUILD_ID)
        const memberRes = await fetch(`https://discord.com/api/guilds/${process.env.GUILD_ID}/members/${userData.id}`, {
            headers: { Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}` }
        });
        
        const memberData = await memberRes.json();

        // 4. فحص هل الشخص يملك رتبة الإدارة (ADMIN_ROLE_ID)؟
        if (memberData.roles && memberData.roles.includes(process.env.ADMIN_ROLE_ID)) {
            // نجاح التحقق! نرسله للوحة الإدارة مع كلمة سر نجاح
            res.redirect('/adminpanel.html?auth=success');
        } else {
            // لو مش أدمن، نرفض دخوله
            res.status(403).send(`عذراً ${userData.username}، أنت لست أدمن في السيرفر!`);
        }

    } catch (error) {
        console.error('Auth Error:', error);
        res.status(500).send("حدث خطأ تقني أثناء التحقق.");
    }
}
