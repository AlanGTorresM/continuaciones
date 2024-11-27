import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
//supabase
//FesAragon2004.
const supabaseUrl = "https://kuwcitnkpoolemvawwel.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1d2NpdG5rcG9vbGVtdmF3d2VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwOTEwNjUsImV4cCI6MjA0NzY2NzA2NX0.NXZ1Y7SWRTPYBDC_bSXz1JJCkTzY5Hroe4X8ws3BeZY";
// Crear cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);

// /*                          PRUEBAS PARA VER SI CONECTA CON SUPABASE                         */
// async function pruebaConexion() {
//     try {
//         console.log('Intentando conectar con Supabase...');
//         const { data, error } = await supabase.from('users').select('*');
//         if (error) {
//             console.error('Error de Supabase:', error.message);
//         } else {
//             console.log('Conexión exitosa. Datos obtenidos:', data);
//         }
//     } catch (err) {
//         console.error('Error inesperado:', err);
//     }
// }
// pruebaConexion();

// // Obtener datos de sesión
// async function datosConexion() {
//     try {
//         console.log('Intentando obtener datos de sesión...');
//         const { data, error } = await supabase.from('users').select('*');
//         if (error) {
//             console.error('Error al obtener datos de sesión:', error.message);
//         } else {
//             console.log('Datos de sesión obtenidos:', data);
//         }
//     } catch (err) {
//         console.error('Error inesperado:', err);
//     }
// }
// datosConexion();