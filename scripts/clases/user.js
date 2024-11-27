class User {
    static idCounter = 1;

    constructor(name, email, password, cellphone) {
        this.id = User.idCounter++;
        this.name = name;
        this.cellphone = cellphone;
        this.email = email;
        this.password = password;
        this.isLoggedIn = false;
        this.isSeller = false;
        this.wishlist = [];
        this.productsBought = [];
        this.cart = [];
    }
}