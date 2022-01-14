module.exports = {
    slugifyText:function(text) {
        return text.toLowerCase()
             .replace(/ /g, '-')
             .replace(/[^\w-]+/g, '');
    },
    determinePageDialog: function(){
        if (typeof window === "undefined") {
            console.log("Oops, `window` is not defined")
        }
        return window.innerWidth <= 390 ? 'page': 'dialog';
    },
    otpCheck: function(n1, n2, n3, n4){
        // This mocks a otp request.

        const defaultOtp = "1234";
        var recievedOtp = `${n1}${n2}${n3}${n4}`; 

        console.log(recievedOtp);

        return defaultOtp === recievedOtp;
    },
    getSecureUserObj: function (user){
        return {
            id: user.id,
            phoneNumber:user.phone_number,
            firstName: user.first_name,
            lastName: user.last_name,
            userImage: user.user_image,
            cartItems: []
        }
    }
}