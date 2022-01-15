
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
    },
    calculateDiscount(total, discountVal){
        return parseFloat(total*(discountVal/100)).toFixed(2);
    },
    checkIdinArray(array, id){
        return array.some(function(el) {
            return el.id === id;
        });
    },
    getObjectIndexByIdFromArray(array, id){
        return array.findIndex(obj => {
            return obj.id === id;
        });
    },
    getObjectByIdFromArray(array, id){
        return array.find(obj => {
            return obj.id === id;
        });
    },
    formatAddress(address){
        return `${address.name}<br>${address.phone}<br>${address.address_1}<br>${address.address_2}<br>${address.suburb},${address.city}<br>${address.post_code}`;
    }
}