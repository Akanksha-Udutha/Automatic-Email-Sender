async function sendWithLimit(emails, callback) {
    for (let i = 0; i < emails.length; i++) {
        console.log(` Sending ${i + 1}/${emails.length} → ${emails[i]}`);
        await callback(emails[i]);
        await new Promise(resolve => setTimeout(resolve, 2000)); 
    }
}

module.exports = sendWithLimit;
