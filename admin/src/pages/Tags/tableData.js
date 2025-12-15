import { useState } from "react";
import { Box, TextField, Pagination, MenuItem, Select, IconButton, Skeleton, Avatar, Chip } from "@mui/material";
import { useGetTags } from "queries/StoreQuery";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// -- Styles --
const styles = {
  container: {
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    height: "calc(100vh - 140px)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  searchField: {
    background: "rgba(255, 255, 255, 0.6)",
    borderRadius: "12px",
    width: "300px",
    "& fieldset": { border: "none" },
  },
  tableWrapper: {
    flex: 1,
    overflow: "auto",
    borderRadius: "15px",
    boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)",
  },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0 8px",
  },
  th: {
    padding: "16px",
    color: "#6c757d",
    fontWeight: "600",
    fontSize: "13px",
    textAlign: "left",
    textTransform: "uppercase",
    borderBottom: "none",
    cursor: "pointer",
    userSelect: "none",
  },
  tr: {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(5px)",
    borderRadius: "12px",
    transition: "all 0.2s ease",
    cursor: "default",
  },
  td: {
    padding: "16px",
    fontSize: "14px",
    color: "#555",
    borderTop: "1px solid rgba(0,0,0,0.02)",
    borderBottom: "1px solid rgba(0,0,0,0.02)",
    verticalAlign: "middle",
  },
  statusBadge: (isActive) => ({
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    background: isActive ? "rgba(46, 204, 113,0.15)" : "rgba(231, 76, 60, 0.15)",
    color: isActive ? "#27ae60" : "#c0392b",
    display: "inline-block",
  }),
  actionButton: {
    background: "rgba(255, 255, 255, 0.8)",
    borderRadius: "8px",
    padding: "6px",
    color: "#888",
    transition: "all 0.2s",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
    "&:hover": {
      background: "#fff",
      color: "#333",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    }
  }
};

const TableData = () => {
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useGetTags({ page, perPage, sortBy, order, search });

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const rowVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <TextField
          placeholder="Search tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
          sx={styles.searchField}
        />
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            size="small"
            sx={{ height: 40, background: "rgba(255,255,255,0.8)", borderRadius: "10px", minWidth: 140 }}
          >
            <MenuItem value="createdAt">Created Date</MenuItem>
            <MenuItem value="title">Title</MenuItem>
          </Select>
          <IconButton onClick={() => setOrder(order === "asc" ? "desc" : "asc")} sx={{ background: "rgba(255,255,255,0.8)" }}>
            <Box component="i" className={`ni ni-bold-${order === "asc" ? "up" : "down"}`} fontSize="12px" />
          </IconButton>
        </div>
      </div>

      {isLoading ? (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Tag Details</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Status</th>
                <th style={styles.th}>Created On</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(6)].map((_, index) => (
                <tr key={index} style={{ background: "white", boxShadow: "0 2px 5px rgba(0,0,0,0.02)", borderRadius: "12px" }}>
                  <td style={{ ...styles.td, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Skeleton variant="rounded" width={50} height={40} />
                      <Box>
                        <Skeleton variant="text" width={100} height={20} />
                        <Skeleton variant="text" width={80} height={14} />
                      </Box>
                    </div>
                  </td>
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <Skeleton variant="rectangular" width={70} height={24} sx={{ borderRadius: 4, margin: "auto" }} />
                  </td>
                  <td style={styles.td}>
                    <Skeleton variant="text" width={90} height={20} />
                  </td>
                  <td style={{ ...styles.td, borderTopRightRadius: 12, borderBottomRightRadius: 12, textAlign: "center" }}>
                    <Skeleton variant="circular" width={30} height={30} sx={{ margin: "auto" }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th} onClick={() => handleSort("title")}>Tag Details {sortBy === "title" && (order === "asc" ? "↑" : "↓")}</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Status</th>
                <th style={styles.th} onClick={() => handleSort("createdAt")}>Created On {sortBy === "createdAt" && (order === "asc" ? "↑" : "↓")}</th>
                <th style={{ ...styles.th, textAlign: "center" }}>Action</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
              {data?.data?.map((item) => (
                <motion.tr
                  key={item._id}
                  variants={rowVariants}
                  style={styles.tr}
                  whileHover={{ scale: 1.01, boxShadow: "0 5px 15px rgba(0,0,0,0.05)" }}
                >
                  {/* Tag Column */}
                  <td style={{ ...styles.td, borderTopLeftRadius: 12, borderBottomLeftRadius: 12 }}>
                    <Box display="flex" alignItems="center">
                      <Avatar
                        src={`${process.env.REACT_APP_API_URL}/uploads/${item?.image}`}
                        alt={item?.title}
                        variant="rounded"
                        sx={{ width: 60, height: 40, mr: 2, borderRadius: "8px", objectFit: "cover" }}
                      />
                      <Box display="flex" flexDirection="column">
                        <span style={{ fontWeight: 600, color: "#333" }}>{item?.title}</span>
                        <span style={{ fontSize: "12px", color: "#888" }}>{item?.subtitle}</span>
                      </Box>
                    </Box>
                  </td>

                  {/* Status Column */}
                  <td style={{ ...styles.td, textAlign: "center" }}>
                    <div style={styles.statusBadge(item?.status)}>
                      {item?.status ? "Active" : "Blocked"}
                    </div>
                  </td>

                  {/* Date Column */}
                  <td style={styles.td}>
                    <div style={{ fontSize: "13px" }}>{new Date(item?.createdAt).toDateString()}</div>
                  </td>

                  {/* Action Column */}
                  <td style={{ ...styles.td, borderTopRightRadius: 12, borderBottomRightRadius: 12, textAlign: "center" }}>
                    <Link to={`/tags/editTags/${item?._id}`} style={styles.actionButton}>
                      <Box component="i" className="ni ni-settings-gear-65" fontWeight="bold" />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      )}

      {/* Pagination component commented out if API doesn't return totalDocs, otherwise uncomment */}
      {/* <Box display="flex" justifyItems="center" justifyContent="center" mt={3}>
        <Pagination
          count={Math.ceil((data?.totalDocs || 0) / perPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </Box> */}
    </div>
  );
};

export default TableData;
