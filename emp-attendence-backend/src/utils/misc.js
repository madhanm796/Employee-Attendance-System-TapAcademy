const validEmail = (email) => {
    const emailRegexMoreRestrictive = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegexMoreRestrictive.test(email);
}

module.exports = validEmail;