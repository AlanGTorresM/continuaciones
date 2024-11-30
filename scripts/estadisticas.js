import { verificarLogin } from "./login.js";
import { supabase } from "./Base de datos/supabase.js";

verificarLogin();

const user = JSON.parse(localStorage.getItem("user"));
const userId = user.id;

const barChart = document.getElementById("barChart").getContext("2d");
let chart;

// Función para cargar datos de la base de datos
async function cargarEstadisticas() {
    try {
        // Consultar compras
        const { data: compras, error: errorCompras } = await supabase
            .from("transacciones")
            .select("*")
            .eq("id_comprador", userId)
            .eq("tipo_transaccion", "compra");

        if (errorCompras) throw errorCompras;

        // Consultar ventas
        const { data: ventas, error: errorVentas } = await supabase
            .from("transacciones")
            .select("*")
            .eq("id_vendedor", userId)
            .eq("tipo_transaccion", "venta");

        if (errorVentas) throw errorVentas;

        // Calcular totales
        const totalCompras = compras.reduce((acc, item) => acc + item.monto, 0);
        const totalVentas = ventas.reduce((acc, item) => acc + item.monto, 0);

        // Actualizar el DOM
        document.getElementById("totalCompras").textContent = `Total Compras: $${totalCompras}`;
        document.getElementById("totalVentas").textContent = `Total Ventas: $${totalVentas}`;
        
        const historialCompras = document.getElementById("historialCompras");
        historialCompras.innerHTML = compras
            .map((item) => `<li>${item.concepto} - $${item.monto}</li>`)
            .join("");

        const historialVentas = document.getElementById("historialVentas");
        historialVentas.innerHTML = ventas
            .map((item) => `<li>${item.concepto} - $${item.monto}</li>`)
            .join("");

        // Crear gráfica
        actualizarGrafica(totalCompras, totalVentas);
    } catch (error) {
        console.error("Error al cargar estadísticas:", error);
    }
}

// Función para actualizar la gráfica
function actualizarGrafica(totalCompras, totalVentas) {
    if (chart) chart.destroy(); // Eliminar gráfica previa si existe

    chart = new Chart(barChart, {
        type: "bar",
        data: {
            labels: ["Compras", "Ventas"],
            datasets: [
                {
                    label: "Monto en MXN",
                    data: [totalCompras, totalVentas],
                    backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(153, 102, 255, 0.6)"],
                    borderColor: ["rgba(75, 192, 192, 1)", "rgba(153, 102, 255, 1)"],
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
        },
    });
}

// Cargar estadísticas al cargar la página
cargarEstadisticas();
