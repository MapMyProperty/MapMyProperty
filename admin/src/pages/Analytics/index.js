import React, { useMemo } from "react";
import { useGetAnalytics } from "queries/AnalyticsQuery";
import PageLayout from "layouts/PageLayout";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Analytics = () => {
    const { data, isLoading } = useGetAnalytics();
    const stats = data?.data?.counts || {};
    const charts = data?.data?.charts || {};

    // -- Modern / Glassmorphism Styles (Inline for simplicity without external CSS files) --
    const styles = {
        container: {
            padding: "20px",
            fontFamily: "'Inter', sans-serif",
            color: "#333",
        },
        grid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px",
            marginBottom: "40px",
        },
        card: {
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "transform 0.2s ease",
        },
        cardTitle: {
            fontSize: "14px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            color: "#6c757d",
            marginBottom: "10px",
            fontWeight: 600,
        },
        cardValue: {
            fontSize: "36px",
            fontWeight: "700",
            color: "#2d3436",
        },
        chartContainer: {
            background: "rgba(255, 255, 255, 0.6)",
            backdropFilter: "blur(15px)",
            borderRadius: "20px",
            padding: "20px",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
            height: "400px",
            display: "flex",
            flexDirection: "column",
        },
        chartGrid: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "30px",
        },
        chartHeader: {
            fontSize: "18px",
            fontWeight: "600",
            marginBottom: "20px",
            color: "#444",
        },
        loading: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            fontSize: "20px",
            color: "#666"
        }
    };

    // -- Charts Data Preparation --
    const lineData = useMemo(() => {
        if (!charts.enquiriesTrend) return { labels: [], datasets: [] };
        const labels = charts.enquiriesTrend.map((item) => `${item._id.month}/${item._id.year}`);
        const counts = charts.enquiriesTrend.map((item) => item.count);

        return {
            labels,
            datasets: [
                {
                    label: "Enquiries",
                    data: counts,
                    borderColor: "#6c5ce7",
                    backgroundColor: "rgba(108, 92, 231, 0.2)",
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: "#fff",
                    pointBorderColor: "#6c5ce7",
                    pointRadius: 6,
                },
            ],
        };
    }, [charts.enquiriesTrend]);

    const doughnutData = useMemo(() => {
        if (!charts.projectsByStatus) return { labels: [], datasets: [] };
        const labels = charts.projectsByStatus.map((item) => item._id || "Unknown");
        const counts = charts.projectsByStatus.map((item) => item.count);

        return {
            labels,
            datasets: [
                {
                    data: counts,
                    backgroundColor: ["#00b894", "#0984e3", "#fdcb6e", "#e17055", "#636e72"],
                    borderWidth: 0,
                },
            ],
        };
    }, [charts.projectsByStatus]);

    const barData = useMemo(() => {
        if (!charts.categoryDistribution) return { labels: [], datasets: [] };
        const labels = charts.categoryDistribution.map((item) => item._id);
        const counts = charts.categoryDistribution.map((item) => item.count);

        return {
            labels,
            datasets: [
                {
                    label: "Projects",
                    data: counts,
                    backgroundColor: "rgba(253, 121, 168, 0.6)",
                    borderRadius: 8,
                },
            ],
        };
    }, [charts.categoryDistribution]);


    if (isLoading) {
        return (
            <PageLayout title="Analytics">
                <div style={styles.loading}>Loading Dashboard...</div>
            </PageLayout>
        );
    }

    return (
        <PageLayout title="Analytics & Insights">
            <div style={styles.container}>

                {/* KPI Cards */}
                <div style={styles.grid}>
                    <div style={styles.card}>
                        <div style={styles.cardTitle}>Total Projects</div>
                        <div style={styles.cardValue}>{stats.projects || 0}</div>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.cardTitle}>Verified Builders</div>
                        <div style={styles.cardValue}>{stats.builders || 0}</div>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.cardTitle}>Total Enquiries</div>
                        <div style={styles.cardValue}>{stats.enquiries || 0}</div>
                    </div>
                    <div style={styles.card}>
                        <div style={styles.cardTitle}>Registered Users</div>
                        <div style={styles.cardValue}>{stats.users || 0}</div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div style={styles.chartGrid}>

                    {/* Line Chart */}
                    <div style={styles.chartContainer}>
                        <div style={styles.chartHeader}>Enquiries Growth Trend</div>
                        <div style={{ flex: 1, position: "relative" }}>
                            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { color: "rgba(0,0,0,0.05)" } }, x: { grid: { display: false } } } }} />
                        </div>
                    </div>

                    {/* Doughnut Chart */}
                    <div style={styles.chartContainer}>
                        <div style={styles.chartHeader}>Project Status Distribution</div>
                        <div style={{ flex: 1, position: "relative", display: "flex", justifyContent: "center" }}>
                            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } }, cutout: '70%' }} />
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div style={{ ...styles.chartContainer, gridColumn: "1 / -1" }}>
                        <div style={styles.chartHeader}>Projects by Category</div>
                        <div style={{ flex: 1, position: "relative" }}>
                            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, grid: { display: false } }, x: { grid: { display: false } } } }} />
                        </div>
                    </div>

                </div>
            </div>
        </PageLayout>
    );
};

export default Analytics;
