
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse env file handling potential messy newlines
function getEnv() {
    try {
        const content = fs.readFileSync('.env.local', 'utf8');
        // Simple heuristic: Join all lines and start stripping
        const cleanContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        let url = '';
        let key = '';

        // Regex to find URL
        const urlMatch = cleanContent.match(/NEXT_PUBLIC_SUPABASE_URL=([^\s]+)/);
        if (urlMatch) url = urlMatch[1];

        // Regex to find Anon Key
        const keyMatch = cleanContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=([^\s]+)/);
        if (keyMatch) key = keyMatch[1];

        // Fallback for Service Role if Anon is missing (just for testing!)
        if (!key) {
            const serviceMatch = cleanContent.match(/SUPABASE_SERVICE_ROLE_KEY=([^\s]+)/);
            if (serviceMatch) {
                console.log("Using SERVICE ROLE KEY (Anon key not found)");
                key = serviceMatch[1];
            }
        }

        return { url, key };
    } catch (e) {
        console.error("Error reading env:", e);
        return { url: '', key: '' };
    }
}

async function testSignup() {
    const { url, key } = getEnv();
    console.log('Testing with URL:', url);
    console.log('Testing with Key Length:', key ? key.length : 0);

    if (!url || !key) {
        console.error("Missing credentials");
        return;
    }

    const supabase = createClient(url, key);
    const testEmail = `test_${Date.now()}@example.com`;
    const checkEmail = 'hana@gmail.com';

    console.log(`Attempting signup with ${testEmail}...`);

    const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'password123'
    });

    if (error) {
        console.error('Signup Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('Signup Success:', data);
    }

    console.log(`\nAttempting signup with ${checkEmail}...`);
    const { data: data2, error: error2 } = await supabase.auth.signUp({
        email: checkEmail,
        password: 'password123'
    });

    if (error2) {
        console.error('Signup Error:', JSON.stringify(error2, null, 2));
    } else {
        console.log('Signup Success:', data2);
    }
}

testSignup();
