import { supabase } from './Base de datos/supabase.js';

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

    async register() {
        // Validación básica
        if (!this.name || !this.email || !this.password || !this.cellphone) {
            throw new Error('Todos los campos son obligatorios.');
        }

        // Crear el objeto del usuario
        const newUser = {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            cellphone: this.cellphone,
            is_logged_in: true,
            is_seller: this.isSeller,
            wishlist: this.wishlist,
            products_bought: this.productsBought,
            cart: this.cart,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // Insertar en la base de datos
        const { data, error } = await supabase
            .from('users')
            .insert([newUser]);

        if (error) {
            console.error('Error al registrar el usuario:', error.message);
            throw error;
        }

        console.log('Usuario registrado:', data);
        return data;
    }
}

export default User;
