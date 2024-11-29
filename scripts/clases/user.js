import { supabase } from './../Base de datos/supabase.js';
class User {
    constructor(name, email, password, cellphone, id=undefined) {
        this.id = id;
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
            name: this.name,
            email: this.email,
            password: this.password,
            cellphone: this.cellphone,
            is_logged_in: this.isLoggedIn,
            is_seller: this.isSeller,
            wishlist: this.wishlist,
            products_bought: this.productsBought,
            cart: this.cart,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
    
        // Insertar en la base de datos
        const { data, error } = await supabase
            .from('users')
            .insert([newUser])
            .select('id, name, email'); // Recuperar el ID generado
    
        if (error) {
            console.error('Error al registrar el usuario:', error.message);
            throw error;
        }
    
        // Asignar el ID a la instancia del User después de la inserción
        this.id = data[0].id; // Acceder al ID del primer objeto en el array 'data'
    
        console.log('Usuario registrado:', data);
        return data[0]; // Retorna el primer registro (la fila recién creada)
    }

    
    // Método para iniciar sesión
    static async login(email, password) {
        if (!email || !password) {
            throw new Error('El correo y la contraseña son obligatorios.');
        }

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (error) {
            console.error('Error al iniciar sesión:', error.message);
            throw new Error('Error al intentar iniciar sesión.');
        }

        if (!data || data.password !== password) {
            throw new Error('Credenciales incorrectas.');
        }

        console.log('Inicio de sesión exitoso:', data);
        return new User( data.name, data.email, data.password, data.cellphone, data.id); // Crea una instancia de User
    }
}

export default User;
