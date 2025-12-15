import React, { useMemo } from "react";
import PageLayout from "layouts/PageLayout";
import { useGetAnalytics } from "queries/AnalyticsQuery";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
    color: "#e0e0e0", // Lighter text for dark backgrounds if applicable, or generic dark grey
  },
  header: {
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: "28px",
    fontWeight: "800",
    background: "linear-gradient(45deg, #2196F3, #21CBF3)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  dateText: {
    fontSize: "14px",
    color: "#888",
    marginTop: "5px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "24px",
    border: "1px solid rgba(255, 255, 255, 0.6)",
    boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "160px",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
  },
  cardIcon: {
    position: "absolute",
    right: "-10px",
    bottom: "-10px",
    fontSize: "100px",
    opacity: 0.1,
    transform: "rotate(-15deg)",
    color: "#000",
  },
  cardTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#636e72",
    zIndex: 1,
  },
  cardValue: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#2d3436",
    zIndex: 1,
  },
  cardTrend: {
    fontSize: "13px",
    color: "#00b894",
    marginTop: "5px",
    fontWeight: "600",
    zIndex: 1,
  },
  sectionTitle: {
    fontSize: "20px",
    fontWeight: "700",
    marginBottom: "20px",
    color: "#444",
  },
  quickActions: {
    display: "flex",
    gap: "15px",
    marginBottom: "40px",
    flexWrap: "wrap",
  },
  actionBtn: {
    padding: "12px 24px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #6c5ce7, #a29bfe)",
    color: "white",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(108, 92, 231, 0.4)",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  chartRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "24px",
  },
  chartContainer: {
    background: "rgba(255, 255, 255, 0.6)",
    backdropFilter: "blur(15px)",
    borderRadius: "24px",
    padding: "24px",
    border: "1px solid rgba(255, 255, 255, 0.5)",
    boxShadow: "0 8px 32px rgba(31, 38, 135, 0.07)",
    height: "350px",
    display: "flex",
    flexDirection: "column",
  }
};

function Dashboard() {
  const { data, isLoading } = useGetAnalytics();
  const navigate = useNavigate();
  const stats = data?.data?.counts || {};
  const charts = data?.data?.charts || {};

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const cardHover = {
    scale: 1.03,
    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15)",
    transition: { type: "spring", stiffness: 300 }
  };

  // Prepare Chart Data
  const statusData = useMemo(() => {
    if (!charts.projectsByStatus) return { labels: [], datasets: [] };
    const labels = charts.projectsByStatus.map(i => i._id || "Unknown");
    const counts = charts.projectsByStatus.map(i => i.count);
    return {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: ["#00b894", "#0984e3", "#fdcb6e", "#d63031", "#6c5ce7"],
        borderColor: "transparent",
      }]
    };
  }, [charts.projectsByStatus]);

  const categoryData = useMemo(() => {
    if (!charts.categoryDistribution) return { labels: [], datasets: [] };
    const labels = charts.categoryDistribution.map(i => i._id);
    const counts = charts.categoryDistribution.map(i => i.count);
    return {
      labels,
      datasets: [{
        label: "Projects",
        data: counts,
        backgroundColor: "#74b9ff",
        borderRadius: 6,
      }]
    };
  }, [charts.categoryDistribution]);


  if (isLoading) return <PageLayout title="Dashboard"><div style={{ padding: 40, textAlign: "center" }}>Loading Command Center...</div></PageLayout>;

  return (
    <PageLayout title="Command Center">
      <motion.div
        style={styles.container}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <div style={styles.header}>
          <div>
            <div style={styles.welcomeText}>Welcome back, Admin!</div>
            <div style={styles.dateText}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={styles.grid}>
          <motion.div style={styles.card} variants={itemVariants} whileHover={cardHover} onClick={() => navigate('/projects')}>
            <div style={styles.cardTitle}>TOTAL PROJECTS</div>
            <div style={styles.cardValue}>{stats.projects || 0}</div>
            <div style={styles.cardTrend}>Active & Listed</div>
            <div style={styles.cardIcon}>🏢</div>
          </motion.div>

          <motion.div style={styles.card} variants={itemVariants} whileHover={cardHover} onClick={() => navigate('/builders')}>
            <div style={styles.cardTitle}>BUILDERS</div>
            <div style={styles.cardValue}>{stats.builders || 0}</div>
            <div style={styles.cardTrend}>Verified Partners</div>
            <div style={styles.cardIcon}>👷</div>
          </motion.div>

          <motion.div style={{ ...styles.card, background: "rgba(255, 255, 255, 0.9)" }} variants={itemVariants} whileHover={cardHover} onClick={() => navigate('/projectEnquiry')}>
            <div style={styles.cardTitle}>ENQUIRIES</div>
            <div style={{ ...styles.cardValue, color: "#6c5ce7" }}>{stats.enquiries || 0}</div>
            <div style={styles.cardTrend}>Potential Leads</div>
            <div style={styles.cardIcon}>📩</div>
          </motion.div>

          <motion.div style={styles.card} variants={itemVariants} whileHover={cardHover} onClick={() => navigate('/users')}>
            <div style={styles.cardTitle}>USERS</div>
            <div style={styles.cardValue}>{stats.users || 0}</div>
            <div style={styles.cardTrend}>Registered</div>
            <div style={styles.cardIcon}>👥</div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} style={{ marginBottom: 40 }}>
          <div style={styles.sectionTitle}>Quick Actions</div>
          <div style={styles.quickActions}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={styles.actionBtn} onClick={() => navigate('/projects/addProjects')}>
              <span>✨</span> Add New Project
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ ...styles.actionBtn, background: "linear-gradient(135deg, #00b894, #55efc4)" }} onClick={() => navigate('/builders/addBuilders')}>
              <span>🏗</span> Add Builder
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ ...styles.actionBtn, background: "linear-gradient(135deg, #0984e3, #74b9ff)" }} onClick={() => navigate('/analytics')}>
              <span>📊</span> View Full Analytics
            </motion.button>
          </div>
        </motion.div>

        {/* Charts Preview */}
        <div style={styles.chartRow}>
          <motion.div style={styles.chartContainer} variants={itemVariants}>
            <div style={styles.cardTitle}>PROJECT STATUS</div>
            <div style={{ flex: 1, position: "relative", display: "flex", justifyContent: "center", padding: "10px" }}>
              <Doughnut data={statusData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }} />
            </div>
          </motion.div>

          <motion.div style={styles.chartContainer} variants={itemVariants}>
            <div style={styles.cardTitle}>CATEGORIES</div>
            <div style={{ flex: 1, position: "relative" }}>
              <Bar data={categoryData} options={{ maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false } }, y: { grid: { display: false } } } }} />
            </div>
          </motion.div>
        </div>

      </motion.div>
    </PageLayout>
  );
}

export default Dashboard;
